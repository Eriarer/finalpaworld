import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    // Si la ruta no es login/email o login/phone, redirigir a login/email
    if (
      this.router.url !== '/login/email' &&
      this.router.url !== '/login/phone'
    ) {
      this.router.navigate(['/login/email']);
    }
  }
}
