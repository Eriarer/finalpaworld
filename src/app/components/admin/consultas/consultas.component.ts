import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerIntl,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CitasFbService } from '../../../services/firebase/citas-fb.service';
import { CommonModule } from '@angular/common';
import { TimestampToDateStringPipe } from '../../../pipes/timestamp-to-date-string.pipe';
import { TimestampToHourStringPipe } from '../../../pipes/timestamp-to-hour-string.pipe';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MascotasService } from '../../../services/data/mascotas.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import 'moment/locale/fr';
import Swal from 'sweetalert2';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from '../../loader/loader.component';
import { Timestamp } from '@angular/fire/firestore';

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
  selector: 'app-consultas',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'fr' },
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: FR_DATE_FORMATS },
  ],
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerModule,
    MatIcon,
    MatButton,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatError,
    FormsModule,
    CommonModule,
    TimestampToDateStringPipe,
    TimestampToHourStringPipe,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    RouterOutlet,
    LoaderComponent,
  ],
  templateUrl: './consultas.component.html',
  styleUrl: './consultas.component.css',
})
export class ConsultasComponent {
  isLoading = false;
  today!: Timestamp;
  //datos para el calendario
  minDate!: Date;
  maxDate!: Date;

  //Para formatear la fecha (DD/MM/YYYY)
  private _adapter!: DateAdapter<any>;
  private _intl!: MatDatepickerIntl;
  @Inject(MAT_DATE_LOCALE) private _locale!: string;

  gatoBoxControl = new FormControl('', { nonNullable: true });
  perroBoxControl = new FormControl('', { nonNullable: true });
  citas: any[] = [];

  nameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],
  });

  fechaControl = new FormControl('', {
    nonNullable: true,
  });

  multiQueryForm = new FormGroup({
    gatoBoxControl: this.gatoBoxControl,
    perroBoxControl: this.perroBoxControl,
    nameControl: this.nameControl,
    fechaControl: this.fechaControl,
  });

  constructor(private citasService: CitasFbService) {
    this.initializeDateRange();
  }

  ngOnInit(): void {
    this.loadAllCitas();
  }

  private initializeDateRange(): void {
    const fechaActual = new Date();
    this.minDate = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() - 2,
      fechaActual.getDate()
    );
    this.maxDate = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() + 2,
      fechaActual.getDate()
    );
  }

  private getTodayTimestamp() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.today = Timestamp.fromDate(today);
  }

  private async loadAllCitas(
    citasPromise: Promise<any> = this.citasService.getAllCitas()
  ): Promise<void> {
    this.isLoading = true;
    this.getTodayTimestamp();
    try {
      this.isLoading = false;
      this.citas = await citasPromise;
    } catch (error) {
      this.isLoading = false;
      console.error('Error al obtener las citas', error);
      Swal.fire('Error', 'Error al obtener las citas', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  onSubmitQuery(): void {
    if (this.multiQueryForm.invalid) return;
    const queryParams = this.getQueryParams();
    this.loadAllCitas(this.citasService.getMultiQueryCitas(...queryParams));
  }

  private getQueryParams(): [string, Date | null, boolean, boolean] {
    const perroVal = Boolean(this.perroBoxControl.value);
    const gatoVal = Boolean(this.gatoBoxControl.value);
    let fecha: Date | null = null;

    if (this.fechaControl.value) {
      fecha = new Date(this.fechaControl.value);
      fecha.setHours(0, 0, 0, 0);
    }

    return [this.nameControl.value, fecha, perroVal, gatoVal];
  }

  resetForm(): void {
    if (this.multiQueryForm.pristine) return;
    this.multiQueryForm.reset();
    this.multiQueryForm.markAsPristine();
    this.loadAllCitas();
  }

  deleteCita(citaId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.citasService.deleteCita(citaId);
          await Swal.fire('Borrado', 'Cita eliminada', 'success');
          this.loadAllCitas();
        } catch (error) {
          console.error('Error al borrar la cita', error);
          await Swal.fire('Error', 'Error al borrar la cita', 'error');
        }
      }
    });
  }
}
