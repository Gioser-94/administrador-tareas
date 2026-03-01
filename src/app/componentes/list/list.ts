import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TareaService } from '../../servicios/TareaService';
import { Tarea } from '../../interfaces/tarea';
import { TiempoRestante } from './tiempoRestante/tiempoRestante';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { Form } from '../form/form';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, TiempoRestante, MatButtonModule, MatIconModule, DragDropModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {

  // Injección del servicio de tareas, readonly porque nunca se va a reasignar
  readonly tareaService = inject(TareaService);
  private readonly dialog = inject(MatDialog);

  // Declaraciones para poder hacer uso de la Signal
  readonly tareasFiltradas = this.tareaService.tareasFiltradas;
  /*
  readonly tareasPendientes = this.tareaService.tareasPendientes;
  readonly tareasCompletadas = this.tareaService.tareasCompletadas;
  */
  readonly columnas = this.tareaService.columnas;

  // Propiedad para poder asignar las diferentes clases de los options
  prioridadAClase = {
    Baja: 'prio-baja',
    Media: 'prio-media',
    Alta: 'prio-alta'
  };

  /*
  completarTarea(tarea: Tarea): void {
    this.tareaService.completarTarea({...tarea, estaCompletada: true});
  };
  */
  borrarTarea(id: number): void {
    this.tareaService.borrarTarea(id);
  };

  drop(event: CdkDragDrop<Tarea[]>): void {
    if (event.previousContainer === event.container) return;

    const tarea = event.previousContainer.data[event.previousIndex];
    const nuevoEstado = event.container.id as 'backlog' | 'to-do' | 'doing' | 'done';

    this.tareaService.cambiarEstado(tarea, nuevoEstado);
  };

  abrirFormularioEditar(tarea: Tarea): void {
    this.dialog.open(Form, {
      data: { modo: 'editar', tarea},
      width: '500px',
      height: 'auto'
    });
  };

}
