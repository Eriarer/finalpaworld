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
  private user?: FirebaseUser;
  private confirmationResult?: ConfirmationResult;

  constructor(
    private firebaseAuth: Auth,
    private userService: UsersFbService
  ) {}

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
      .then((userCredential) => {
        this.user = userCredential.user;
        // linkear el usuario con el telefono, verificando el numero
        this.linkPhoneGenerateCaptcha(phoneNumber, htmlElement);
        this.userService.addUserWithUID(
          this.user.uid,
          name,
          nickname,
          email,
          phoneNumber
        );
      })
      .catch((error) => {
        this.SignUpError();
        throw new Error(error.message);
      });
    return response;
  }

  private async linkPhoneGenerateCaptcha(
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
      console.log('error', error);
      this.SignUpError();
      throw new Error('Error generating captcha');
    }
  }

  private async linkPhoneSendCode(
    phoneNumber: string,
    captchaVerifier: RecaptchaVerifier
  ) {
    linkWithPhoneNumber(this.user!, phoneNumber, captchaVerifier)
      .then((confirmationResult) => {
        console.log('confirmationResult', confirmationResult);
        this.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  async linkPhoneVerifyCode(code: string): Promise<boolean> {
    console.log('linkPhoneVerifyCode');
    try {
      await this.confirmationResult!.confirm(code);
      console.log('success');
      return true;
    } catch (error) {
      console.log('error', error);
      this.SignUpError();
      // Show error to user
      return false;
    }
  }

  private async SignUpError(): Promise<void> {
    // User couldn't sign in (bad verification code?) delete user
    if (!this.user) return;
    await this.user!.delete();
    await this.userService.deleteUserWithUID(this.user!.uid);
    this.user = undefined;
    this.confirmationResult = undefined;
    return;
  }
}
