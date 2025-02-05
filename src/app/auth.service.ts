import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  async login(emailOrUsername: string, password: string) {
    if (!emailOrUsername.includes('@')) {
      const userRef = this.firestore.collection('users', ref => ref.where('username', '==', emailOrUsername));
      const userDocs = await firstValueFrom(userRef.get());

      if (!userDocs.empty) {
        const userData = userDocs.docs[0].data() as { email?: string };

        if (userData?.email) {
          emailOrUsername = userData.email;
        } else {
          throw new Error('Email not found for this username');
        }
      } else {
        throw new Error('Username not found');
      }
    }
    return this.afAuth.signInWithEmailAndPassword(emailOrUsername, password);
  }

  logout() {
    return this.afAuth.signOut();
  }
}
