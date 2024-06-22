import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-email-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './email-login.component.html',
  styleUrl: './email-login.component.css',
})
export class EmailLoginComponent {
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

  onSubmitLogin() {
    if (this.loginForm.valid) {
      console.log('Form submitted');
    }
    if (this.loginForm.invalid) {
      console.log('Form not submitted');
      console.log('Email Errors', this.loginForm.get('email')!.errors);
      console.log('Password Errors', this.loginForm.get('password')!.errors);
    }
  }
}
