import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class ContactoComponent {
  resultado!: string;

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
      this.http
        .post('https://correopaworld-production.up.railway.app/contacto', this.formularioContacto.value)
        .subscribe(
          (res) => {
            console.log(res);
          },
          (error) => {
            console.log(error);
          }
        );

      this.resultado =
        'Gracias por tus comentarios ' +
        this.formularioContacto.value.nombre +
        '.<br>Enviaremos una respuesta a tu correo ' +
        this.formularioContacto.value.correo +
        '.';
    } else
      this.resultado = 'Por favor, completa correctamente todos los campos.';
  }
}
