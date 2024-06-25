import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CitafuturaComponent } from './components/citafutura/citafutura.component';
import { MascotaComponent } from './components/mascota/mascota.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { GraficasComponent } from './components/admin/graficas/graficas.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { ConsultasComponent } from './components/admin/consultas/consultas.component';
import { EmailLoginComponent } from './components/authentication/email-login/email-login.component';
import { PhoneLoginComponent } from './components/authentication/phone-login/phone-login.component';
import { AdminComponent } from './components/admin/admin/admin.component';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent, title: 'PW Inicio' },
  {
    path: 'mascotas',
    component: MascotaComponent,
    title: 'PW mascotas',
  },
  {
    path: 'acercade',
    component: AcercaDeComponent,
    title: 'PW Acerca de',
  },
  {
    path: 'contacto',
    component: ContactoComponent,
    title: 'PW Contacto',
  },
  { path: 'agenda', component: AgendaComponent, title: 'PW Agenda' },
  {
    path: 'agenda/:id',
    component: AgendaComponent,
    title: 'PW Agenda',
  },
  { path: 'citas', component: CitafuturaComponent, title: 'PW citas' },
  { path: 'login', redirectTo: '/login/email', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    children: [
      {
        path: 'email',
        component: EmailLoginComponent,
        title: 'PW Login | Email',
      },
      {
        path: 'phone',
        component: PhoneLoginComponent,
        title: 'PW Login | Phone',
      },
    ],
  },
  { path: 'registro', component: RegisterComponent, title: 'PW Sing Up' },
  { path: 'admin', component: AdminComponent, title: 'PW Admin' },
  {
    path: 'admin',
    component: AdminComponent,
    title: 'PW Admin',
    children: [
      {
        path: 'graficas',
        component: GraficasComponent,
        title: 'PW Admin | Graficas',
      },
      {
        path: 'consultas',
        component: ConsultasComponent,
        title: 'PW Admin | Consultas',
      },
    ],
  },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', redirectTo: '/inicio' },
];
