import { Component, signal } from '@angular/core';
import { Form } from './form/form';
import { List } from './list/list';
import { Tarea } from './interfaces/tarea';

@Component({
  selector: 'app-root',
  imports: [Form, List],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('administrador-tareas');

  tareas: Tarea[] = [];

  onTareaRecibida(tarea: Tarea){
    this.tareas.push(tarea);
    console.log('Objeto recibido', tarea);
    console.log(this.tareas);
  }

  filtrarListaBorrados(id: number){
    let nuevaLista = this.tareas.filter(tareaOld => tareaOld.id !== id);
    this.tareas = nuevaLista;
  }
}
