import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavSerachComponent } from '../nav-serach/nav-serach.component';
import { NavUserStateComponent } from '../nav-user-state/nav-user-state.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterModule,
    NavSerachComponent,
    NavUserStateComponent,
    FooterComponent,
  ],
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
    'Agenda',
    'Citas',
  ];
}
