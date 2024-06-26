import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Mascota } from '../../../interfaces/mascota';
import { MascotasService } from '../../../services/data/mascotas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-serach',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './nav-serach.component.html',
  styleUrl: './nav-serach.component.css',
})
export class NavSerachComponent {
  search = new FormControl('', {
    nonNullable: true,
    validators: [Validators.maxLength(20)],
  });
  mascotas: Mascota[] = [];

  searchForm = new FormGroup({
    search: this.search,
  });
  constructor(
    private masoctasService: MascotasService,
    private router: Router
  ) {
    this.mascotas = this.masoctasService.getMascotas();
  }

  onSubmitSearch() {
    if (this.searchForm.invalid || this.search.value == '') return;
    // hacer el form invalido si el valor es menor a 3
    if (this.search.value.length <= 3) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La busqueda debe tener más de 3 caracteres',
      });
      return;
    }
    console.log('Search clicked');
    // si los valores de la mascota estan dentro de edad, color, tipo, raza, fechaIngreso, o sexo
    // buscar
    let busqueda = this.mascotas.filter((mascota) => {
      return (
        mascota.edad.toString().includes(this.search.value) ||
        mascota.color.toLowerCase().includes(this.search.value.toLowerCase()) ||
        mascota.tipo.toLowerCase().includes(this.search.value.toLowerCase()) ||
        mascota.raza.toLowerCase().includes(this.search.value.toLowerCase()) ||
        mascota.fechaIngreso.includes(this.search.value) ||
        mascota.sexo.toLowerCase().includes(this.search.value.toLowerCase())
      );
    });
    // hacer un string con id-id-id-id
    let ids = busqueda.map((mascota) => mascota.id).join('-');
    if (ids.length <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se encontraron resultados',
      });
      return;
    }
    console.log(ids);
    this.router.navigate(['/mascotas', ids]);
  }
}
