import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, LoaderComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class ContactoComponent {
  isLoading: boolean = false;

  formularioContacto = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    asunto: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    mensaje: new FormControl('', [
      Validators.required,
      Validators.maxLength(500),
    ]),
  });

  constructor(private http: HttpClient) {}

  submit() {
    if (this.formularioContacto.valid) {
      console.log(this.formularioContacto.value);
      this.isLoading = true;
      this.http
        .post(
          'https://correopaworld-production.up.railway.app/contacto',
          this.formularioContacto.value
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: '¡Gracias!',
              text: 'Hemos recibido tus comentarios.',
            });
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: '¡Lo sentimos!',
              text: 'Ocurrió un error al enviar tus comentarios.',
            });
          }
        );
    }
  }
}
