import { Component, inject } from '@angular/core';
import { TareaService } from '../../servicios/TareaService';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule, MatChipListboxChange } from '@angular/material/chips';
import { Filtro } from '../../interfaces/filtro';
import { Orden } from '../../interfaces/orden';

@Component({
  selector: 'app-filters',
  imports: [MatMenuModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters { 

  readonly tareaService = inject(TareaService);

  readonly tareasSeleccionas = this.tareaService.tareasSeleccionadas;

  // Metodo para ordenar las tareas
  ordenar(event: Event): void {
    const criterioOrden = (event.target as HTMLSelectElement).value;
    this.tareaService.cambiarOrden(
      criterioOrden as Orden
    );
  };

  // Selección de filtros
  filtrosSeleccionados(event: MatChipListboxChange): void {
    const listaSeleccionados = event.value as Filtro[];
    this.tareaService.cambiarFiltro(listaSeleccionados);
  }
}
