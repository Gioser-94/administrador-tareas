import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TareaService } from '../../servicios/TareaService';
import { Tarea } from '../../interfaces/tarea';
import { TiempoRestante } from './tiempoRestante/tiempoRestante';

@Component({
  selector: 'app-list',
  imports: [CommonModule, TiempoRestante],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {

  // Injección del servicio de tareas, readonly porque nunca se va a reasignar
  private readonly tareaService = inject(TareaService);

  // Declaraciones para poder hacer uso de la Signal
  readonly tareasFiltradas = this.tareaService.tareasFiltradas;
  readonly tareasPendientes = this.tareaService.tareasPendientes;
  readonly tareasCompletadas = this.tareaService.tareasCompletadas;

  // Propiedad para poder asignar las diferentes clases de los options
  prioridadAClase = {
    Baja: 'prio-baja',
    Media: 'prio-media',
    Alta: 'prio-alta'
  };

  completarTarea(tarea: Tarea): void {
    this.tareaService.completarTarea({...tarea, estaCompletada: true});
  };

  borrarTarea(id: number): void {
    this.tareaService.borrarTarea(id);
  };

}
