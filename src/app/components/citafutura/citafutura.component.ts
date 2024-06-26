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

import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-citafutura',
  standalone: true,
  imports: [
    TimestampToDateStringPipe,
    TimestampToHourStringPipe,
    CommonModule,
    LoaderComponent,
  ],
  templateUrl: './citafutura.component.html',
  styleUrl: './citafutura.component.css',
})
export class CitafuturaComponent {
  citas: any = [];
  fechaActual = new Date();
  mostrar = 'block';

  constructor(
    private CitasFbService: CitasFbService,
    private firestore: Firestore
  ) {
    this.cargacitasFuturas();
  }

  async cargacitasFuturas() {
    // Actualizando estilos
    let style = document.getElementsByClassName('eliminar');
    let btnCitasFuturas = document.getElementById('btnCitasF');
    let btnCitasPasadas = document.getElementById('btnCitasP');
    if (btnCitasFuturas && btnCitasPasadas) {
      btnCitasFuturas.setAttribute(
        'style',
        'font-weight: bold; color: #04125a; border-bottom: 2px solid  #ff4081;'
      );
      btnCitasPasadas.setAttribute(
        'style',
        'font-weight: none; color: #04125a; border-bottom: 2px solid transparent;'
      );
    }
    for (let i = 0; i < style.length; i++) {
      style[i].setAttribute('style', 'display: table-cell');
    }
    //Se obtienen las citas futuras
    this.citas = await this.CitasFbService.getCitasFuturas(this.fechaActual);
  }

  async cargacitasPrevias() {
    let style = document.getElementsByClassName('eliminar');
    //recorremos los objetos con clase eliminar
    let btnCitasPasadas = document.getElementById('btnCitasP');
    let btnCitasFuturas = document.getElementById('btnCitasF');
    if (btnCitasFuturas && btnCitasPasadas) {
      btnCitasPasadas.setAttribute(
        'style',
        'font-weight: bold; color: #04125a; border-bottom: 2px solid  #ff4081;'
      );
      btnCitasFuturas.setAttribute(
        'style',
        'font-weight: none; color: #04125a; border-bottom: 2px solid transparent;'
      );
    }
    for (let i = 0; i < style.length; i++) {
      //ocultamos los objetos con clase eliminar
      style[i].setAttribute('style', 'display: none');
    }
    this.citas = await this.CitasFbService.getCitasPasadas(this.fechaActual);
  }

  btnCargarPrevias(): void {
    this.cargacitasPrevias();
  }

  btnCargarFuturas(): void {
    this.cargacitasFuturas();
  }

  async btnEliminarCita(cita: string) {
    console.log(cita);
    if (!cita) {
      return;
    } else {
      console.log('Eliminando cita' + cita);
      await this.CitasFbService.deleteCita(cita);
      this.cargacitasFuturas();
    }
  }
}
