import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CitasComponent } from './components/citas/citas.component';
import { MascotasComponent } from './components/mascotas/mascotas.component';
import { AgendarComponent } from './components/agendar/agendar.component';
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
  { path: 'inicio', component: HomeComponent, title: 'PW Inicio' },
  {
    path: 'mascotas',
    component: MascotasComponent,
    title: 'PW Mascotas',
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
  { path: 'agendar', component: AgendarComponent, title: 'PW Agendar' },
  {
    path: 'agendar/:id',
    component: AgendarComponent,
    title: 'PW Agendar',
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
