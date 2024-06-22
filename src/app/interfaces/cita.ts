import { Time } from "@angular/common";
import { Adoptante } from "./adoptante";
import { Mascota } from "./mascota";

export interface Cita {
    id: number;
    fecha: Date;
    formatoFecha: string;
    hora: Time;
    adoptante: Adoptante;
    mascota: Mascota;
}
