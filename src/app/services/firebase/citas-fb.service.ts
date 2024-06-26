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
  getCountFromServer,
  doc,
  deleteDoc,
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

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.prubUserLog();
  }

  async prubUserLog() {
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
    return data.filter((cita) => cita.adoptante?.correo === loggedUser);
  }

  async getCitasPasadas(fechaReferencia: Date): Promise<Cita[]> {
    // Consultar citas pasadas hasta la fecha de referencia
    this.prubUserLog();
    const loggedUser = this.userLogged.email;

    this.prubUserLog();
    const q = query(
      this.citasRef,
      where('fechaHora', '<', fechaReferencia),
      orderBy('fechaHora', 'desc')
    );
    this.citasFB = collectionData(q, { idField: 'id' }) as Observable<Cita[]>;
    let data = await firstValueFrom(this.citasFB);

    // Filtrar las citas por el correo del adoptante en el cliente
    return data.filter((cita) => cita.adoptante?.correo === loggedUser);
  }

  //return an array full of objects  {horas: String: hh:mm}
  async getAllHoursOcupied(today: Date | null) {
    if (today == null) throw new Error('No se ha proporcionado la fecha');
    console.log('Fecha de hoy', today);
    // convertir  today  a formato Timestamp
    const now = Timestamp.fromDate(today);
    let tomorrow: any = now.toDate();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    console.log('Fecha de mañana', tomorrow);
    tomorrow = Timestamp.fromDate(tomorrow);
    const q = query(
      this.citasRef,
      where('fechaHora', '>=', now),
      where('fechaHora', '<', tomorrow),
      orderBy('fechaHora', 'asc')
    );
    this.citasFB = collectionData(q, { idField: 'id' }) as Observable<Cita[]>;
    const data = await firstValueFrom(this.citasFB);
    console.log('Arreglo de Citas Pasadas', data);
    let hoursOcupied: any[] = [];
    data.forEach((cita: any) => {
      let hour = cita.fechaHora.toDate().getHours();
      let minute = cita.fechaHora.toDate().getMinutes();
      hour = hour < 10 ? `0${hour}` : hour;
      minute = minute < 10 ? `0${minute}` : minute;
      let time = `${hour}:${minute}`;
      hoursOcupied.push(time);
    });
    return hoursOcupied;
  }

  async deleteCita(id: string): Promise<void> {
    //mandar error si es nulo
    try {
      if (!id) {
        throw new Error('No se ha proporcionado el ID de la cita');
      }
      const citaDocRef = doc(this.firestore, `citas/${id}`);
      await deleteDoc(citaDocRef);
      console.log(`Cita con ID ${id} ha sido eliminada`);
    } catch (error) {
      console.error(error);
    }

    const citaDocRef = doc(this.firestore, `citas/${id}`);
    await deleteDoc(citaDocRef);
    console.log(`Cita con ID ${id} ha sido eliminada`);
  }

  async getUltimasSieteDias(): Promise<{ fecha: string; cantCitas: number }[]> {
    let today = new Date();
    let lastSevenDaysArray: { fecha: string; cantCitas: number }[] = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date(today);
      date.setDate(date.getDate() - i);

      let dateStr = date.toISOString().split('T')[0];
      let dateTomorrow = new Date(date);
      dateTomorrow.setDate(dateTomorrow.getDate() + 1);

      let q = await query(
        this.citasRef,
        where('fechaHora', '>=', Timestamp.fromDate(date)),
        where('fechaHora', '<', Timestamp.fromDate(dateTomorrow))
      );

      let snapshot = await getCountFromServer(q);
      let cantCitas = snapshot.data().count;
      // fecha en formado dd/mm/aa
      let fecha =
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear().toString().slice(2);
      lastSevenDaysArray.push({
        fecha: fecha,
        cantCitas: cantCitas,
      });
    }
    // invertir el arreglo para que las fechas estén en orden ascendente
    lastSevenDaysArray.reverse();
    return lastSevenDaysArray;
  }

  async getMultiQueryCitas(
    username: string,
    fecha: Date,
    perro: boolean,
    gato: boolean
  ): Promise<Cita[]> {
    let result: Cita[] = [];
    // crear un arreglo de consultas where dependiendo si el parametro es nulo o no
    let queries = [];
    if (username) {
      // si el nombre no es de tipo string continuar adelante
      if (typeof username !== 'string')
        throw new Error('El nombre no es de tipo string');
      queries.push(where('adoptante.nombre', '>=', username));
      queries.push(where('adoptante.nombre', '<', username + '\uf8ff'));
    }
    // verificar que la fecha no sea invalida
    if (fecha) {
      // si la vecha no es de tipo Date continuar adelante
      if (!(fecha instanceof Date))
        throw new Error('La fecha no es de tipo Date');
      let tomorrow = new Date(fecha);
      tomorrow.setDate(tomorrow.getDate() + 1);
      queries.push(where('fechaHora', '>=', Timestamp.fromDate(fecha)));
      queries.push(where('fechaHora', '<', Timestamp.fromDate(tomorrow)));
    }
    if (perro || gato) {
      const petTypes = [];
      if (perro) petTypes.push('perro');
      if (gato) petTypes.push('gato');
      queries.push(where('mascota.tipo', 'in', petTypes));
    }
    if (queries.length == 0) {
      await this.getAllCitas()
        .then((data) => {
          result = data;
        })
        .catch((error) => {
          console.error('Error al obtener las citas', error);
        });
    } else {
      console.log('queries', queries);
      // realizar la consulta
      let q = query(this.citasRef, ...queries, orderBy('fechaHora', 'asc'));
      this.citasFB = collectionData(q, { idField: 'id' }) as Observable<Cita[]>;
      result = await firstValueFrom(this.citasFB);
    }
    return result;
  }
}
