import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  name = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ],
  });
  nickname = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  phoneExtension = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern('^[0-9]*$')],
  });
  phoneNumber = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern('^[0-9]*$')],
  });
  password = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(6),
      this.passwordStrengthValidator,
      this.passwordMatchValidator,
    ],
  });
  confirmPassword = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      this.passwordStrengthValidator,
      this.passwordMatchValidator,
    ],
  });

  registerForm = new FormGroup({
    name: this.name,
    nickname: this.nickname,
    email: this.email,
    phoneExtension: this.phoneExtension,
    phoneNumber: this.phoneNumber,
    password: this.password,
    confirmPassword: this.confirmPassword,
  });

  passwordStrengthValidator(control: AbstractControl) {
    const password: string = control.value;
    if (!password) return null;

    const hasNumber = /[0-9]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    const valid = hasNumber && hasUpper && hasLower && hasSpecial;

    return valid ? null : { passwordStrength: true };
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null;

    return password === confirmPassword ? null : { passwordMatch: true };
  }

  onSubmitRegister() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }
    if (this.registerForm.invalid) {
      console.log('Form is invalid');
    }
  }

  showErrors() {
    console.log(this.registerForm.get('password')!.errors);
  }
}
