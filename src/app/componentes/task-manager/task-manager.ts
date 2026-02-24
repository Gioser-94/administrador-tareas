import { Component } from '@angular/core';
import { List } from '../list/list';
import { Form } from '../form/form';

@Component({
  selector: 'app-task-manager',
  imports: [Form, List],
  templateUrl: './task-manager.html',
  styleUrl: './task-manager.css',
})
export class TaskManager {}
