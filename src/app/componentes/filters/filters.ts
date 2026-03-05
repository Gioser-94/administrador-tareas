import { Component, inject } from '@angular/core';
import { TareaService } from '../../servicios/TareaService';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule, MatChipListboxChange } from '@angular/material/chips';
import { Filtro } from '../../interfaces/filtro';
import { CriterioOrden } from '../../interfaces/orden';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from "@angular/material/form-field";


@Component({
  selector: 'app-filters',
  imports: [MatMenuModule, MatButtonModule, MatIconModule, MatChipsModule, DragDropModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters { 

  readonly tareaService = inject(TareaService);

  readonly tareasSeleccionas = this.tareaService.tareasSeleccionadas;
  readonly criterios = this.tareaService.orden;

  /*
  // Metodo para ordenar las tareas
  ordenar(event: Event): void {
    const criterioOrden = (event.target as HTMLSelectElement).value;
    this.tareaService.cambiarOrden(
      criterioOrden as Orden
    );
  };
*/
  // Selección de filtros
  filtrosSeleccionados(event: MatChipListboxChange): void {
    const listaSeleccionados = event.value as Filtro[];
    this.tareaService.cambiarFiltro(listaSeleccionados);
  }

  reordenarCriterios(event: CdkDragDrop<CriterioOrden[]>): void {
    this.tareaService.reordenarOrden(event.previousIndex, event.currentIndex);
  }
}
