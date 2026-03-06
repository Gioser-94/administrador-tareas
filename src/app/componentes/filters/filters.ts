import { Component, inject, OnInit } from '@angular/core';
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
import { FormBuilder, ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-filters',
  imports: [MatMenuModule, MatButtonModule, MatIconModule, MatChipsModule, DragDropModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters implements OnInit{ 

  readonly tareaService = inject(TareaService);

  readonly tareasSeleccionas = this.tareaService.tareasSeleccionadas;
  readonly criterios = this.tareaService.orden;
  private readonly fb = inject(FormBuilder);

  rangoFechasCreacion = this.fb.group({
    inicio: [null as Date | null],
    fin: [null as Date | null]
  })

  rangoFechasLimite = this.fb.group({
    inicio: [null as Date | null],
    fin: [null as Date | null]
  })

  ngOnInit(){
    this.rangoFechasCreacion.valueChanges.subscribe(({ inicio, fin }) => {
      if (inicio && fin) {
        const inicioMs = inicio.getTime();
        // Ponemos el fin a las 23:59:59 del día seleccionado
        const finDia = new Date(fin);
        finDia.setHours(23, 59, 59, 999);
        const finMs = finDia.getTime();
        this.tareaService.cambiarRangoFechas(inicioMs, finMs, 'creacion');
      } else {
        this.tareaService.cambiarRangoFechas(null, null, 'creacion');
      }
    });

    this.rangoFechasLimite.valueChanges.subscribe(({ inicio, fin }) => {
      if (inicio && fin) {
        const inicioMs = inicio.getTime();
        // Ponemos el fin a las 23:59:59 del día seleccionado
        const finDia = new Date(fin);
        finDia.setHours(23, 59, 59, 999);
        const finMs = finDia.getTime();
        this.tareaService.cambiarRangoFechas(inicioMs, finMs, 'limite');
      } else {
        this.tareaService.cambiarRangoFechas(null, null, 'limite');
      }
    });
  }
  

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
