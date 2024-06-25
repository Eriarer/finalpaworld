import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/firebase/auth.service';
import { UsersFbService } from '../../../services/firebase/users-fb.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-email-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatError,
  ],
  templateUrl: './email-login.component.html',
  styleUrl: './email-login.component.css',
})
export class EmailLoginComponent {
  hidePassword: boolean = true;

  password = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  codigo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  confirmForm = new FormGroup({
    codigo: this.codigo,
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private userUservice: UsersFbService
  ) {}

  getEmailErrorMessage() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'El email no puede estar vacio';
    }
    return emailControl?.hasError('email') ? 'Not a valid email' : '';
  }
  getPasswordErrorMessage() {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    return passwordControl?.hasError('minlength')
      ? 'Password must be at least 6 characters long'
      : '';
  }

  onSubmitLogin() {
    if (this.loginForm.invalid) {
      console.log('Form not submitted');
      console.log('Email Errors', this.loginForm.get('email')!.errors);
      console.log('Password Errors', this.loginForm.get('password')!.errors);
      return;
    }
    console.log('Form submitted');
    let buttonElement = document.getElementById('loginButton')!;
    this.authService
      .signInWithEmailAndPassword(
        this.email.value,
        this.password.value,
        buttonElement
      )
      .then((respone) => {
        if (respone !== undefined) {
          document.getElementById('loginForm')!.style.display = 'none';
          document.getElementById('confirmForm')!.style.display = 'flex';
          return;
        }
        Swal.fire({
          title: 'Success',
          text: 'Login successful',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/inicio']);
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
        }).then(() => {
          this.loginForm.reset({
            email: '',
            password: '',
          });
        });
      });
  }

  getCodigoErrorMessage() {
    const codigoControl = this.confirmForm.get('codigo');
    if (codigoControl?.hasError('required')) {
      return 'El codigo no puede estar vacio';
    } else if (codigoControl?.hasError('minlength')) {
      return 'El codigo debe tener al menos 6 caracteres';
    }
    return '';
  }

  onSubmitConfirm() {
    if (this.confirmForm.invalid) {
      console.log('Form not submitted');
      console.log('Codigo Errors', this.confirmForm.get('codigo')!.errors);
    }
    console.log('Form submitted', this.codigo.value);
    this.authService
      .linkPhoneVerifyCode(this.codigo.value)
      .then((response) => {
        console.log('response', response);
        Swal.fire({
          title: 'Exito',
          text: 'Autenticacion exitosa',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/inicio']);
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
        }).then(() => {
          this.router.navigate(['/login/phone']);
          setTimeout(() => {
            window.location.reload();
          }, 100);
        });
      });
  }
}
