import { Injectable } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy,
  where,
  Timestamp,
} from '@angular/fire/firestore';

import { Observable, firstValueFrom } from 'rxjs';
import { Cita } from '../../interfaces/cita';

@Injectable({
  providedIn: 'root',
})
export class CitasFbService {
  citas: Cita[] = [];
  citasRef = collection(this.firestore, 'citas');
  citasFB!: Observable<Cita[]>;
  urlAPI: string = 'https://paworld.free.beeceptor.com';
  http: any;

  constructor(private firestore: Firestore) {
    console.log('constructro firestore service');
  }

  newCita(): Cita {
    return {
      // id: this.citas.length + 1,
      fechaHora: new Date(),
      adoptante: {
        id: '',
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
    this.getAllCitas();
  }

  // async getAllCitas(): Promise<Cita[]> {
  //   // Obtener los datos de Firestore sin ordenarlos
  //   const q = query(this.citasRef);

  //   this.citasFB = collectionData(q, {
  //     idField: 'id',
  //   }) as Observable<Cita[]>;

  //   const data = await firstValueFrom(this.citasFB);
  //   console.log('data', data);
  //   return this.citas;
  // }

  async getAllCitas(): Promise<Cita[]> {
    this.citasFB = collectionData(this.citasRef, {
      idField: 'id',
    }) as Observable<Cita[]>;

    const data = await firstValueFrom(this.citasFB);
    this.citas = data;

    return this.citas;
  }

  private convertToComparableDate(dateString: string): number {
    const [day, month, year] = dateString.split('/').map(Number);
    // Convertir la fecha a un formato comparable: aaaammdd
    return new Date(year + 2000, month - 1, day).getTime();
  }

  /////////////////Métodos Citas pasadas y futuras/////////////////////
  async getCitasFuturas(fechaReferencia: Date): Promise<Cita[]> {
    console.log('Consultar citas futuras a partir de la fecha de referencia');
    // Consultar citas futuras a partir de la fecha de referencia
    const q = query(
      this.citasRef,
      where('fechaHora', '>', fechaReferencia),
      orderBy('fechaHora', 'asc')
    );
    this.citasFB = collectionData(q, { idField: 'id' }) as Observable<Cita[]>;
    let data = await firstValueFrom(this.citasFB);
    console.log('Arreglo de Citas Futuras', data);
    return data;
  }

  async getCitasPasadas(fechaReferencia: Date): Promise<Cita[]> {
    // Consultar citas pasadas hasta la fecha de referencia
    const q = query(
      this.citasRef,
      where('fechaHora', '<', fechaReferencia),
      orderBy('fechaHora', 'desc')
    );
    this.citasFB = collectionData(q, { idField: 'id' }) as Observable<Cita[]>;
    const data = await firstValueFrom(this.citasFB);
    console.log('Arreglo de Citas Pasadas', data);
    return data;
  }
}
