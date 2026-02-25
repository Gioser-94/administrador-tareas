import { Component } from '@angular/core';
import { TaskManager } from './componentes/task-manager/task-manager';

@Component({
  selector: 'app-root',
  imports: [TaskManager],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
