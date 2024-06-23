import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Database, ref, set, get, child } from '@angular/fire/database';

import { Observable, firstValueFrom } from 'rxjs';
import { take } from 'rxjs';
import { Cita } from '../../interfaces/cita';
import { CitasService } from '../citas-inicio/citas.service';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  citas: Cita[] = [];
  citasRef = collection(this.firestore, 'citas');
  citasFB!: Observable<Cita[]>;
  urlAPI: string = 'https://paworld.free.beeceptor.com';
  http: any;

  constructor(
    private firestore: Firestore,
    private citasService: CitasService
  ) {
    console.log('constructro firestore service');
    this.addCitasDefault();
  }

  ngOninit() {
    console.log('ngOninit');
    this.addCitasDefault();
  }

  newCita(): Cita {
    return {
      // id: this.citas.length + 1,
      fecha: new Date(),
      formatoFecha: '', // Add the 'formatoFecha' property here
      hora: { hours: 0, minutes: 0 },
      adoptante: {
        nombre: '',
        telefono: '',
        correo: '',
      },
      mascota: {
        id: 0,
        edad: 0,
        color: '',
        tipo: '',
        raza: '',
        fechaIngreso: new Date(),
        descripcion: '',
        imagen: '',
        sexo: '',
      },
    };
  }

  async addCita(cita: Cita) {
    //Verificar que cita no esté vacía
    if (
      cita.adoptante.nombre == '' ||
      cita.adoptante.telefono == '' ||
      cita.mascota.id == 0
    ) {
      return;
    }
    //añadiendo a firebase
    await addDoc(collection(this.firestore, 'citas'), cita);

    //ejecutando getAllCitas para probarlo
    console.log('All citas:' + this.getAllCitas());
  }

  async getAllCitas(): Promise<Cita[]> {
    this.citasFB = collectionData(this.citasRef, {
      idField: 'id',
    }) as Observable<Cita[]>;

    const data = await firstValueFrom(this.citasFB);
    this.citas = data;

    return this.citas;
  }

  async addCitasDefault() {
    //Verificar si ya hay datos en firebase
    if ((await this.getAllCitas()).length > 0) {
      return;
    }
    //recorriendo arreglo de citas predefinidas y agregandolas a firebase
    this.citasService.citasDefinidas.forEach(async (cita) => {
      await addDoc(collection(this.firestore, 'citas'), cita);
    });
  }

  /////////////////Obteniendo datos predefinidos
}
