import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tarea } from '../interfaces/tarea';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {

  @Input() tareasList: Tarea[] = [];
  @Output() enviarIdBorrado = new EventEmitter<number>();
  @Output() enviarIdCompletado = new EventEmitter<number>();

  // Propiedad para poder asignar las diferentes clases de los options
  prioridadAClase = {
    Baja: 'prio-baja',
    Media: 'prio-media',
    Alta: 'prio-alta'
  };

  // Al accionar el boton de completar la tarea, se recibe la tarea,
  // cambia su estado y emite el id de esa tarea para que app lo reciba
  completarTarea(tarea: Tarea) {
    tarea.estado = true;
    this.enviarIdCompletado.emit(tarea.id);
  };

  // Se envia el id de la tarea borrada a app
  borrarTarea(id: number){
    this.enviarIdBorrado.emit(id);
  };
}
