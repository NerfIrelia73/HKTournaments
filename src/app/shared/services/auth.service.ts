import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
  ) {
    this.authStatusListener();
  }

  currentUser: any = null
  private authStatusSub = new BehaviorSubject(this.currentUser);
  currentAuthStatus = this.authStatusSub.asObservable();


  authStatusListener(){
    this.afAuth.onAuthStateChanged((credential)=>{
      if(credential){
        console.log(credential.email);
        this.authStatusSub.next(credential.uid);
        console.log('User is logged in');
        localStorage.setItem('user', JSON.stringify(credential));
      }
      else{
        this.authStatusSub.next(null);
        console.log('User is logged out');
      }
    })
  }
  // Sign in with email/password
  async SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
          console.log("We signed in")
          this.ngZone.run(() => {
            this.router.navigate(['/']);
          });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Sign up with email/password
  async SignUp(email: string, password: string, displayName: string, discordId: string, twitch: string, pronouns: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user, displayName, discordId, twitch, pronouns);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Send email verfificaiton when new user sign up
  async SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }
  // Reset Forggot password
  async ForgotPassword(passwordResetEmail: string) {
    console.log(passwordResetEmail)
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  // getUserInfo(): Observable<User[]> {
  //   console.log("Hello there")
  //   return of(this.userInfo)
  // }

  // Auth logic to run auth providers
  async AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['']);
        });
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  async SetUserData(user: any, displayName: string, discordId: string, twitch: string, pronouns: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      discordId: discordId,
      twitch: twitch,
      pronouns: pronouns,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    userRef.set(userData, {
      merge: true,
    });

    const participationData = {
      admin: false,
      superadmin: false,
      uid: user.uid
    }

    this.afs.collection("tournaments/2cFP7NykXFZhEG06HpAL/participants").add(
      participationData
    )

    return "User data set successfully"
  }
  // Sign out
  async SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      setTimeout(() => {
        this.ngZone.run(() => {
          this.router.navigate(['sign-in']);
        });
      }, 200)
    });
  }
}