export interface Mascota {
  id: number;
  edad: number;
  color: string;
  tipo: string; //gato o perro
  raza: string; //pitbull, siames, etc
  fechaIngreso: Date; //la fecha en la que llego, aquí no importa la hora
  descripcion: string;
  imagen: string;
  sexo: string; //macho o hembra
}
