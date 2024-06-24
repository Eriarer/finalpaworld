import { Component } from '@angular/core';
import { Cita } from '../../interfaces/cita';
import { CitasFbService } from '../../services/firebase/citas-fb.service';
import { Observable } from 'rxjs';
import { Timestamp } from '@firebase/firestore-types';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { TimestampToDateStringPipe } from '../../pipes/timestamp-to-date-string.pipe';
import { TimestampToHourStringPipe } from '../../pipes/timestamp-to-hour-string.pipe';

@Component({
  selector: 'app-citafutura',
  standalone: true,
  imports: [TimestampToDateStringPipe, TimestampToHourStringPipe],
  templateUrl: './citafutura.component.html',
  styleUrl: './citafutura.component.css',
})
export class CitafuturaComponent {
  citas: any = [];
  fechaActual = new Date();

  constructor(
    private CitasFbService: CitasFbService,
    private firestore: Firestore
  ) {
    this.cargacitasFuturas();
  }

  async cargacitasFuturas() {
    //dateObject = new Date(fechaHora);
    this.citas = await this.CitasFbService.getCitasFuturas(this.fechaActual);
    console.log(this.citas);
  }

  async cargacitasPrevias() {
    this.citas = await this.CitasFbService.getCitasPasadas(this.fechaActual);
    console.log(this.citas);
  }

  btnCargarPrevias(): void {
    this.cargacitasPrevias();
  }

  btnCargarFuturas(): void {
    this.cargacitasFuturas();
  }
}
