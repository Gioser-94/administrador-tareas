import { Component, inject } from '@angular/core';
import { TareaService } from '../../servicios/TareaService';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Form } from '../form/form';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header { 

  private readonly tareaService = inject(TareaService);
  private readonly dialog = inject(MatDialog);

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
}
