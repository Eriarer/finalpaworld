import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  linkWithPhoneNumber,
  User as FirebaseUser,
  ConfirmationResult,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  updateProfile,
  getIdToken,
} from '@angular/fire/auth';
import { User } from '../../interfaces/user';
import { UsersFbService } from './users-fb.service';
import { Observable, of, switchMap } from 'rxjs';
import { UserState } from '../../interfaces/userState';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private confirmationResult?: ConfirmationResult;
  private email: string;
  private password: string;
  constructor(
    private firebaseAuth: Auth,
    private userService: UsersFbService
  ) {}

  getCurrentUserState(): Observable<UserState> {
    return new Observable<FirebaseUser | null>((subscriber) => {
      const unsubscribe = this.firebaseAuth.onAuthStateChanged(subscriber);
      return { unsubscribe };
    }).pipe(
      switchMap((user) => {
        if (user) {
          return this.userService.isUserAdmin(user.uid).then((isAdmin) => ({
            user,
            isAdmin,
          }));
        } else {
          return of({ user: null, isAdmin: false });
        }
      })
    );
  }

  async signUp(
    name: string,
    nickname: string,
    email: string,
    phoneNumber: string,
    password: string,
    htmlElement: HTMLElement
  ): Promise<any> {
    this.email = email;
    this.password = password;
    if (!name || !nickname || !email || !phoneNumber || !password)
      throw new Error('Missing fields');
    if (await this.userService.isPhoneAlreadyRegistered(phoneNumber))
      throw new Error('El número de teléfono ya se encuentra registrado');
    const response = await createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    )
      .then(async (userCredential) => {
        await updateProfile(userCredential.user, {
          displayName: nickname,
        });
        let user = userCredential.user;
        // linkear el usuario con el telefono, verificando el numero
        await this.linkPhoneGenerateCaptcha(phoneNumber, htmlElement);
        await this.userService.setUser(
          user.uid,
          name,
          nickname,
          email,
          phoneNumber
        );
        this.signOut();
        signInWithEmailAndPassword(this.firebaseAuth, email, password);
      })
      .catch((error) => {
        console.error('error SignUp', error);
        this.email = '';
        this.password = '';
        throw new Error(error.message);
      });
    return response;
  }

  async linkPhoneGenerateCaptcha(
    phoneNumber: string,
    element: HTMLElement
  ): Promise<void> {
    try {
      const captchaVerifier = new RecaptchaVerifier(
        this.firebaseAuth,
        element,
        {
          size: 'invisible',
          callback: (response: any) => {},
        }
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await this.linkPhoneSendCode(phoneNumber, captchaVerifier);
    } catch (error: any) {
      console.error('errorGenerateCaptcha', error);
      this.email = '';
      this.password = '';
      throw new Error('Error al generar el captcha');
    }
  }

  async linkPhoneSendCode(
    phoneNumber: string,
    captchaVerifier: RecaptchaVerifier
  ) {
    let user = this.firebaseAuth.currentUser;
    if (!user) throw new Error('User not found');
    try {
      this.confirmationResult = await linkWithPhoneNumber(
        user,
        phoneNumber,
        captchaVerifier
      );
      // Aumenta el tiempo de espera
      setTimeout(() => {
        this.confirmationResult = undefined;
      }, 300000); // 5 minutos
    } catch (error: any) {
      console.error('error Sending Code', error);
      this.email = '';
      this.password = '';
      throw new Error('Error al enviar el código');
    }
  }

  async linkPhoneVerifyCode(code: string): Promise<any> {
    if (!this.confirmationResult) {
      throw new Error('No hay un código de verificación pendiente');
    }
    try {
      await this.confirmationResult.confirm(code);
      this.confirmationResult = undefined;
      this.userService.setPhoneLinkedByUid(this.firebaseAuth.currentUser!.uid);
      await this.signOut();
      await signInWithEmailAndPassword(
        this.firebaseAuth,
        this.email,
        this.password
      );
      this.email = '';
      this.password = '';
    } catch (error: any) {
      this.confirmationResult = undefined;
      this.email = '';
      this.password = '';
      throw new Error('Error al verificar el código');
      console.error('error', error);
    }
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string,
    htmlElement: HTMLElement
  ): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      );

      // Espera a que el usuario esté completamente autenticado
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (userCredential.user.phoneNumber === null) {
        console.log('phone number not linked');
        let phone = await this.userService.getPhoneByEmail(email);
        console.log('phone', phone);
        await this.linkPhoneGenerateCaptcha(phone, htmlElement);
        return { captchaNeeded: true };
      }
      return;
    } catch (error: any) {
      console.log('error', error);
      throw new Error('Error al iniciar sesión');
    }
  }

  async singInWithPhoneNumberByEmail(email: string, htmlElement: HTMLElement) {
    if (!email || !htmlElement) throw new Error('Campos faltantes');
    let phoneNumber = await this.userService.getPhoneByEmail(email);
    console.log('phoneNumber', phoneNumber);
    if (!phoneNumber) throw new Error('Numero no encontrado');
    let phoneVerified = await this.userService.isPhoneLinked(phoneNumber);
    console.log('phoneVerified', phoneVerified);
    if (!phoneVerified) throw new Error('Número de telefono no verificado');
    let captchaVerifier = new RecaptchaVerifier(
      this.firebaseAuth,
      htmlElement,
      {
        size: 'invisible',
        callback: (response: any) => {
          console.log('captcha resolved');
        },
      }
    );
    await setTimeout(() => {}, 3000);
    await this.signInWithPhoneNumberSendCode(phoneNumber, captchaVerifier);
  }

  async signInWithPhoneNumberSendCode(
    phoneNumber: string,
    captchaVerifier: RecaptchaVerifier
  ) {
    signInWithPhoneNumber(this.firebaseAuth, phoneNumber, captchaVerifier).then(
      (confirmationResult) => {
        this.confirmationResult = confirmationResult;
      }
    );
  }

  async signInWithPhoneNumberVerifyCode(code: string): Promise<any> {
    try {
      await this.confirmationResult!.confirm(code).then((result) => {
        console.log('result', result);
        return result;
      });
    } catch (error: any) {
      console.log('error', error);
      throw new Error('Error al verificar el código');
    }
  }

  async signOut() {
    return this.firebaseAuth.signOut();
  }
}
