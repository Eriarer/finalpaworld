import { Injectable } from '@angular/core';
import { Cita } from '../../interfaces/cita';
import { take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Time } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  urlAPI: string = 'https://paworld.free.beeceptor.com';
  citas: Cita[] = [];

  constructor(private http: HttpClient) {
    console.log('En este instante el componente ha cargado');
    this.uploadLocalStorage();
    if (this.citas.length === 0) {
      this.recuperarDatos();
    }
  }

  //Funciones para cargar los datos de las citas
  recuperarDatos() {
    //Recupera los datos del API
    /*El método subscribe es para subscribirte al observable (uso del get en el servicio), cuando llegan*/
    console.log('Entrando a Recuperando datos');
    this.retornar().subscribe({
      next: this.successRequest.bind(this),
      /*el .brind es para que cuando llegueal metodo succesRequest el this siga funcionando, sino se pierde el contexto*/
      error: (err) => {
        console.log(err);
      },
    });
  } //Fin recuperarDatos

  retornar() {
    return this.http.get(this.urlAPI).pipe(take(1));
  }

  successRequest(data: any): void {
    console.log(data); //imprime la data que llega del API
    this.citas = data.citas; //Se asigna la data al array local
    console.log('citas', this.citas);
    //Se guarda en el local storage
    localStorage.setItem('citas', JSON.stringify(this.citas));
  }

  uploadLocalStorage() {
    const citasLocalStorage = JSON.parse(localStorage.getItem('citas') || '[]');
    if (citasLocalStorage.length != 0) {
      this.citas = citasLocalStorage;
    }
  }

  getCitas(): Cita[] {
    return this.citas;
  }

  getCitaById(index: number) {
    return this.citas[index];
  }

  citasAnterioresFechaHora(fecha: Date, hora: Time): Cita[] {
    return this.citas.filter(
      (cita) =>
        cita.fecha < fecha || (cita.fecha === fecha && cita.hora <= hora)
    );
  }

  citasPosterioresFechaHora(fecha: Date, hora: Time): Cita[] {
    return this.citas.filter(
      (cita) => cita.fecha > fecha || (cita.fecha === fecha && cita.hora > hora)
    );
  }

  newCita(): Cita {
    return {
      id: this.citas.length + 1,
      fecha: new Date(),
      formatoFecha: '', // Add the 'formatoFecha' property here
      hora: { hours: 0, minutes: 0 },
      adoptante: {
        nombre: '',
        telefono: '',
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

  addCita(cita: Cita) {
    //Verificar que cita no esté vacía
    if (
      cita.adoptante.nombre == '' ||
      cita.adoptante.telefono == '' ||
      cita.mascota.id == 0
    ) {
      return;
    }
    this.citas.push(cita);
    localStorage.setItem('citas', JSON.stringify(this.citas));
  }
}
