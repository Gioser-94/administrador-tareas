import { Component } from '@angular/core';
import { List } from '../list/list';
import { Filters } from "../filters/filters";

@Component({
  selector: 'app-task-manager',
  imports: [List, Filters],
  templateUrl: './task-manager.html',
  styleUrl: './task-manager.css',
})
export class TaskManager {}
