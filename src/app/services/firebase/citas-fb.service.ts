import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
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

import { Observable, Subscription, firstValueFrom } from 'rxjs';
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

  private userStateSubscription?: Subscription;
  userLogged: any;

  constructor(private firestore: Firestore,
    private authService: AuthService,
  ) {
    this.prubUserLog();
  }

  async prubUserLog(){
    this.userStateSubscription = await this.authService
    .getCurrentUserState()
    .subscribe(({ user, isAdmin }) => {
      if (user != null) {
        this.userLogged = user;
      } else {
        this.userLogged = user;
      }
    });
  }

  newCita(): Cita {
    return {
      // id: this.citas.length + 1,
      fechaHora: new Date(),
      adoptante: {
        nombre: '',
        telefono: '',
        correo: '',
        razon: '',
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
    this.prubUserLog();
    //Verificar que cita no esté vacía
    if (
      cita.mascota.id == 0 ||
      cita.adoptante.nombre == '' ||
      cita.adoptante.telefono == '' ||
      cita.adoptante.correo == '' ||
      cita.adoptante.razon == ''
    ) {
      return;
    }
    //añadiendo a firebase
    await addDoc(collection(this.firestore, 'citas'), cita);

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
    this.prubUserLog();
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
    this.prubUserLog();
    const loggedUser = this.userLogged.email;
    console.log('Usuario logueado: ', loggedUser);
  
    const q = query(
      this.citasRef,
      where('fechaHora', '>', fechaReferencia),
      orderBy('fechaHora', 'asc')
    );
  
    this.citasFB = collectionData(q, { idField: 'id' }) as Observable<Cita[]>;
    let data = await firstValueFrom(this.citasFB);
  
    // Filtrar las citas por el correo del adoptante en el cliente
    return data.filter(cita => cita.adoptante?.correo === loggedUser);
  }

  async getCitasPasadas(fechaReferencia: Date): Promise<Cita[]> {
    // Consultar citas pasadas hasta la fecha de referencia
    this.prubUserLog();
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
