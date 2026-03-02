import { Component, inject } from '@angular/core';
import { TareaService } from '../../servicios/TareaService';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule, MatChipListboxChange } from '@angular/material/chips';
export type Filtro = 'Alta' | 'Media' | 'Baja' | 'backlog' | 'to-do' | 'doing' | 'done';

@Component({
  selector: 'app-filters',
  imports: [MatMenuModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters { 

  private readonly tareaService = inject(TareaService);

  // Metodo para ordenar las tareas
  ordenar(event: Event): void {
    const criterioOrden = (event.target as HTMLSelectElement).value;
    this.tareaService.cambiarOrden(
      criterioOrden as 'sin-orden' | 'prioridad-asc' | 'prioridad-desc' | 'fecha-creacion-asc' | 'fecha-creacion-desc' | 'fecha-limite-asc' | 'fecha-limite-desc'
    );
  };

  // Selección de filtros
  filtrosSeleccionados(event: MatChipListboxChange): void {
    const listaSeleccionados = event.value as Filtro[];
    this.tareaService.cambiarFiltro(listaSeleccionados);
  }
}
