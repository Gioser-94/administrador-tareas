import { Component, inject } from '@angular/core';
import { TareaService } from '../../servicios/TareaService';
import { Tarea } from '../../interfaces/tarea';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Task } from './task/task';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [ Task, DragDropModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {

  // Injección del servicio de tareas, readonly porque nunca se va a reasignar
  readonly tareaService = inject(TareaService);

  readonly columnasFiltradas = this.tareaService.columnasFiltradas;

  drop(event: CdkDragDrop<Tarea[]>): void {
    if (event.previousContainer === event.container) {
      this.tareaService.reordenarDentroDeColumna(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    };

    const nuevoEstado = event.container.id as Tarea['estado'];

    this.tareaService.transferirEntreColumnas(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
      nuevoEstado
    );
  };

}
