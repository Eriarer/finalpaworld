import { Component, Inject, Input } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MascotasService } from '../../services/data/mascotas.service';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Mascota } from '../../interfaces/mascota';
import { Cita } from '../../interfaces/cita';
import { Adoptante } from '../../interfaces/adoptante';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, merge } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import 'moment/locale/fr';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CitasFbService } from '../../services/firebase/citas-fb.service';
import { AuthService } from '../../services/firebase/auth.service';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoaderComponent } from '../loader/loader.component';
import { UsersFbService } from '../../services/firebase/users-fb.service';

// Define custom date format for fr locale
export const FR_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-agenda',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'fr' },
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: FR_DATE_FORMATS },
  ],
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    LoaderComponent,
  ],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css',
})
export class AgendaComponent {
  isLoading: boolean = false;
  //datos del usuario
  nombre: string = '';
  telefono = 0;
  //datos de la mascota
  @Input() id!: any;
  mascota!: Mascota;

  tiempoRefugio!: number;

  //datos para el calendario
  minDate!: Date;
  maxDate!: Date;

  //Para formatear la fecha (DD/MM/YYYY)
  private _adapter!: DateAdapter<any>;
  private _intl!: MatDatepickerIntl;
  @Inject(MAT_DATE_LOCALE) private _locale!: string;

  //Para almacennar datos de la cita
  dataAdoptante!: Adoptante;
  dataCita!: Cita;

  public horasOcupadas: string[] = [];
  public horas: string[] = [
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
  ];

