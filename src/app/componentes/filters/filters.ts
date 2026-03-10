import { Component, inject } from '@angular/core';
import { TareaService } from '../../servicios/TareaService';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-filters',
  imports: [MatButtonModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters { 

  readonly tareaService = inject(TareaService);

  readonly tareasSeleccionas = this.tareaService.tareasSeleccionadas;

}
