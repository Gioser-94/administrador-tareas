import { AbstractControl, ValidationErrors } from '@angular/forms';

export function fechaValida(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null; // Sale del validador y se encarga .required

  const fecha = new Date(control.value);

  if (Number.isNaN(fecha.getTime())) {
    return { fechaInvalida: true };
  }

  if (fecha.getTime() <= Date.now()){
    return { fechaPasada: true };
  }

  return null; // T0do correcto
}

