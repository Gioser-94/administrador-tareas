import { Component, inject, Input } from '@angular/core';
import { TareaService } from '../../../servicios/TareaService';
import { CommonModule } from '@angular/common';
import { TiempoRestante } from '../tiempoRestante/tiempoRestante';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Form } from '../../form/form';
import { Tarea } from '../../../interfaces/tarea';
import { MatChipsModule } from "@angular/material/chips";

@Component({
  selector: 'app-task',
  imports: [CommonModule, TiempoRestante, MatButtonModule, MatIconModule, DragDropModule, MatCheckboxModule, MatChipsModule],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class Task { 
  
  readonly tareaService = inject(TareaService);
  private readonly dialog = inject(MatDialog);

  readonly tagsGuardados = this.tareaService.tagsUsadas;

  @Input() tarea!: Tarea;


  prioridadAClase = {
    Baja: 'prio-baja',
    Media: 'prio-media',
    Alta: 'prio-alta'
  };

  borrarTarea(id: number): void {
    this.tareaService.borrarTarea(id);
  };

  abrirFormularioEditar(tarea: Tarea): void {
      this.dialog.open(Form, {
        data: { modo: 'editar', tarea},
        width: '500px',
        height: 'auto'
      });
    };
}
