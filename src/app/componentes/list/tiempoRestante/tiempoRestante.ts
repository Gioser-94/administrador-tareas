import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[app-tiempo-restante]', // Declaro el selector como atributo de td de list, para que no afecte mucho a los estilos
  imports: [CommonModule],
  templateUrl: './tiempoRestante.html',
  styleUrl: './tiempoRestante.css',
})
export class TiempoRestante implements OnInit, OnDestroy{ 
  @Input() fechaLimite!: number;
  @Input() estaCompletada!: boolean;

  tiempoRestante = '';
  private intervalo: any;

  ngOnInit(): void {
    if(this.estaCompletada) {
      this.tiempoRestante = "Tarea completada";
      return;
    }
    this.calcularTiempoRestante();
    this.intervalo = setInterval(() => this.calcularTiempoRestante(), 1000);
  }

  // Cuando se borra una tarea, forzamos a que el contador se destruya, para no ocupar
  // espacio en memoria
  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  private calcularTiempoRestante(): void {
    if(this.estaCompletada) {
      this.tiempoRestante = 'Tarea completada';
      clearInterval(this.intervalo);
      return;
    }

    const diferencia = this.fechaLimite - Date.now();

    if(diferencia <= 0) {
      this.tiempoRestante = 'Tiempo vencido';
      clearInterval(this.intervalo);
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    this.tiempoRestante = `${dias}:${horas}:${minutos}:${segundos}`
  }
}
