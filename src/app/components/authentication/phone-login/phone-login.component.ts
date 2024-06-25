import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-phone-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatError,
    CommonModule,
  ],
  templateUrl: './phone-login.component.html',
  styleUrl: './phone-login.component.css',
})
export class PhoneLoginComponent {
  email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  loginForm = new FormGroup({
    email: this.email,
  });

  codigo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  confirmForm = new FormGroup({
    codigo: this.codigo,
  });

  constructor(private authService: AuthService, private router: Router) {}

  getEmailErrorMessage() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'El email no puede estar vacio';
    }
    return emailControl?.hasError('email') ? 'Not a valid email' : '';
  }

  async onSubmitLogin() {
    if (this.loginForm.valid) {
      console.log('Form submitted');
    }
    if (this.loginForm.invalid) {
      console.log('Form not submitted');
      console.log('Email Errors', this.loginForm.get('email')!.errors);
      console.log('Password Errors', this.loginForm.get('password')!.errors);
    }
    if (this.loginForm.valid) {
      console.log('Form submitted, value:' + this.loginForm.value);
      let captchaContainer = document.getElementById('sendCoideButton')!;
      //autenticando con email enlazado al telefono, autenticando con telefono
      await this.authService
        .singInWithPhoneNumberByEmail(this.email.value, captchaContainer)
        .then((response) => {});
    }
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
  }
}
