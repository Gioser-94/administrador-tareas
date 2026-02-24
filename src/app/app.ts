import { Component, OnInit } from '@angular/core';
import { Form } from './componentes/form/form';
import { List } from './componentes/list/list';
import { Tarea } from './interfaces/tarea';

@Component({
  selector: 'app-root',
  imports: [Form, List],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{

  private readonly storageKey = 'tareas';

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
  }

  // Al recibir el id del elemento borrado, creamos un nuevo array sin contar
  // con el borrado y lo guardamos de nuevo en ambos lados
  borrarTarea(tareaBorrada: Tarea){
    let nuevaLista = this.tareas.filter(tareaOld => tareaOld.id !== tareaBorrada.id);
    this.tareas = nuevaLista;
    this.guardar();
  }

  // Se recibe el id de la tarea completada, y si se encuentra en el array
  // de tareas, se le cambia el estado, si no se encontrase devuelve undefined (?),
  // vuelve a guardar en localStorage
  completarTarea(tareaCompletada: Tarea){
    const tarea = this.tareas.find(tarea => tarea.id === tareaCompletada.id);
    if(tarea) {
      tarea.estado = true;
      this.guardar();
    }
  }

  // Metodo para guardar las tareas en localStorage
  guardar() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tareas));
  }
}
