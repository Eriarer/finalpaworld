export interface Mascota {
  id: number;
  edad: number;
  color: string;
  tipo: string; //gato o perro
  raza: string; //pitbull, siames, etc
  fechaIngreso: string; //la fecha en la que llego
  descripcion: string;
  imagen: string;
  sexo: string; //macho o hembra
}
