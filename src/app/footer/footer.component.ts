import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { LoaderComponent } from '../components/loader/loader.component';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, LoaderComponent, NgClass, NgIf],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  isLoading: boolean = false;

  formularioBoletin = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.formularioBoletin.untouched;
    this.formularioBoletin = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.formularioBoletin.valid) {
      console.log(this.formularioBoletin.value);
      this.isLoading = true;
      this.http
        .post(
          'https://correopaworld-production.up.railway.app/boletin',
          this.formularioBoletin.value
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: '¡Gracias!',
              text: 'Te has suscrito correctamente.',
            });
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: '¡Lo sentimos!',
              text: 'Ha ocurrido un error, por favor intenta de nuevo.',
            });
          }
        );
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Lo sentimos!',
        text: 'Por favor, completa el formulario correctamente.',
      });
    }
  }
}
