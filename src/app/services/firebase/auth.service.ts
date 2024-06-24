import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  linkWithPhoneNumber,
  User as FirebaseUser,
  ConfirmationResult,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from '@angular/fire/auth';
import { User } from '../../interfaces/user';
import { UsersFbService } from './users-fb.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static user?: FirebaseUser;
  private static confirmationResult?: ConfirmationResult;

  constructor(
    private firebaseAuth: Auth,
    private userService: UsersFbService
  ) {}

  getUser(): FirebaseUser | undefined {
    return AuthService.user;
  }

  async signUp(
    name: string,
    nickname: string,
    email: string,
    phoneNumber: string,
    password: string,
    htmlElement: HTMLElement
  ): Promise<any> {
    if (!name || !nickname || !email || !phoneNumber || !password)
      throw new Error('Missing fields');
    const response = await createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    )
      .then(async (userCredential) => {
        AuthService.user = userCredential.user;
        // linkear el usuario con el telefono, verificando el numero
        await this.linkPhoneGenerateCaptcha(phoneNumber, htmlElement);
        await this.userService.setUser(
          AuthService.user.uid,
          name,
          nickname,
          email,
          phoneNumber
        );
      })
      .catch((error) => {
        console.log('error SignUp', error);
        throw new Error(error.message);
      });
    return response;
  }

  async linkPhoneGenerateCaptcha(
    phoneNumber: string,
    element: HTMLElement
  ): Promise<void> {
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
      this.linkPhoneSendCode(phoneNumber, captchaVerifier);
    } catch (error) {
      console.log('errorGenerateCaptcha', error);
      throw error;
    }
  }

  async linkPhoneSendCode(
    phoneNumber: string,
    captchaVerifier: RecaptchaVerifier
  ) {
    linkWithPhoneNumber(AuthService.user!, phoneNumber, captchaVerifier)
      .then((confirmationResult) => {
        console.log('confirmationResult', confirmationResult);
        AuthService.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log('error Sending Code', error);
        throw new Error('Error sending code' + error.message);
      });
  }

  async linkPhoneVerifyCode(code: string): Promise<boolean> {
    console.log('linkPhoneVerifyCode');
    try {
      await AuthService.confirmationResult!.confirm(code);
      console.log('success');
      this.userService.linkUserPhone(AuthService.user!.uid);
      AuthService.user = undefined;
      AuthService.confirmationResult = undefined;
      return true;
    } catch (error) {
      console.log('error', error);
      // Show error to user
      return false;
    }
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string,
    htmlElement: HTMLElement
  ) {
    return signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then((userCredential) => {
        this.userService
          .isUserPhoneLinked(userCredential.user.uid)
          .then((isLinked) => {
            if (isLinked) {
              console.log('User has phone');
              // Add session persistence
              setPersistence(this.firebaseAuth, browserLocalPersistence)
                .then(() => {
                  console.log('Persistence set');
                })
                .catch((error) => {
                  console.log('error', error);
                });
              return;
            }
          });
      })
      .catch((error) => {
        console.log('error', error);
        throw error;
      });
  }
}
