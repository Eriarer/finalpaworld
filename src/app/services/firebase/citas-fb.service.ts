import { Injectable } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy,
} from '@angular/fire/firestore';

import { Observable, firstValueFrom } from 'rxjs';
import { Cita } from '../../interfaces/cita';
import { CitasService } from '../citas-inicio/citas.service';

@Injectable({
  providedIn: 'root',
})
export class CitasFbService {
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

  newCita(): Cita {
    return {
      // id: this.citas.length + 1,
      fecha: '',
      hora: { hours: 0, minutes: 0 },
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
        fechaIngreso: '',
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
  }

  async getAllCitas(): Promise<Cita[]> {
    // Obtener los datos de Firestore sin ordenarlos
    const q = query(this.citasRef);

    this.citasFB = collectionData(q, {
      idField: 'id',
    }) as Observable<Cita[]>;

    const data = await firstValueFrom(this.citasFB);

    // Convertir y ordenar las fechas
    this.citas = data.sort((a, b) => {
      const dateA = this.convertToComparableDate(a.fecha);
      const dateB = this.convertToComparableDate(b.fecha);
      return dateA - dateB;
    });

    return this.citas;
  }

  private convertToComparableDate(dateString: string): number {
    const [day, month, year] = dateString.split('/').map(Number);
    // Convertir la fecha a un formato comparable: aaaammdd
    return new Date(year + 2000, month - 1, day).getTime();
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
