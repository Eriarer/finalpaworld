import { Injectable } from '@angular/core';
import { Cita } from '../../interfaces/cita';
import { take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Time } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  urlAPI: string = 'https://paworld.free.beeceptor.com';
  public citasDefinidas: Cita[] = [
    {
      fecha: '20/07/2023',
      hora: {
        hours: 11,
        minutes: 30,
      },
      adoptante: {
        id: '',
        nombre: 'Ana García',
        telefono: '4491234567',
        correo: 'ana.garcia@example.com',
      },
      mascota: {
        id: 1,
        edad: 1,
        color: 'Blanco',
        tipo: 'perro',
        raza: 'Labrador Retriever',
        fechaIngreso: '20/07/2022', // Cambiado a string
        descripcion:
          'El Labrador Retriever es conocido por ser un perro muy juguetón, amigable y adaptable. Son excelentes compañeros para familias y tienen una naturaleza cariñosa.',
        imagen: '../../../assets/img/pets/1.webp',
        sexo: 'Macho',
      },
    },
    {
      fecha: '10/09/2023',
      hora: {
        hours: 14,
        minutes: 0,
      },
      adoptante: {
        id: '',
        nombre: 'Carlos López',
        telefono: '4492345678',
        correo: 'carlos.lopez@example.com',
      },
      mascota: {
        id: 2,
        edad: 2,
        color: 'Cafe con negro',
        tipo: 'perro',
        raza: 'Pastor Alemán',
        fechaIngreso: '10/09/2022', // Cambiado a string
        descripcion:
          'El Pastor Alemán es un perro muy protector y leal que estará contigo siempre. Son inteligentes, valientes y se destacan en roles de trabajo, como perros policía o de rescate.',
        imagen: '../../../assets/img/pets/2.webp',
        sexo: 'Hembra',
      },
    },
    {
      fecha: '05/10/2023',
      hora: {
        hours: 16,
        minutes: 30,
      },
      adoptante: {
        id: '',
        nombre: 'Luisa Martínez',
        telefono: '4493456789',
        correo: 'luisa.martinez@example.com',
      },
      mascota: {
        id: 3,
        edad: 3,
        color: 'Negro y blanco',
        tipo: 'perro',
        raza: 'Bulldog Francés',
        fechaIngreso: '05/10/2022', // Cambiado a string
        descripcion:
          'El Bulldog Francés es conocido por su personalidad juguetona y su apariencia única. Son perros pequeños y robustos que se llevan bien en apartamentos o casas con poco espacio.',
        imagen: '../../../assets/img/pets/3.webp',
        sexo: 'Macho',
      },
    },
    {
      fecha: '15/11/2023',
      hora: {
        hours: 12,
        minutes: 0,
      },
      adoptante: {
        id: '',
        nombre: 'María Rodríguez',
        telefono: '4494567890',
        correo: 'maria.rodriguez@example.com',
      },
      mascota: {
        id: 4,
        edad: 2,
        color: 'Dorado',
        tipo: 'perro',
        raza: 'Golden Retriever',
        fechaIngreso: '15/11/2022', // Cambiado a string
        descripcion:
          'El Golden Retriever es un perro cariñoso, amigable y lleno de energía. Son excelentes compañeros para familias activas y son conocidos por su amor por el agua y su disposición para aprender.',
        imagen: '../../../assets/img/pets/4.webp',
        sexo: 'Hembra',
      },
    },
    {
      fecha: '03/05/2024',
      hora: {
        hours: 15,
        minutes: 0,
      },
      adoptante: {
        id: '',
        nombre: 'Laura Gómez',
        telefono: '4497890123',
        correo: 'laura.gomez@example.com',
      },
      mascota: {
        id: 7,
        edad: 4,
        color: 'Naranja',
        tipo: 'gato',
        raza: 'Persa',
        fechaIngreso: '03/05/2021', // Cambiado a string
        descripcion:
          'El gato Persa es conocido por su pelaje largo y denso, así como por su naturaleza tranquila y cariñosa. Son ideales para personas que buscan un compañero de pelaje suave y temperamento dulce.',
        imagen: '../../../assets/img/pets/7.webp',
        sexo: 'Macho',
      },
    },
    {
      fecha: '07/06/2024',
      hora: {
        hours: 16,
        minutes: 30,
      },
      adoptante: {
        id: '',
        nombre: 'Diego Díaz',
        telefono: '4498901234',
        correo: 'diego.diaz@example.com',
      },
      mascota: {
        id: 8,
        edad: 2,
        color: 'Cafe y negro',
        tipo: 'gato',
        raza: 'Maine Coon',
        fechaIngreso: '07/06/2023', // Cambiado a string
        descripcion:
          'El Maine Coon es una raza de gato grande y musculoso con un pelaje exuberante y una cola larga y tupida. Son gatos amigables, inteligentes y se llevan bien con niños y otras mascotas.',
        imagen: '../../../assets/img/pets/8.webp',
        sexo: 'Macho',
      },
    },
    {
      fecha: '15/07/2024',
      hora: {
        hours: 17,
        minutes: 0,
      },
      adoptante: {
        id: '',
        nombre: 'Sofia Ruiz',
        telefono: '4490123456',
        correo: 'sofia.ruiz@example.com',
      },
      mascota: {
        id: 9,
        edad: 1,
        color: 'Gris',
        tipo: 'gato',
        raza: 'British Shorthair',
        fechaIngreso: '15/07/2023', // Cambiado a string
        descripcion:
          'El British Shorthair es un gato de tamaño mediano a grande con una estructura robusta y un pelaje denso y suave. Son gatos tranquilos, afectuosos y disfrutan de momentos de tranquilidad junto a sus dueños.',
        imagen: '../../../assets/img/pets/9.webp',
        sexo: 'Hembra',
      },
    },
    {
      fecha: '20/08/2024',
      hora: {
        hours: 18,
        minutes: 0,
      },
      adoptante: {
        id: '',
        nombre: 'Pedro Martínez',
        telefono: '4499876543',
        correo: 'pedro.martinez@example.com',
      },
      mascota: {
        id: 10,
        edad: 2,
        color: 'Manchado de colores cafe negro y blanco',
        tipo: 'gato',
        raza: 'Bengal',
        fechaIngreso: '20/08/2023', // Cambiado a string
        descripcion:
          'El gato Bengal es conocido por su pelaje manchado y su apariencia similar a la de un leopardo. Son gatos activos, curiosos y les gusta jugar. También pueden formar vínculos fuertes con sus dueños.',
        imagen: '../../../assets/img/pets/10.webp',
        sexo: 'Hembra',
      },
    },
    {
      fecha: '22/09/2024',
      hora: {
        hours: 15,
        minutes: 30,
      },
      adoptante: {
        id: '',
        nombre: 'Marcos Sánchez',
        telefono: '4493456789',
        correo: 'marcos.sanchez@example.com',
      },
      mascota: {
        id: 8,
        edad: 2,
        color: 'Cafe y negro',
        tipo: 'gato',
        raza: 'Maine Coon',
        fechaIngreso: '22/09/2023', // Cambiado a string
        descripcion:
          'El Maine Coon es una raza de gato grande y musculoso con un pelaje exuberante y una cola larga y tupida. Son gatos amigables, inteligentes y se llevan bien con niños y otras mascotas.',
        imagen: '../../../assets/img/pets/8.webp',
        sexo: 'Macho',
      },
    },
    {
      fecha: '30/10/2024',
      hora: {
        hours: 11,
        minutes: 30,
      },
      adoptante: {
        id: '',
        nombre: 'Marta González',
        telefono: '4494567890',
        correo: 'marta.gonzalez@example.com',
      },
      mascota: {
        id: 9,
        edad: 1,
        color: 'Gris',
        tipo: 'gato',
        raza: 'British Shorthair',
        fechaIngreso: '30/10/2023', // Cambiado a string
        descripcion:
          'El British Shorthair es un gato de tamaño mediano a grande con una estructura robusta y un pelaje denso y suave. Son gatos tranquilos, afectuosos y disfrutan de momentos de tranquilidad junto a sus dueños.',
        imagen: '../../../assets/img/pets/9.webp',
        sexo: 'Hembra',
      },
    },
    {
      fecha: '12/11/2024',
      hora: {
        hours: 13,
        minutes: 45,
      },
      adoptante: {
        id: '',
        nombre: 'Hugo Mendoza',
        telefono: '4499876543',
        correo: 'hugo.mendoza@example.com',
      },
      mascota: {
        id: 10,
        edad: 2,
        color: 'Manchado de colores cafe negro y blanco',
        tipo: 'gato',
        raza: 'Bengal',
        fechaIngreso: '12/11/2024', // Cambiado a string
        descripcion:
          'El gato Bengal es conocido por su pelaje manchado y su apariencia similar a la de un leopardo. Son gatos activos, curiosos y les gusta jugar. También pueden formar vínculos fuertes con sus dueños.',
        imagen: '../../../assets/img/pets/10.webp',
        sexo: 'Hembra',
      },
    },
    {
      fecha: '01/12/2024',
      hora: {
        hours: 10,
        minutes: 30,
      },
      adoptante: {
        id: '',
        nombre: 'Lucía Ramos',
        telefono: '4493456789',
        correo: 'lucia.ramos@example.com',
      },
      mascota: {
        id: 8,
        edad: 2,
        color: 'Cafe y negro',
        tipo: 'gato',
        raza: 'Maine Coon',
        fechaIngreso: '01/12/2023', // Cambiado a string
        descripcion:
          'El Maine Coon es una raza de gato grande y musculoso con un pelaje exuberante y una cola larga y tupida. Son gatos amigables, inteligentes y se llevan bien con niños y otras mascotas.',
        imagen: '../../../assets/img/pets/8.webp',
        sexo: 'Macho',
      },
    },
    {
      fecha: '15/12/2024',
      hora: {
        hours: 9,
        minutes: 0,
      },
      adoptante: {
        id: '',
        nombre: 'Fernando Ramírez',
        telefono: '4495678901',
        correo: 'fernando.ramirez@example.com',
      },
      mascota: {
        id: 7,
        edad: 4,
        color: 'Naranja',
        tipo: 'gato',
        raza: 'Persa',
        fechaIngreso: '15/12/2021', // Cambiado a string
        descripcion:
          'El gato Persa es conocido por su pelaje largo y denso, así como por su naturaleza tranquila y cariñosa. Son ideales para personas que buscan un compañero de pelaje suave y temperamento dulce.',
        imagen: '../../../assets/img/pets/7.webp',
        sexo: 'Macho',
      },
    },
  ];

  // constructor(private http: HttpClient) {
  //   console.log('En este instante el componente ha cargado');
  //   this.uploadLocalStorage();
  //   if (this.citas.length === 0) {
  //     this.recuperarDatos();
  //   }
  // }

  // //Funciones para cargar los datos de las citas
  // recuperarDatos() {
  //   //Recupera los datos del API
  //   /*El método subscribe es para subscribirte al observable (uso del get en el servicio), cuando llegan*/
  //   console.log('Entrando a Recuperando datos');
  //   this.retornar().subscribe({
  //     next: this.successRequest.bind(this),
  //     /*el .brind es para que cuando llegueal metodo succesRequest el this siga funcionando, sino se pierde el contexto*/
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // } //Fin recuperarDatos

  // retornar() {
  //   return this.http.get(this.urlAPI).pipe(take(1));
  // }

  // successRequest(data: any): void {
  //   console.log(data); //imprime la data que llega del API
  //   this.citas = data.citas; //Se asigna la data al array local
  //   console.log('citas', this.citas);
  //   //Se guarda en el local storage
  //   localStorage.setItem('citas', JSON.stringify(this.citas));
  // }

  // uploadLocalStorage() {
  //   const citasLocalStorage = JSON.parse(localStorage.getItem('citas') || '[]');
  //   if (citasLocalStorage.length != 0) {
  //     this.citas = citasLocalStorage;
  //   }
  // }

  // getCitas(): Cita[] {
  //   return this.citas;
  // }

  // newCita(): Cita {
  //   return {
  //     id: this.citas.length + 1,
  //     fecha: new Date(),
  //     formatoFecha: '', // Add the 'formatoFecha' property here
  //     hora: { hours: 0, minutes: 0 },
  //     adoptante: {
  //       nombre: '',
  //       telefono: '',
  //       correo: '',
  //     },
  //     mascota: {
  //       id: 0,
  //       edad: 0,
  //       color: '',
  //       tipo: '',
  //       raza: '',
  //       fechaIngreso: new Date(),
  //       descripcion: '',
  //       imagen: '',
  //       sexo: '',
  //     },
  //   };
  // }

  // addCita(cita: Cita) {//
  //   //Verificar que cita no esté vacía
  //   if (
  //     cita.adoptante.nombre == '' ||
  //     cita.adoptante.telefono == '' ||
  //     cita.mascota.id == 0
  //   ) {
  //     return;
  //   }
  //   // this.citas.push(cita);
  //   // localStorage.setItem('citas', JSON.stringify(this.citas));
  //   const response = this.firestoreService.addCita(cita);
  //   console.log('Cita agregada:', response);
  // }
}
