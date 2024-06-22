import { Injectable } from '@angular/core';
import { Mascota } from '../../interfaces/mascota';

@Injectable({
  providedIn: 'root',
})
export class MascotasService {
  private mascotas: Mascota[] = [
    {
      id: 1,
      edad: 1,
      color: 'Blanco',
      tipo: 'perro',
      raza: 'Labrador Retriever',
      fechaIngreso: new Date('2024-02-20'),
      descripcion:
        'El Labrador Retriever es conocido por ser un perro muy juguetón, amigable y adaptable. Son excelentes compañeros para familias y tienen una naturaleza cariñosa.',
      imagen: 'assets/img/pets/1.webp',
      sexo: 'Macho',
    },
    {
      id: 2,
      edad: 2,
      color: 'Cafe con negro',
      tipo: 'perro',
      raza: 'Pastor Alemán',
      fechaIngreso: new Date('2023-11-02'),
      descripcion:
        'El Pastor Alemán es un perro muy protector y leal que estará contigo siempre. Son inteligentes, valientes y se destacan en roles de trabajo, como perros policía o de rescate.',
      imagen: 'assets/img/pets/2.webp',
      sexo: 'Hembra',
    },
    {
      id: 3,
      edad: 3,
      color: 'Negro y blanco',
      tipo: 'perro',
      raza: 'Bulldog Francés',
      fechaIngreso: new Date('2023-01-15'),
      descripcion:
        'El Bulldog Francés es conocido por su personalidad juguetona y su apariencia única. Son perros pequeños y robustos que se llevan bien en apartamentos o casas con poco espacio.',
      imagen: 'assets/img/pets/3.webp',
      sexo: 'Macho',
    },
    {
      id: 4,
      edad: 2,
      color: 'Dorado',
      tipo: 'perro',
      raza: 'Golden Retriever',
      fechaIngreso: new Date('2023-04-30'),
      descripcion:
        'El Golden Retriever es un perro cariñoso, amigable y lleno de energía. Son excelentes compañeros para familias activas y son conocidos por su amor por el agua y su disposición para aprender.',
      imagen: 'assets/img/pets/4.webp',
      sexo: 'Hembra',
    },
    {
      id: 5,
      edad: 3,
      color: 'Cafe, negro y blanco',
      tipo: 'perro',
      raza: 'Beagle',
      fechaIngreso: new Date('2022-10-12'),
      descripcion:
        'El Beagle es un perro alegre, activo y curioso. Tienen un olfato excepcional y disfrutan explorando su entorno. Son excelentes mascotas para familias y les encanta estar en compañía.',
      imagen: 'assets/img/pets/5.webp',
      sexo: 'Hembra',
    },
    {
      id: 6,
      edad: 2,
      color: 'Ceniza y cafe',
      tipo: 'gato',
      raza: 'Siamese',
      fechaIngreso: new Date('2023-09-20'),
      descripcion:
        'El gato Siamés es conocido por su apariencia elegante y su personalidad extrovertida. Son muy vocales y disfrutan interactuando con sus dueños. También son inteligentes y juguetones.',
      imagen: 'assets/img/pets/6.webp',
      sexo: 'Macho',
    },
    {
      id: 7,
      edad: 4,
      color: 'Naranja',
      tipo: 'gato',
      raza: 'Persa',
      fechaIngreso: new Date('2021-10-02'),
      descripcion:
        'El gato Persa es conocido por su pelaje largo y denso, así como por su naturaleza tranquila y cariñosa. Son ideales para personas que buscan un compañero de pelaje suave y temperamento dulce.',
      imagen: 'assets/img/pets/7.webp',
      sexo: 'Macho',
    },
    {
      id: 8,
      edad: 2,
      color: 'Cafe y negro',
      tipo: 'gato',
      raza: 'Maine Coon',
      fechaIngreso: new Date('2023-03-11'),
      descripcion:
        'El Maine Coon es una raza de gato grande y musculoso con un pelaje exuberante y una cola larga y tupida. Son gatos amigables, inteligentes y se llevan bien con niños y otras mascotas.',
      imagen: 'assets/img/pets/8.webp',
      sexo: 'Macho',
    },
    {
      id: 9,
      edad: 1,
      color: 'Gris',
      tipo: 'gato',
      raza: 'British Shorthair',
      fechaIngreso: new Date('2023-06-29'),
      descripcion:
        'El British Shorthair es un gato de tamaño mediano a grande con una estructura robusta y un pelaje denso y suave. Son gatos tranquilos, afectuosos y disfrutan de momentos de tranquilidad junto a sus dueños.',
      imagen: 'assets/img/pets/9.webp',
      sexo: 'Hembra',
    },
    {
      id: 10,
      edad: 2,
      color: 'Manchado de colores cafe negro y blanco',
      tipo: 'gato',
      raza: 'Bengal',
      fechaIngreso: new Date('2024-01-10'),
      descripcion:
        'El gato Bengal es conocido por su pelaje manchado y su apariencia similar a la de un leopardo. Son gatos activos, curiosos y les gusta jugar. También pueden formar vínculos fuertes con sus dueños.',
      imagen: 'assets/img/pets/10.webp',
      sexo: 'Hembra',
    },
  ];

  constructor() {}

  getMascotas(): Mascota[] {
    return this.mascotas;
  }

  getMascotaById(id: number): Mascota {
    return this.mascotas[id - 1];
  }

  getMascotasByTipo(tipo: string): Mascota[] {
    //Devuelve todos los tipo "perro" o "gato"
    return this.mascotas.filter(
      (mascota) => mascota.tipo.toLowerCase() === tipo.toLocaleLowerCase()
    );
  }

  getMascotasByRaza(raza: string): Mascota[] {
    return this.mascotas.filter(
      (mascota) => mascota.raza.toLowerCase() === raza.toLowerCase()
    );
  }
}
