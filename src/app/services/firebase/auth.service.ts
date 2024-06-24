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
  signInWithPhoneNumber,
  updateProfile,
} from '@angular/fire/auth';
import { User } from '../../interfaces/user';
import { UsersFbService } from './users-fb.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user?: FirebaseUser;
  private confirmationResult?: ConfirmationResult;

  constructor(
    private firebaseAuth: Auth,
    private userService: UsersFbService
  ) {}

  getCurrentUser(): Observable<FirebaseUser | null> {
    return new Observable((subscriber) => {
      const unsubscribe = this.firebaseAuth.onAuthStateChanged(subscriber);
      return { unsubscribe };
    });
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
    if (await this.userService.isPhoneAlreadyRegistered(phoneNumber))
      throw new Error('El número de teléfono ya se encuentra registrado');
    const response = await createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    )
      .then(async (userCredential) => {
        this.user = userCredential.user;
        // linkear el usuario con el telefono, verificando el numero
        await this.linkPhoneGenerateCaptcha(phoneNumber, htmlElement);
        await this.userService.setUser(
          this.user.uid,
          name,
          nickname,
          email,
          phoneNumber
        );
        await updateProfile(this.user, {
          displayName: nickname,
        });
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
      await setTimeout(() => {}, 3000);
      await this.linkPhoneSendCode(phoneNumber, captchaVerifier);
    } catch (error) {
      console.log('errorGenerateCaptcha', error);
      throw error;
    }
  }

  async linkPhoneSendCode(
    phoneNumber: string,
    captchaVerifier: RecaptchaVerifier
  ) {
    linkWithPhoneNumber(this.user!, phoneNumber, captchaVerifier)
      .then((confirmationResult) => {
        console.log('confirmationResult', confirmationResult);
        this.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log('error Sending Code', error);
        throw new Error('Error sending code' + error.message);
      });
  }

  async linkPhoneVerifyCode(code: string): Promise<boolean> {
    console.log('linkPhoneVerifyCode');
    try {
      await this.confirmationResult!.confirm(code);
      console.log('success');
      this.userService.linkUserPhone(this.user!.uid);
      this.user = undefined;
      this.confirmationResult = undefined;
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
          .then(async (isLinked) => {
            console.log('userCredential', userCredential);
            if (userCredential.user.phoneNumber != null) {
              console.log('userCredential', userCredential.user.phoneNumber);
            }
          });
      })
      .catch((error) => {
        console.log('error', error);
        throw error;
      });
  }

  async singInWithPhoneNumberByEmail(email: string, htmlElement: HTMLElement) {
    if (!email || !htmlElement) throw new Error('Missing fields');
    let phoneNumber = await this.userService.getPhoneByEmail(email);
    if (!phoneNumber) throw new Error('Phone number not found');
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
    } catch (error) {
      console.log('error', error);
    }
  }

  async signOut() {
    return this.firebaseAuth.signOut();
  }
}
