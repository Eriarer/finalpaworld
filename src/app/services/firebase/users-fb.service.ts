import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UsersFbService {
  constructor(private firestore: Firestore) {}

  addUserWithUID(
    uid: string,
    name: string,
    nickname: string,
    email: string,
    phoneNumber: string
  ) {
    const ref = doc(this.firestore, `users/${uid}`);
    return setDoc(ref, {
      name: name,
      nickname: nickname,
      email: email,
      phoneNumber: phoneNumber,
    });
  }
}
