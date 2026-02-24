import { computed, Injectable, signal } from '@angular/core';
import { Tarea } from '../interfaces/tarea';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  // readonly evita reasignar la propiedad, porque nunca debe de cambiar
  private readonly storageKey = 'tareas';

  // Signal privada que contiene el estado de las tareas (propiedad que solo se puede usar en el servicio)
  // Implemento las convenciones de propiedades privadas (_tareas)
  // Signal inicializada como array vacío ([])
  private _tareas = signal<Tarea[]>([]);

  // Signal de solo lectura para los componentes, asi nos aseguramos que solo el servicio
  // tiene el control de modificar la signal
  // this._tareas.asReadonly() devuelve una signal de solo lectura
  readonly tareas = this._tareas.asReadonly();

  // Signal computada: número de tareas pendientes
  // Guarda el numero de tareas pendientes segun el estado actual de la Signal
  readonly tareasPendientes = computed(() => 
    this._tareas().filter(tarea => !tarea.estado).length
  );

  constructor() {
    this.cargarDesdeStorage();
  }

  // Carga las tareas desde localStorage al iniciar el servicio
  private cargarDesdeStorage(): void {
    let tareasGuardadas = localStorage.getItem(this.storageKey);

    if(!tareasGuardadas) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
      return;
    }

    // Aseguramos a TS que lo que va a recibir es un array de Tarea
    this._tareas.set(JSON.parse(tareasGuardadas) as Tarea[]);
  }

  // Guardar las tareas en localStorage
  private guardar(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this._tareas));
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
  agregarTarea(texto: string, prioridad: 'Baja' | 'Media' | 'Alta'): void {
    const nuevaTarea: Tarea = {
      id: this.generarId(),
      texto,
      prioridad,
      estado: false
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
  completarTarea(id: number): void {
    this._tareas.update(tareas => 
      tareas.map(tarea => tarea.id === id ? {...tarea, estado: true} : tarea)
    );
    this.guardar();
  }
}
