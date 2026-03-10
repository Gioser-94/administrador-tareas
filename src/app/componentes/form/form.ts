import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl} from '@angular/forms';
import { TareaService } from '../../servicios/TareaService';
import { fechaValida } from '../validators/fecha-valida.validators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from "@angular/material/form-field";
import { ENTER, COMMA } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule, MatChipsModule, MatIconModule, MatAutocompleteModule, MatFormFieldModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit{

  private readonly dialogRef = inject(MatDialogRef);
  readonly data = inject(MAT_DIALOG_DATA);

  // Injección del servicio de tareas, readonly porque nunca se va a reasignar
  private readonly tareaService = inject(TareaService);

  // Injección del servicio FormBuilder 
  private readonly fb = inject(FormBuilder);

  // Signal para leer las tags ya usadas
  readonly tagsSugeridos = this.tareaService.tagsUsadas;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  // fb.group crea un FormGroup, que es el objeto que representa el formulario entero
  // Se define dentro cada campo del formulario
  // nombre_campo: [valor_inicial, validadores]
  // Los validadores, si hay más de uno, se pasan como array
  // Cada vez que el campo cambia se ejecutan los validadores
  tareaForm = this.fb.group({
    texto: ['', [Validators.required, Validators.maxLength(50)]], // FormControl
    prioridad: ['', Validators.required],
    fechaLimite: ['', [Validators.required, fechaValida]],
    tags: this.fb.control<string[]>([])
  });

  tagInput = new FormControl('');

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
    const { texto, prioridad, fechaLimite, tags } = this.tareaForm.value;

    this.tareaService.agregarTarea(
      texto!.trim(), // Evitamos con ! que TS crea que pueda ser un valor nulo
      prioridad as 'Baja' | 'Media' | 'Alta',
      fechaLimite!,
      tags!
    );

    this.tareaService.anadirTags(tags as string[]);

    // Resetea todos los valores
    this.tareaForm.reset({
      texto: '',
      prioridad: '',
      fechaLimite: ''
    });

    this.dialogRef.close();
  }

  editarTarea() {
    this.tareaForm.markAllAsTouched();

    if (this.tareaForm.invalid) return;

    const { texto, prioridad, fechaLimite, tags } = this.tareaForm.value;

    this.tareaService.modificarTarea({
      ...this.data.tarea,
      texto: texto!.trim(),
      prioridad: prioridad as 'Baja' | 'Media' | 'Alta',
      fechaLimite: new Date(fechaLimite!).getTime(),
      tags: tags
    })

    this.dialogRef.close();
  }

  cancelarEditarTarea() {
    this.dialogRef.close();
  }

  //------------TAGS-------------
  anadirTag(tag: string) {
    const tagsActuales: string[] = this.tareaForm.controls.tags.value as string[];

    // Evita duplicados
    if (tagsActuales.includes(tag)) return;

    // Actualiza el array de tags en el formulario
    this.tareaForm.controls.tags.setValue([...tagsActuales, tag]);

    // Limpia el input de escritura para que quede vacío tras seleccionar
    this.tagInput.setValue('');
  }

  quitarTag(tag: string) {
    const tagsActuales: string[] = this.tareaForm.controls.tags.value as string[];

    this.tareaForm.controls.tags.setValue(
      tagsActuales.filter(t => t !== tag)
    );
  }

  anadirTagManual(event: MatChipInputEvent) {
    const tag = event.value.trim();
    if (tag) {
      this.anadirTag(tag);
    }
    event.chipInput.clear();
  }

  ngOnInit() {
    console.log(this.tagsSugeridos());
    if (this.data.modo === 'editar') {
      this.tareaForm.patchValue({
        texto: this.data.tarea.texto,
        prioridad: this.data.tarea.prioridad,
        fechaLimite: new Date(this.data.tarea.fechaLimite).toISOString().slice(0, 16),
        // toISOString convierte los milisegundos a este formato 2024-03-15T14:30:00.000Z
        // y slice recorta los ultimos caracteres dejando este formato 2024-03-15T14:30
        // que es el que espera el input datetime-local
        tags: this.data.tarea.tags
      });
    }
  }

}
