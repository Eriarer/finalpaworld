import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CitasComponent } from './components/citas/citas.component';
import { MascotasComponent } from './components/mascotas/mascotas.component';
import { AgendarComponent } from './components/agendar/agendar.component';
import { GraficasComponent } from './components/graficas/graficas.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { ConsultasComponent } from './components/consultas/consultas.component';

export const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'mascotas', component: MascotasComponent },
  { path: 'acercade', component: AcercaDeComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'agendar', component: AgendarComponent },
  { path: 'agendar/:id', component: AgendarComponent },
  { path: 'citas', component: CitasComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'consultas', component: ConsultasComponent },
  { path: 'graficas', component: GraficasComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
