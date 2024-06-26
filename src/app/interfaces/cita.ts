import { Time } from '@angular/common';
import { Adoptante } from './adoptante';
import { Mascota } from './mascota';

export interface Cita {
  id?: number;
  fechaHora: Date; //engloba fecha y hora
  // hora: Time;
  adoptante: Adoptante;
  mascota: Mascota;
}
