import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tarea } from '../../interfaces/tarea';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {

  @Input() tareasList: Tarea[] = [];
  @Output() enviarTareaBorrada = new EventEmitter<Tarea>();
  @Output() enviarTareaCompletada = new EventEmitter<Tarea>();

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
    this.enviarTareaCompletada.emit(tarea);
  };

  // Se envia el id de la tarea borrada a app
  borrarTarea(tarea: Tarea){
    this.enviarTareaBorrada.emit(tarea);
  };
}
