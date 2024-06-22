import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-email-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './email-login.component.html',
  styleUrl: './email-login.component.css',
})
export class EmailLoginComponent {
  loginForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    },
    Validators.nullValidator
  );
}
