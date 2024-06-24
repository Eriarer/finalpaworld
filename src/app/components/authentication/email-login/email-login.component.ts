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

  constructor(private router: Router, private authService: AuthService) {}

  onSubmitLogin() {
    if (this.loginForm.invalid) {
      console.log('Form not submitted');
      console.log('Email Errors', this.loginForm.get('email')!.errors);
      console.log('Password Errors', this.loginForm.get('password')!.errors);
      return;
    }
    console.log('Form submitted');
    let loginButton = document.getElementById('loginButton')!;
    this.authService
      .signInWithEmailAndPassword(
        this.email.value,
        this.password.value,
        loginButton
      )
      .then(() => {
        this.router.navigate(['/inicio']);
      });
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
  getEmailErrorMessage() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    return emailControl?.hasError('email') ? 'Not a valid email' : '';
  }
}
