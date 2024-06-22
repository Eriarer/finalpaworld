import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firebaseAuth: Auth) {}

  signUp(
    name: string,
    nickname: string,
    email: string,
    phoneNumber: string,
    password: string
  ) {}
}
