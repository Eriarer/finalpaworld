import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  linkWithPhoneNumber,
  User as FirebaseUser,
  ConfirmationResult,
} from '@angular/fire/auth';
import { User } from '../../interfaces/user';
import { UsersFbService } from './users-fb.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private confirmationResult!: ConfirmationResult;

  constructor(
    private firebaseAuth: Auth,
    private userService: UsersFbService
  ) {}

  signUp(
    name: string,
    nickname: string,
    email: string,
    phoneNumber: string,
    password: string,
    htmlElement: HTMLElement
  ) {
    if (!name || !nickname || !email || !phoneNumber || !password) return;
    const response = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((userCredential) => {
      const user = userCredential.user;
      // linkear el usuario con el telefono, verificando el numero
      this.linkPhoneGenerateCaptcha(user, phoneNumber, htmlElement);
      this.userService.addUserWithUID(
        user.uid,
        name,
        nickname,
        email,
        phoneNumber
      );
    });
  }

  async linkPhoneGenerateCaptcha(
    user: FirebaseUser,
    phoneNumber: string,
    element: HTMLElement
  ) {
    console.log('linkPhoneNumber');
    try {
      const captchaVerifier = new RecaptchaVerifier(
        this.firebaseAuth,
        element,
        {
          size: 'invisible',
          callback: (response: any) => {
            console.log('captcha resolved');
          },
        }
      );
      setTimeout(() => {}, 3000);
      linkWithPhoneNumber(user, phoneNumber, captchaVerifier)
        .then((confirmationResult) => {
          console.log('confirmationResult', confirmationResult);
          this.confirmationResult = confirmationResult;
        })
        .catch((error) => {
          console.log('error', error);
        });
    } catch (error) {
      console.log('error', error);
    }
  }

  async linkPhoneVerifyCode(code: string) {
    console.log('linkPhoneVerifyCode');
    try {
      await this.confirmationResult.confirm(code);
    } catch (error) {
      console.log('error', error);
    }
  }
}
