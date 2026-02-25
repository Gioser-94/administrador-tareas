import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TareaService } from '../../servicios/TareaService';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {

  // Injección del servicio de tareas, readonly porque nunca se va a reasignar
  private readonly tareaService = inject(TareaService);

  // Injección del servicio FormBuilder 
  private readonly fb = inject(FormBuilder);

  // fb.group crea un FormGroup, que es el objeto que representa el formulario entero
  // Se define dentro cada campo del formulario
  // nombre_campo: [valor_inicial, validadores]
  // Los validadores, si hay más de uno, se pasan como array
  // Cada vez que el campo cambia se ejecutan los validadores
  tareaForm = this.fb.group({
    texto: ['', [Validators.required, Validators.maxLength(50)]], // FormControl
    prioridad: ['', Validators.required]
  });

  // Atajo para acceder a los controles en el html, accede al control de cada campo del
  // formulario, this.tareaForm.controls['texto']
  get control() {
    return this.tareaForm.controls;
  }

  crearTarea() {
    // markAllAsTouched hace que se muestren todos los errores si el usuario
    // pulsa añadir sin haber tocado ningún campo por que sin el, los errores
    // solo aparecen si los campos se han tocado
    this.tareaForm.markAllAsTouched();

    // Si algún validador no se cumple...
    if (this.tareaForm.invalid) return;

    // tareaForm.value -> { texto: 'Texto de prueba', prioridad: 'Alta' }
    // se desestructura y se guardan los valores en las variables
    const { texto, prioridad } = this.tareaForm.value;

    this.tareaService.agregarTarea(
      texto!.trim(), // Evitamos con ! que TS crea que pueda ser un valor nulo
      prioridad as 'Baja' | 'Media' | 'Alta'
    );

    // Resetea todos los valores
    this.tareaForm.reset({
      texto: '',
      prioridad: ''
    });
  }

}
