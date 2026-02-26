import { Component, inject } from '@angular/core';
import { TareaService } from '../../servicios/TareaService';

@Component({
  selector: 'app-filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters { 

  private readonly tareaService = inject(TareaService);

  // Metodo que se activa en la barra de busqueda
  // Casteamos el retorno para que TS sepa que es un input y obtener el value
  buscar(event: Event): void {
    const textoBusqueda = (event.target as HTMLInputElement).value;
    this.tareaService.cambiarBusqueda(textoBusqueda);
  };

  // Metodo para ordenar las tareas
  ordenar(event: Event): void {
    const criterioOrden = (event.target as HTMLSelectElement).value;
    this.tareaService.cambiarOrden(
      criterioOrden as 'sin-orden' | 'prioridad-asc' | 'prioridad-desc' | 'fecha-creacion-asc' | 'fecha-creacion-desc' | 'fecha-limite-asc' | 'fecha-limite-desc'
    );
  };
}
