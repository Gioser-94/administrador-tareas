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
  @Output() enviarId = new EventEmitter<number>();

  prioridadAClase = {
    Baja: 'prio-baja',
    Media: 'prio-media',
    Alta: 'prio-alta'
  };

  completarTarea(tarea: Tarea) {
    tarea.estado = true;
  }

  borrarTarea(id: number){
    this.enviarId.emit(id);
    let nuevaLista = this.tareasList.filter(tareaOld => tareaOld.id !== id);
    this.tareasList = nuevaLista;
  }
}
