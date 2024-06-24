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
@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginType: string = 'email';
  constructor(private router: Router) {
    if (
      this.router.url !== '/login/email' &&
      this.router.url !== '/login/phone'
    ) {
      this.router.navigate(['/login/email']);
    }
  }

  ngOnInit() {
    //escuchar los eventos de cambio de ruta
    this.router.events.subscribe(() => {
      if (
        this.router.url !== '/login/email' &&
        this.router.url !== '/login/phone'
      ) {
        this.router.navigate(['/login/email']);
      }
      this.loginType = this.router.url.split('/')[2];
    });
    // Si la ruta no es login/email o login/phone, redirigir a login/email
  }
}
