import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CitasComponent } from './components/citas/citas.component';
import { MascotaComponent } from './components/mascota/mascota.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { GraficasComponent } from './components/admin/graficas/graficas.component';
import { LoginComponent } from './components/login/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { ConsultasComponent } from './components/admin/consultas/consultas.component';
import { EmailLoginComponent } from './components/login/email-login/email-login.component';
import { PhoneLoginComponent } from './components/login/phone-login/phone-login.component';
import { AdminComponent } from './components/admin/admin/admin.component';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent, title: 'PW Inicio' },
  {
    path: 'mascota',
    component: MascotaComponent,
    title: 'PW mascota',
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
  { path: 'citas', component: CitasComponent, title: 'PW Citas' },
  { path: 'login', component: LoginComponent, title: 'PW Login' },
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
  { path: '**', redirectTo: '' },
];
