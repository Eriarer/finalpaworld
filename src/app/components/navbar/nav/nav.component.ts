import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavSerachComponent } from '../nav-serach/nav-serach.component';
import { NavUserStateComponent } from '../nav-user-state/nav-user-state.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, NavSerachComponent, NavUserStateComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  appName = 'PaWorld';
  navLinks: String[] = [
    'Inicio',
    'Mascotas',
    'Acerca De',
    'Contacto',
    'Agendar',
    'Citas',
  ];
}
