import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tarea } from '../interfaces/tarea';

@Component({
  selector: 'app-form',
  imports: [FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {

  textoTarea = "";
  prioridadTarea = "";
  intentoEnviar = false;
  ultimoId = 0;

  @Output() enviarTarea = new EventEmitter<Tarea>();

  crearYEnviarTarea() {
    this.intentoEnviar = true;

    if(this.textoTarea.trim() === "" ||  this.textoTarea.length > 50 || this.prioridadTarea === ""){
      return;
    }

    this.ultimoId++;

    let tarea: Tarea = {
      id: this.ultimoId,
      texto: this.textoTarea,
      prioridad: this.prioridadTarea as 'Baja' | 'Media' | 'Alta',
      estado: false
    }

    // Emite el objeto
    this.enviarTarea.emit(tarea);
  }

}
