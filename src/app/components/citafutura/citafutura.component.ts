import { Component } from '@angular/core';
import { CitasFbService } from '../../services/firebase/citas-fb.service';
import { Timestamp } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { TimestampToDateStringPipe } from '../../pipes/timestamp-to-date-string.pipe';
import { TimestampToHourStringPipe } from '../../pipes/timestamp-to-hour-string.pipe';

import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/firebase/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-citafutura',
  standalone: true,
  imports: [
    TimestampToDateStringPipe,
    TimestampToHourStringPipe,
    CommonModule,
    LoaderComponent,
    MatIcon,
    MatButton,
    MatButtonModule,
    LoaderComponent,
  ],
  templateUrl: './citafutura.component.html',
  styleUrl: './citafutura.component.css',
})
export class CitafuturaComponent {
  citas: any = [];
  fechaActual = new Date();
  mostrar = 'block';
  today: Timestamp;
  isLoading: boolean = false;

  constructor(
    private CitasFbService: CitasFbService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUserState().subscribe(({ user, isAdmin }) => {
      if (user) {
        this.cargacitasFuturas();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  private getTodayTimestamp() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.today = Timestamp.fromDate(today);
  }

  async cargacitasFuturas() {
    // Actualizando estilos
    let style = document.getElementsByClassName('eliminar');
    let btnCitasFuturas = document.getElementById('btnCitasF');
    let btnCitasPasadas = document.getElementById('btnCitasP');
    this.getTodayTimestamp();
    if (btnCitasFuturas && btnCitasPasadas) {
      btnCitasFuturas.setAttribute(
        'style',
        'font-weight: bold; color: #04125a; border-bottom: 2px solid  #ff4081;'
      );
      btnCitasPasadas.setAttribute(
        'style',
        'font-weight: none; color: #04125a; border-bottom: 2px solid transparent;'
      );
    }
    for (let i = 0; i < style.length; i++) {
      style[i].setAttribute('style', 'display: table-cell');
    }
    this.isLoading = true;
    //Se obtienen las citas futuras
    this.CitasFbService.getCitasFuturas(this.fechaActual)
      .then((citas) => {
        this.isLoading = false;
        this.citas = citas;
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar las citas futuras',
        });
        console.error(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  async cargacitasPrevias() {
    let style = document.getElementsByClassName('eliminar');
    this.getTodayTimestamp();
    //recorremos los objetos con clase eliminar
    let btnCitasPasadas = document.getElementById('btnCitasP');
    let btnCitasFuturas = document.getElementById('btnCitasF');
    if (btnCitasFuturas && btnCitasPasadas) {
      btnCitasPasadas.setAttribute(
        'style',
        'font-weight: bold; color: #04125a; border-bottom: 2px solid  #ff4081;'
      );
      btnCitasFuturas.setAttribute(
        'style',
        'font-weight: none; color: #04125a; border-bottom: 2px solid transparent;'
      );
    }
    for (let i = 0; i < style.length; i++) {
      //ocultamos los objetos con clase eliminar
      style[i].setAttribute('style', 'display: none');
    }
    this.isLoading = true;
    this.CitasFbService.getCitasPasadas(this.fechaActual)
      .then((citas) => {
        this.citas = citas;
        this.isLoading = false;
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar las citas pasadas',
        });
        console.error(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  btnCargarPrevias(): void {
    this.cargacitasPrevias();
  }

  btnCargarFuturas(): void {
    this.cargacitasFuturas();
  }

  async btnEliminarCita(cita: string) {
    if (!cita) return;
    await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        await this.CitasFbService.deleteCita(cita)
          .then(() => {
            this.isLoading = false;
            Swal.fire({
              title: 'Cita eliminada',
              text: 'La cita ha sido eliminada correctamente',
              icon: 'success',
            });
          })
          .catch((error) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al eliminar la cita',
            });
            console.error(error);
          });
      }
    });
    this.cargacitasFuturas();
  }
}
