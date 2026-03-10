import { Component, inject, OnInit } from '@angular/core';
import { TareaService } from '../../servicios/TareaService';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Form } from '../form/form';
import { MatMenuModule } from "@angular/material/menu";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { CriterioOrden } from '../../interfaces/orden';
import { MatChipsModule, MatChipListboxChange } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core'; 
import { Filtro } from '../../interfaces/filtro';


@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatMenuModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{ 

  readonly tareaService = inject(TareaService);
  private readonly dialog = inject(MatDialog);
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

  // Metodo que se activa en la barra de busqueda
  // Casteamos el retorno para que TS sepa que es un input y obtener el value
  buscar(event: Event): void {
    const textoBusqueda = (event.target as HTMLInputElement).value;
    this.tareaService.cambiarBusqueda(textoBusqueda);
  };

  abrirFormulario(): void {
    this.dialog.open(Form, {
      data: { modo: 'crear'},
      width: '500px',
      height: 'auto'
    });
  };

  exportar(): void {
    this.tareaService.exportarTareas();
  }

  importar(event: Event): void {
    this.tareaService.importarTareas(event);
  }

  // Selección de filtros
  filtrosSeleccionados(event: MatChipListboxChange): void {
    const listaSeleccionados = event.value as Filtro[];
    this.tareaService.cambiarFiltro(listaSeleccionados);
  }

  reordenarCriterios(event: CdkDragDrop<CriterioOrden[]>): void {
    this.tareaService.cambiarOrden(event.previousIndex, event.currentIndex);
  }
}
