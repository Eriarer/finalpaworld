import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { AuthService } from '../../../services/firebase/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
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
    NgxMatIntlTelInputComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  nameError: string = '';
  nickNameError: string = '';
  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';

  nameErrorMessages: any = {
    required: 'No se puede dejar vacio',
    minlength: 'El nombre debe tener al menos 3 caracteres',
    maxlength: 'El nombre debe tener máximo 40 caracteres',
    pattern: 'El nombre solo puede contener letras',
  };
  nickNameErrorMessages: any = {
    required: 'No se puede dejar vacio',
    minlength: 'El apodo debe tener al menos 3 caracteres',
    maxlength: 'El apodo debe tener máximo 8 caracteres',
    pattern: 'El apodo solo puede contener letras',
  };
  emailErrorMessages: any = {
    required: 'No se puede dejar vacio',
    email: 'El email no es valido',
  };
  phoneNumberErrorMessages: any = {
    required: 'No se puede dejar vacio',
    validatePhoneNumber: 'El número de teléfono no es valido',
  };
  passwordErrorMessages: any = {
    required: 'No se puede dejar vacio',
    minlength: 'La contraseña debe tener al menos 6 caracteres',
    passwordCap: 'Debe contener al menos una letra mayúscula',
    passwordLow: 'Debe contener al menos una letra minúscula',
    passwordNumber: 'Debe contener al menos un número',
    passwordSymbol: 'Debe contener al menos un caracter especial',
  };

  name = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern('^[a-zA-Z ]*$'),
    ],
  });
  nickname = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(8),
      Validators.pattern('^[a-zA-Z]*$'),
    ],
  });
  email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  phoneNumber = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  password = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(6),
      this.passwordStrengthValidator,
    ],
  });
  confirmPassword = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(6),
      this.passwordStrengthValidator,
    ],
  });

  registerForm = new FormGroup(
    {
      name: this.name,
      nickname: this.nickname,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      confirmPassword: this.confirmPassword,
    },
    { validators: this.passwordMatchValidator }
  );

  codeErrorMessages: any = {
    required: 'No se puede dejar vacio',
    minlength: 'El código debe tener al menos 6 caracteres',
  };

  code = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  codeVerificationForm = new FormGroup({
    code: this.code,
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestory() {}

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password: string = control.value;
    if (!password) return null;

    const errors: ValidationErrors = {};

    const hasNumber = /[0-9]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    if (!hasUpper) {
      errors['passwordCap'] = true;
    }
    if (!hasLower) {
      errors['passwordLow'] = true;
    }
    if (!hasNumber) {
      errors['passwordNumber'] = true;
    }
    if (!hasSpecial) {
      errors['passwordSymbol'] = true;
    }

    return Object.keys(errors).length !== 0 ? errors : null;
  }

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  errors(control: FormControl, htmlMatFormField: HTMLElement): string[] {
    const errors = control.errors ? Object.keys(control.errors) : [];
    // si el unico error es el required, ignorarlo
    switch (errors.length) {
      case 1:
        if (errors.includes('required')) {
          htmlMatFormField.style.marginBottom = '0px';
          control.markAsUntouched();
          return errors;
        }
        break;
      case 0:
        htmlMatFormField.style.marginBottom = '0px';
        control.markAsUntouched();
        return errors;
      default:
        break;
    }

    htmlMatFormField.style.marginBottom = errors.length * 18 + 20 + 'px';
    control.markAsTouched();
    return errors;
  }

  async onSubmitRegister() {
    const button: HTMLElement = document.getElementById(
      'submitBtn'
    ) as HTMLElement;
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      await this.authService
        .signUp(
          this.name.value,
          this.nickname.value,
          this.email.value,
          this.phoneNumber.value,
          this.password.value,
          button
        )
        .then((response) => {
          console.log('responseOnSubmit', response);
          document.getElementById('registerForm')!.style.display = 'none';
          document.getElementById('codeVerificationForm')!.style.display =
            'flex';
        });
    }
    if (this.registerForm.invalid) {
      console.log('Form is invalid');
    }
  }

  async onSubmitCodeVerification() {
    if (this.codeVerificationForm.valid) {
      console.log(this.codeVerificationForm.value);
      await this.authService
        .linkPhoneVerifyCode(this.code.value)
        .then((result) => {
          console.log('result', result);
          if (result) {
            this.router.navigate(['/inicio']);
          } else {
            this.router.navigate(['/register']);
          }
        });
    }
    if (this.codeVerificationForm.invalid) {
      console.log('Form is invalid');
    }
  }
}
