import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/firebase/auth.service';
import { User } from '@angular/fire/auth';
import { UserState } from '../../../interfaces/userState';
import { take } from 'rxjs';
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
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    //escuchar los eventos de cambio de ruta
    this.authService
      .getCurrentUserState()
      .toPromise()
      .then((userState: UserState | undefined) => {
        if (!userState) return;
        if (userState.user) {
          this.router.navigate(['/inicio']);
        }
      });
    this.router.events.subscribe(() => {
      if (
        this.router.url !== '/login/email' &&
        this.router.url !== '/login/phone'
      )
        return;
      this.loginType = this.router.url.split('/')[2];
    });
    // Si la ruta no es login/email o login/phone, redirigir a login/email
  }
}
