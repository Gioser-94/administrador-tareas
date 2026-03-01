import { Component } from '@angular/core';
import { TaskManager } from './componentes/task-manager/task-manager';
import { Header } from './componentes/header/header';

@Component({
  selector: 'app-root',
  imports: [TaskManager, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