  nombreAdop = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z ]*'),
  ]);
  errorMessage = '';
  telAdop = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]{10}'),
    Validators.minLength(10),
    Validators.maxLength(10),
  ]);
  razonAdop = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z ]*'),
  ]);
  errorMessage2 = '';
  selectedDate: any;
  selectedHour: string | undefined;
  selectedFecha: any;
  private userStateSubscription?: Subscription;
  userLogged: any;

  constructor(
    public mascotasService: MascotasService,
    public activatedRoute: ActivatedRoute,
    public CitasFbService: CitasFbService,
    private authService: AuthService,
    private http: HttpClient,
    private userService: UsersFbService
  ) {
    // conseguir el ID de la url /agenda/:id
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
    if (this.id == undefined) {
      this.mascota = this.mascotasService.getMascotaById(1);
    } else {
      this.mascota = this.mascotasService.getMascotaById(Number(this.id));
    }

    let fechaActual = new Date();
    //La fecha mínima es la fecha actual +1
    this.minDate = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() - 1,
      fechaActual.getDate() + 1
    );
    //La fecha máxima es la fecha actual +2 meses
    this.maxDate = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() + 2,
      fechaActual.getDate()
    );

    //Manejo de errores en el formulario
    merge(this.nombreAdop.statusChanges, this.razonAdop.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit() {
    this.tiempoRefugio = this.GettiempoRefugio();

    this.userStateSubscription = this.authService
      .getCurrentUserState()
      .subscribe(({ user, isAdmin }) => {
        if (user != null) {
          this.userLogged = user;
        } else {
          this.userLogged = user;
        }
      });
  }

  ngOnDestroy() {
    if (this.userStateSubscription) {
      this.userStateSubscription.unsubscribe();
    }
  }

  //función para calcular el tiempo en el refugio del animal
  GettiempoRefugio(): number {
    let fechaActual = new Date();
    let fechaIngreso = this.mascota.fechaIngreso;
    let tiempoRefugio = fechaActual.getTime() - fechaIngreso.getTime();
    return Math.floor(tiempoRefugio / (1000 * 60 * 60 * 24));
  }

  //Función para ir a la siguiente mascota
  SiguienteMascota() {
    if (this.mascota.id == this.mascotasService.getMascotas().length) {
      this.mascota = this.mascotasService.getMascotaById(1);
    } else {
      this.mascota = this.mascotasService.getMascotaById(this.mascota.id + 1);
    }
    this.tiempoRefugio = this.GettiempoRefugio();
  }

  //Función para ir a la mascota anterior
  AnteriorMascota() {
    if (this.mascota.id == 1) {
      this.mascota = this.mascotasService.getMascotaById(
        this.mascotasService.getMascotas().length
      );
    } else {
      this.mascota = this.mascotasService.getMascotaById(this.mascota.id - 1);
    }
    this.tiempoRefugio = this.GettiempoRefugio();
  }

  //Funciones para el manejo de errores
  updateErrorMessage() {
    if (this.razonAdop.hasError('required')) {
      this.errorMessage = 'Debes ingresar un valor';
    } else if (this.razonAdop.hasError('pattern')) {
      this.errorMessage = 'Razón invalida';
    } else {
      this.errorMessage = '';
    }
  }

  updateErrorMessage2() {
    if (this.telAdop.hasError('required')) {
      this.errorMessage2 = 'Debes ingresar un valor';
    } else if (this.telAdop.hasError('pattern')) {
      this.errorMessage2 = 'Teléfono invalido';
    } else {
      this.errorMessage2 = '';
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
    this.horasOcupadas = [];
    this.actualizaHorasDisp();
  }

  //Función para guardar datos de la cita en el localstorage con el service citas
  async GuardarCita() {
    if (this.razonAdop.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Razón invalida',
        icon: 'error',
      });
    } else if (this.selectedDate == null) {
      Swal.fire({
        title: 'Error!',
        text: 'Debes seleccionar una fecha',
        icon: 'error',
      });
    } else if (this.selectedHour == null) {
      Swal.fire({
        title: 'Error!',
        text: 'Debes seleccionar una hora',
        icon: 'error',
      });
    } else {
      this.isLoading = true;
      //Todo es correcto
      this.dataCita = this.CitasFbService.newCita();
      let selectedDate2 = this.selectedDate
        ? new Date(this.selectedDate)
        : null;
      this.dataCita.fechaHora = this.selectedDate;
      this.dataCita.fechaHora.setHours(Number(this.selectedHour.split(':')[0]));
      this.dataCita.fechaHora.setMinutes(
        Number(this.selectedHour.split(':')[1])
      );
      this.dataCita.mascota = this.mascota;

      this.dataCita.adoptante.razon = this.razonAdop.value ?? '';
      this.dataCita.adoptante.nombre = await this.userService.getUsernameByUid(
        this.userLogged.uid
      );
      this.dataCita.adoptante.telefono = this.userLogged.phoneNumber;
      this.dataCita.adoptante.correo = this.userLogged.email;
      const response = this.CitasFbService.addCita(this.dataCita); //agregando a firebase
      // this.dataCita.fechaHora.getDate();
      this.submit(); //Envio de correo
      this.isLoading = false;
      Swal.fire({
        title: 'Cita agendada',
        text: 'La cita ha sido agendada correctamente, se ha enviado un correo con la información.',
        icon: 'success',
      });
      this.clearFields();
    }
  }

  //Obtener citas de firebase,
  async actualizaHorasDisp() {
    let selectedDate2 = this.selectedDate ? new Date(this.selectedDate) : null;
    try {
      this.horasOcupadas = await this.CitasFbService.getAllHoursOcupied(
        selectedDate2
      );
    } catch (e) {
      this.isLoading = false;
      console.log(e);
      return;
    } finally {
      this.isLoading = false;
    }
  }

  UnirFechaHora(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  //borrando el contenido de los campos input
  clearFields() {
    this.razonAdop.setValue('');
    this.selectedDate = this.selectedFecha = this.selectedHour = '';
    //Eliminar la flag de touched para eliminar el error
    this.razonAdop.markAsUntouched();
    this.nombreAdop.markAsUntouched();
    this.telAdop.markAsUntouched();
  }

  //////// Envio de correo ////////
  submit() {
    this.isLoading = true;
    this.http
      .post(
        'https://correopaworld-production.up.railway.app/cita',
        this.dataCita
      )
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: '¡Lo sentimos!',
            text: 'Ocurrió un error al enviar el correo de su cita.',
          });
        }
      );
  }
}
