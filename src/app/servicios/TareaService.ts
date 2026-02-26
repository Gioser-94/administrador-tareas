import { computed, Injectable, Signal, signal } from '@angular/core';
import { Tarea } from '../interfaces/tarea';
import { Columna } from '../interfaces/columnas';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  // readonly evita reasignar la propiedad, porque nunca debe de cambiar
  private readonly storageKey = 'tareas';

  // Signal privada que contiene el estado de las tareas (propiedad que solo se puede usar en el servicio)
  // Implemento las convenciones de propiedades privadas (_tareas)
  // Signal inicializada como array vacío ([])
  private readonly _tareas = signal<Tarea[]>([]);

  readonly columnas = signal<Columna[]>([
    { id: 'backlog', titulo: "Backlog"},
    { id: 'to-do', titulo: "To Do"},
    { id: 'doing', titulo: "Doing"},
    { id: 'done', titulo: "Done"}
  ]);

  // Signal computada: número de tareas pendientes
  // computed() crea una signal cuyo valor se deriva automáticamente de otra signal
  // Guarda el numero de tareas pendientes segun el estado actual de la Signal
  /*
  readonly tareasPendientes = computed(() => 
    this._tareas().filter(tarea => !tarea.estaCompletada).length
  );

  readonly tareasCompletadas = computed(() => 
    this._tareas().filter(tarea => tarea.estaCompletada).length
  );
  */

  // Signal que guarda el filtro que está activado en ese momento
  readonly filtroActivo = signal<'Todas' | 'Pendientes' | 'Completadas'>('Todas');

  // Signal que guarda la busqueda
  private readonly _busqueda = signal<string>('');

  // Signal que guarda el orden
  private readonly _orden = signal<'sin-orden' | 'prioridad-asc' | 'prioridad-desc' | 'fecha-creacion-asc' | 'fecha-creacion-desc' | 'fecha-limite-asc' | 'fecha-limite-desc'>('sin-orden');

  // Objeto para asignar un numero a cada prioridad
  private readonly ordenPrioridad = {
    'Alta': 1,
    'Media': 2,
    'Baja': 3
  }

  // Computed que devuelve las tareas según el filtro
  readonly tareasFiltradas = computed(() => {
    const busqueda = this._busqueda().toLowerCase().trim();
    const orden = this._orden();
    let tareas = this._tareas(); // necesitamos let porque se reasigna con la búsqueda

    if(busqueda) {
      tareas = tareas.filter(tarea => tarea.texto.toLowerCase().includes(busqueda));
    }

    switch (orden) {
      case 'prioridad-asc':
        tareas.sort((a, b) => this.ordenPrioridad[a.prioridad] - this.ordenPrioridad[b.prioridad]);
        break;
      case 'prioridad-desc':
        tareas.sort((a, b) => this.ordenPrioridad[b.prioridad] - this.ordenPrioridad[a.prioridad]);
        break;
      case 'fecha-creacion-asc':
        tareas.sort((a, b) => a.fechaCreacion - b.fechaCreacion);
        break;
      case 'fecha-creacion-desc':
        tareas.sort((a, b) => b.fechaCreacion - a.fechaCreacion);
        break;
      case 'fecha-limite-asc':
        tareas.sort((a, b) => a.fechaLimite - b.fechaLimite);
        break;
      case 'fecha-limite-desc':
        tareas.sort((a, b) => b.fechaLimite - a.fechaLimite);
        break; 
      default:
        tareas.sort((a, b) => a.id - b.id);
        break;
    };

    return tareas;
  });

  constructor() {
    this.cargarDesdeStorage();
  }

  // Carga las tareas desde localStorage al iniciar el servicio
  private cargarDesdeStorage(): void {
    const tareasGuardadas = localStorage.getItem(this.storageKey);

    if(!tareasGuardadas) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
      return;
    }

    // Aseguramos a TS que lo que va a recibir es un array de Tarea
    this._tareas.set(JSON.parse(tareasGuardadas) as Tarea[]);
  }

  // Guardar las tareas en localStorage
  private guardar(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this._tareas()));
  }

  // Generar un ID único comprobando las tareas existentes
  // Math.max(...tareas.map(tarea => tarea.id)) + 1 -> coge el id con el numero mayor
  // de la signal de tareas, para ello ... expande el array que crea .map en valores
  // individuales: [1, 2, 3] -> (1, 2, 3)  se coge el mayor de ellos y se le suma 1
  private generarId(): number {
    const tareas = this._tareas();
    return tareas.length > 0 ? Math.max(...tareas.map(tarea => tarea.id)) + 1 : 1;
  }

  // Agregar una nueva tarea
  agregarTarea(texto: string, prioridad: 'Baja' | 'Media' | 'Alta', fechaLimite: string): void {
    const nuevaTarea: Tarea = {
      id: this.generarId(),
      texto,
      prioridad,
      estado: 'backlog',
      fechaCreacion: Date.now(),
      fechaLimite: new Date(fechaLimite).getTime()
    };
    
    // Update de la signal de tareas
    // tareas es el parámetro actual y [...tareas, nuevaTarea] es
    // una nueva copia de tareas + la nueva
    // ... expande los elementos del array en un array nuevo
    this._tareas.update(tareas => [...tareas, nuevaTarea]);
    this.guardar();
  }

  // Borrar tarea
  borrarTarea(id: number): void {
    this._tareas.update(tareas => tareas.filter(tarea => tarea.id !== id));
    this.guardar();
  }

  // Completar tarea, con .map recorremos el array para devolver uno igual y 
  // solo cambia el estado de un elemento si lo encuentra
  completarTarea(tareaCompletada: Tarea): void {
    this._tareas.update(tareas =>
      tareas.map(tarea => tarea.id === tareaCompletada.id ? tareaCompletada : tarea));
    this.guardar();
  }

  // Cambiar la busqueda
  cambiarBusqueda(textoBusqueda: string): void {
    this._busqueda.set(textoBusqueda);
  };

  cambiarOrden(criterioOrden: 'sin-orden' | 'prioridad-asc' | 'prioridad-desc' | 'fecha-creacion-asc' | 'fecha-creacion-desc' | 'fecha-limite-asc' | 'fecha-limite-desc'): void {
    this._orden.set(criterioOrden);
  }

  getTareasPorColumna(columnaId: string): Signal<Tarea[]>{
    return computed(() => 
      this._tareas().filter(tarea => tarea.estado === columnaId)
    );
  }
}
