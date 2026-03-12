import { computed, Injectable, inject, Signal, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Tarea } from '../interfaces/tarea';
import { Columna } from '../interfaces/columnas';
import { Filtro } from '../interfaces/filtro';
import { CriterioOrden } from '../interfaces/orden';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Tag } from '../interfaces/tag';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  // ------- SIGNALS PRIVADAS -------

  // Para poder crear elementos en Exportar
  private readonly document = inject(DOCUMENT);

  // readonly evita reasignar la propiedad, porque nunca debe de cambiar
  private readonly storageKey = 'tareas';

  // Signal privada que contiene el estado de las tareas (propiedad que solo se puede usar en el servicio)
  // Implemento las convenciones de propiedades privadas (_tareas)
  // Signal inicializada como array vacío ([])
  private readonly _tareas = signal<Tarea[]>([]);

  private readonly _columnas = signal<Columna[]>([
    { id: 'backlog', titulo: "Backlog" },
    { id: 'to-do', titulo: "To Do" },
    { id: 'doing', titulo: "Doing" },
    { id: 'done', titulo: "Done" }
  ]);

  // Signal que guarda el filtro que está activado en ese momento
  private readonly _filtroActivo = signal<Filtro[]>([]);

  // Signal que guarda la busqueda
  private readonly _busqueda = signal<string>('');

  // Signal que guarda el orden
  private readonly _orden = signal<CriterioOrden[]>([
    { nombre: 'Prioridad', campo: 'prioridad', direccion: 'asc', activo: false },
    { nombre: 'Fecha creación', campo: 'fecha-creacion', direccion: 'asc', activo: false },
    { nombre: 'Fecha límite', campo: 'fecha-limite', direccion: 'asc', activo: false }
  ]);

  // Objeto para asignar un numero a cada prioridad
  private readonly ordenPrioridad = {
    'Alta': 1,
    'Media': 2,
    'Baja': 3
  }

  // Signal para tareas seleccionadas, solo guardamos el id
  private readonly _tareasSeleccionadas = signal<string[]>([]);

  // Signals para los rangos de fechas como filtros
  private readonly _fechaLimiteInicioFiltro = signal<number | null>(null);
  private readonly _fechaLimiteFinFiltro = signal<number | null>(null);
  private readonly _fechaCreacionInicioFiltro = signal<number | null>(null);
  private readonly _fechaCreacionFinFiltro = signal<number | null>(null);

  // Signal para tags ya usadas
  private readonly _tagsUsadas = signal<Tag[]>([]);


  // ------------ SIGNALS PÚBLICAS ------------

  // Signal para la lectura de las tareas seleccionas
  readonly tareasSeleccionadas = this._tareasSeleccionadas.asReadonly();

  // Sigal para lectura de los criterios de orden
  readonly orden = this._orden.asReadonly();

  // Signal para lectura de las tags ya usadas
  readonly tagsUsadas = this._tagsUsadas.asReadonly();


  // ------------ COMPUTED -----------------

  columnasFiltradas = computed(() => {
    const filtros = this._filtroActivo();

    if (!filtros.length) return this._columnas();

    const filtrosColumnas = new Set(['backlog', 'to-do', 'doing', 'done']);
    const columnasSeleccionadas = filtros.filter(f => filtrosColumnas.has(f));

    if (columnasSeleccionadas.length === 0) return this._columnas();

    return this._columnas().filter(columna =>
      filtros.includes(columna.id as Filtro)
    );
  });

  getTareasPorColumna(columnaId: string): Signal<Tarea[]> {
    return computed(() => {

      let tareas = this.buscarTareas();
      tareas = this.filtrarTareas(tareas);
      tareas = this.filtarPorFecha(tareas);
      tareas = this.ordenarTareas(tareas);
      tareas = tareas.filter(tarea => tarea.estado === columnaId);

      return tareas;
    });
  };

  private buscarTareas(): Tarea[] {
    const busqueda = this._busqueda().toLowerCase().trim();
    let tareas = [...this._tareas()];

    if (busqueda) {
      tareas = tareas.filter(tarea => tarea.texto.toLowerCase().includes(busqueda));
    }

    return tareas;
  }

  private filtrarTareas(tareas: Tarea[]): Tarea[] {
    const filtros = this._filtroActivo();
    const filtrosPrioridad = new Set(['Alta', 'Media', 'Baja']);

    if (filtros.some(f => filtrosPrioridad.has(f))){
      tareas = tareas.filter(tarea => filtros.includes(tarea.prioridad));
    }

    return tareas;
  }

  private ordenarTareas(tareas: Tarea[]): Tarea[] {
    // Solo ordenaremos por los criterios que estén activos con el checkbox
    const criterios = this._orden().filter(criterio => criterio.activo);

    if (!criterios.length) {
      return [...tareas].sort((a, b) => a.orden - b.orden);
    };

    return [...tareas].sort((a, b) => {
      for (const criterio of criterios) {
        let resultado = 0;

        if (criterio.campo === 'prioridad') {
          resultado = this.ordenPrioridad[b.prioridad] - this.ordenPrioridad[a.prioridad];
        } else if (criterio.campo === 'fecha-creacion') {
          resultado = a.fechaCreacion - b.fechaCreacion;
        } else if (criterio.campo === 'fecha-limite') {
          resultado = a.fechaLimite - b.fechaLimite;
        }

        if (criterio.direccion === 'desc') resultado *= -1;

        if (resultado !== 0) return resultado;
      }
      return 0;
    });
  }

  private filtarPorFecha(tareas: Tarea[]): Tarea[] {
    const inicioCreacion = this._fechaCreacionInicioFiltro();
    const finCreacion = this._fechaCreacionFinFiltro();
    const inicioLimite = this._fechaLimiteInicioFiltro();
    const finLimite = this._fechaLimiteFinFiltro();

    if (inicioCreacion && finCreacion){
      tareas = tareas.filter(tarea => 
        tarea.fechaCreacion >= inicioCreacion && tarea.fechaCreacion <= finCreacion
      );
    }

    if (inicioLimite && finLimite) {
      tareas = tareas.filter(tarea => 
        tarea.fechaLimite >= inicioLimite && tarea.fechaLimite <= finLimite
      );
    }
    

    return tareas;
  }

