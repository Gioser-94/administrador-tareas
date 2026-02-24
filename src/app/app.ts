import { Component, OnInit } from '@angular/core';
import { Form } from './form/form';
import { List } from './list/list';
import { Tarea } from './interfaces/tarea';

@Component({
  selector: 'app-root',
  imports: [Form, List],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{

  private storageKey = 'tareas';

  tareas: Tarea[] = [];

  // Al iniciar la app comprueba si existen registros guardados en localStorage,
  // si no existen, crea un almacenamiento vacio para su posterior uso y si existen
  // guarda los datos que obtiene de localStorage en el array tareas
  ngOnInit() {
    let tareasGuardadas = localStorage.getItem(this.storageKey);

    if(!tareasGuardadas) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
      return;
    }

    // Aseguramos a TS que lo que va a recibir es un array de Tarea
    this.tareas = JSON.parse(tareasGuardadas) as Tarea[];
  }

  // Recibimos los datos del form y los guardamos tanto en el array tareas
  // como en localStorage
  recibirTarea(tarea: Tarea){
    this.tareas.push(tarea);
    this.guardar();
    console.log(this.tareas);
  }

  // Al recibir el id del elemento borrado, creamos un nuevo array sin contar
  // con el borrado y lo guardamos de nuevo en ambos lados
  filtrarListaBorrados(id: number){
    let nuevaLista = this.tareas.filter(tareaOld => tareaOld.id !== id);
    this.tareas = nuevaLista;
    this.guardar();
  }

  // Se recibe el id de la tarea completada, y si se encuentra en el array
  // de tareas, se le cambia el estado, si no se encontrase devuelve undefined (?),
  // vuelve a guardar en localStorage
  filtarListaCompletados(id: number){
    this.tareas.find(tarea => tarea.id === id)?.estado === true;
    this.guardar();
  }

  // Metodo para guardar las tareas en localStorage
  guardar() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tareas));
  }
}
