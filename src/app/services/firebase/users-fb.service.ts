import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  docSnapshots,
} from '@angular/fire/firestore';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UsersFbService {
  constructor(private firestore: Firestore) {}

  async isUserAdmin(uid: string): Promise<boolean> {
    const ref = doc(this.firestore, `users/${uid}`);
    const docSnapshot = await getDoc(ref);
    if (docSnapshot.exists() && docSnapshot.data()['admin']) {
      return true;
    } else {
      return false;
    }
  }

  async isUserPhoneLinked(uid: string): Promise<boolean> {
    const ref = doc(this.firestore, `users/${uid}`);
    const docSnapshot = await getDoc(ref);
    console.log('docSnapshot', docSnapshot.data());
    if (docSnapshot.exists() && docSnapshot.data()['phoneNumber']) {
      return true;
    } else {
      return false;
    }
  }

  setUser(
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
      phoneLinked: false,
    });
  }

  linkUserPhone(uid: string) {
    const ref = doc(this.firestore, `users/${uid}`);
    return setDoc(ref, { phoneLinked: true }, { merge: true });
  }
}
