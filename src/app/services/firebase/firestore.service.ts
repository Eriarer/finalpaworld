import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  //TODO: tests querys
  public writeUser(
    uid: string,
    username: string,
    nickname: string,
    email: string,
    phoneNumber: string
  ) {
    const ref = doc(this.firestore, `users/${uid}`);
    return setDoc(ref, {
      username: username,
      nickname: nickname,
      email: email,
      phoneNumber: phoneNumber,
    });
  }

  //TODO: tests querys
  public writeMeeting(uid: string, petUid: string, date: string, time: string) {
    const ref = doc(this.firestore, 'meetings');
    return setDoc(ref, {
      uid: uid,
      petId: petUid,
      date: date,
      time: time,
    });
  }

  //TODO: get all meetings by UID
  //TODO: get all meetings
  //TODO: get meetings by filters **IDEAS** username, breed, species, date
  //TODO: canel meeting?

  //TODO: tests querys
  getPetUidByPetName(petName: string): Observable<string> {
    const q = query(
      collection(this.firestore, 'pets'),
      where('name', '==', petName)
    );
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        if (querySnapshot.empty) {
          return '';
        }
        console.log(querySnapshot.docs[0]);
        return querySnapshot.docs[0].id;
      })
    );
  }

  //TODO: tests querys
  getPetsByKeyword(keyword: string): Observable<any> {
    const q = query(
      collection(this.firestore, 'pets'),
      where('name', '>=', keyword),
      where('name', '<=', keyword + '\uf8ff'),
      where('breed', '>=', keyword),
      where('breed', '<=', keyword + '\uf8ff'),
      where('color', '>=', keyword),
      where('color', '<=', keyword + '\uf8ff'),
      where('age', '>=', keyword),
      where('age', '<=', keyword + '\uf8ff'),
      where('size', '>=', keyword),
      where('size', '<=', keyword + '\uf8ff'),
      where('species', '>=', keyword),
      where('species', '<=', keyword + '\uf8ff')
    );
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        if (querySnapshot.empty) {
          return '';
        }
        return querySnapshot.docs;
      })
    );
  }

  //TODO: tests querys
  //TODO: see if the query returns a document or an array of pets objetct
  getPets(): Observable<any> {
    const q = query(collection(this.firestore, 'pets'));
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        if (querySnapshot.empty) {
          return '';
        }
        return querySnapshot.docs;
      })
    );
  }
}