// -------------- CONSTRUCTOR ------------------

  constructor() {
    this.cargarDesdeStorage();
  }

// -------------- MÉTODOS PRIVADOS ---------------

  // Carga las tareas desde localStorage al iniciar el servicio
  private cargarDesdeStorage(): void {
    const tareasGuardadas = localStorage.getItem(this.storageKey);

    if (!tareasGuardadas) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
      return;
    }

    // Aseguramos a TS que lo que va a recibir es un array de Tarea
    this._tareas.set(JSON.parse(tareasGuardadas) as Tarea[]);

    // Cargar tags guardadas
    const tagsGuardadas = localStorage.getItem('tags');

    if(!tagsGuardadas) {
      localStorage.setItem('tags', JSON.stringify([]));
      return;
    }

    this._tagsUsadas.set(JSON.parse(tagsGuardadas) as Tag[]);
  }

  // Guardar las tareas en localStorage
  private guardar(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this._tareas()));
  }

  // Guardar las tags en localStorage
  private guardarTags(): void {
    localStorage.setItem('tags', JSON.stringify(this._tagsUsadas()));
  }

// -------------- MÉTODOS PÚBLICOS ---------------

  // Agregar una nueva tarea
  agregarTarea(texto: string, prioridad: Tarea['prioridad'], fechaLimite: string, tags: Tag[]): void {

    // Para conseguir los arrays internos de las columnas
    // y así poder asignar un orden
    const tareasDeBacklog = this._tareas().filter(t => t.estado === 'backlog');

    const nuevaTarea: Tarea = {
      id: crypto.randomUUID(),
      texto,
      prioridad,
      estado: 'backlog',
      orden: tareasDeBacklog.length,
      fechaCreacion: Date.now(),
      fechaLimite: new Date(fechaLimite).getTime(),
      tags
    };

    // Update de la signal de tareas
    // tareas es el parámetro actual y [...tareas, nuevaTarea] es
    // una nueva copia de tareas + la nueva
    // ... expande los elementos del array en un array nuevo
    this._tareas.update(tareas => [...tareas, nuevaTarea]);
    this.guardar();
  }

  // Editar una tarea
  modificarTarea(tareaEditada: Tarea): void {
    this._tareas.update(tareas =>
      tareas.map(t => t.id === tareaEditada.id ? tareaEditada : t)
    );
    this.guardar();
  };

  // Borrar tarea
  borrarTarea(id: string): void {
    this._tareas.update(tareas => tareas.filter(tarea => tarea.id !== id));
    this.guardar();
  }

  // Cambiar la busqueda
  cambiarBusqueda(textoBusqueda: string): void {
    this._busqueda.set(textoBusqueda);
  };


  cambiarOrden(indicePrevio: number, indiceActual: number): void {
    this._orden.update(listaOrden => {
      // Creamos una copia para no mutar la existente, si no la signal no se entera
      const nueva = [...listaOrden];
      // Utilidad de Angular CDK para mover elementos
      moveItemInArray(nueva, indicePrevio, indiceActual);
      return nueva;
    })
  }

  cambiarDireccionOrden(criterio: CriterioOrden): void {
    this._orden.update(listaOrden => 
      listaOrden.map(o => {
        if (o.campo !== criterio.campo) return o;
        return { ...o, direccion: criterio.direccion === 'asc' ? 'desc' : 'asc'};
      }
      )
    )
  }

  // Buscamos el objeto de la signal de orden que concuerde con el criterio de 
  // orden activado y cuando lo encuentre, le cambiamos la propiedad "activo"
  activarDesactivarOrden(criterio: CriterioOrden): void {
    this._orden.update(listaOrden =>
      listaOrden.map(o => {
        if (o.campo !== criterio.campo) return o;
        return { ...o, activo: !o.activo };
      })
    );
  }

  // Sobreescribimos la signal de filtros activos según los marcados en Prioridad y Estado
  cambiarFiltro(listaSeleccionados: Filtro[]): void {
    this._filtroActivo.set(listaSeleccionados);
  }

  // Cambiamos el estado al hacer drag and drop
  // cambiarEstado(tarea: Tarea, nuevoEstado: Tarea['estado']): void {
  //   this._tareas.update(tareas =>
  //     tareas.map(t => t.id === tarea.id ? { ...tarea, estado: nuevoEstado } : t)
  //   );
  //   this.guardar();
  // }

  // Pasar tareas de una columna a otra, teniendo en cuenta el indice
  transferirEntreColumnas(
    columnaOrigen: Tarea[],
    columnaDestino: Tarea[],
    indicePrevio: number,
    indiceFinal: number,
    nuevoEstado: Tarea['estado']
  ): void {
    const origenReordenado = [...columnaOrigen];
    const destinoReordenado = [...columnaDestino];

    transferArrayItem(origenReordenado, destinoReordenado, indicePrevio, indiceFinal);

    const nuevosOrdenesOrigen = new Map(
      origenReordenado.map((tarea, index) => [tarea.id, index])
    );

    const nuevosOrdenesDestino = new Map(
      destinoReordenado.map((tarea, index) => [tarea.id, index])
    );

    this._tareas.update(tareas =>
      tareas.map(t => {
        if (nuevosOrdenesOrigen.has(t.id)) {
          return {
            ...t,
            orden: nuevosOrdenesOrigen.get(t.id)!
          };
        }

        if (nuevosOrdenesDestino.has(t.id)) {
          return {
            ...t,
            estado: nuevoEstado,
            orden: nuevosOrdenesDestino.get(t.id)!
          };
        }

        return t;
      })
    );

    this.guardar();
  }

  reordenarDentroDeColumna(columna: Tarea[], indicePrevio: number, indiceActual: number): void {
    console.log(indicePrevio)
    // Copiamos el array de la columna para no tocar el original
    const columnaReordenada = [...columna];

    // Reordenamos la copia según el drag and drop
    moveItemInArray(columnaReordenada, indicePrevio, indiceActual);

    // Creamos un mapa: id de tarea -> nuevo índice
    const nuevosOrdenes = new Map(
      columnaReordenada.map((tarea, index) => [tarea.id, index])
    );
    console.log(nuevosOrdenes)

    // Actualizamos la signal real de tareas con los nuevos índices
    this._tareas.update(tareas =>
      tareas.map(t =>
        nuevosOrdenes.has(t.id)
          ? { ...t, orden: nuevosOrdenes.get(t.id)! }
          : t
      )
    );

    this.guardar();
    console.log(indiceActual)
  }

  cambiarRangoFechas(inicio: number | null, fin: number | null, tipo: string): void {
    if (tipo === 'creacion'){
      this._fechaCreacionInicioFiltro.set(inicio);
      this._fechaCreacionFinFiltro.set(fin);
    } else {
      this._fechaLimiteInicioFiltro.set(inicio);
      this._fechaLimiteFinFiltro.set(fin);
    }
    
  }

  // TAGS

  anadirTags(tags: Tag[]): void {
    const tagsNuevas = tags.filter(tag => !this._tagsUsadas().some(tagUsada => tagUsada.nombre === tag.nombre));
    this._tagsUsadas.update(tags => [...tags, ...tagsNuevas]);
    this.guardarTags();
  }

  // EXPORTAR E IMPORTAR

  exportarTareas(): void {
    let tareasSeleccionadas = this._tareas().filter(tarea => this._tareasSeleccionadas().includes(tarea.id));
    const json = JSON.stringify(tareasSeleccionadas.length > 0 ? tareasSeleccionadas : this._tareas(), null, 2); // null para que no filtre ni convierta las propiedades
    const blob = new Blob([json], { type: 'application/json' }); // Objeto que representa datos en crudo, solo en memoria del navegador
    const url = URL.createObjectURL(blob); // Dirección temporal en memoria que apunta al Blob
    const a = this.document.createElement('a');
    a.href = url; // Enlace invisible que apunta a la URL del blob
    a.download = 'tareas.json'; // En vez de navegar, el enlace descarga
    a.click(); // Simula un click en el enlace invisible, dispara la descarga
    URL.revokeObjectURL(url); // Borramos la ruta temporal
  };

  async importarTareas(event: Event): Promise<void> {
    // Casteamos el target a HTMLInputElement para acceder a .files
    // Si no, devolveria un tipo genérico y no podriamos acceder a 
    // la propiedad files
    const input = event.target as HTMLInputElement;

    // Si no hay archivos salimos
    if (!input.files?.length) return;

    // Como tenemos una lista de archivo, no acepta .map, por eso lo convertimos a Array normal
    for (const archivo of Array.from(input.files)) {

      // Le indicamos a JS que espere hasta que la promesa se resuelva y "texto" tenga el valor leido
      // .text() lee los bytes del archivo y decodifica como texto UTF-8
      // cuando termina de leer, devuelve la promesa resuelta con el contenido
      // await se encarga de extraer el contenido de la promesa
      const texto = await archivo.text(); // la promesa que devuelve .text() es independiente a la general del metodo
      const tareasImportadas = JSON.parse(texto) as Tarea[];

      this._tareas.update(tareas => {

        // Reasignamos IDs a las tareas importadas 
        const tareasConNuevoId = tareasImportadas.map(tarea => ({
          ...tarea,
          id: crypto.randomUUID()
        }));
        return [...tareas, ...tareasConNuevoId];
      });
      this.guardar();
    }
  }

  // SELECCIÓN DE TAREAS

  // Comprueba si esta o no seleccionada, añade o quita en función de la comprobación
  alternarGuardadoSeleccionadas(id: string): void {
    this._tareasSeleccionadas.update(seleccionadas =>
      seleccionadas.includes(id)
        ? seleccionadas.filter(s => s !== id) // si ya estaba, la quita
        : [...seleccionadas, id] // si no estaba, la añade
    );
  }

  // Sacamos todos los ids de la signal principal
  seleccionarTodas(): void {
    const todosLosIds = this._tareas().map(tarea => tarea.id);
    this._tareasSeleccionadas.set(todosLosIds);
  }


  borrarSeleccionadas(): void {
    const seleccionadas = this._tareasSeleccionadas();
    this._tareas.update(tareas =>
      tareas.filter(tarea => !seleccionadas.includes(tarea.id))); // Cogemos solo los que no estan seleccionados

    this.limpiarSeleccion();
    this.guardar();
  }


  limpiarSeleccion(): void {
    this._tareasSeleccionadas.set([]);
  }

  // Signal que reacciona cuando cambiamos la signal de seleccionadas
  // .includes retorna boolean
  estaSeleccionada(id: string): Signal<boolean> {
    return computed(() => this._tareasSeleccionadas().includes(id));
  }
}
