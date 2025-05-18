import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { adminInfo } from 'src/app/matches/participant';
import { Tournament } from './tournament';
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
  userList: User[] = []
  userInfo: User[] = []
  userSub: Subscription | undefined
  tournamentSub: Subscription | undefined
  private userInfoSub = new BehaviorSubject(this.userInfo[0])
  usersInfo = this.userInfoSub.asObservable();
  private adminInfoSub = new BehaviorSubject({uid: "", displayName: "", tournaments: []} as adminInfo)
  adminInfo = this.adminInfoSub.asObservable();
  private tournamentsSub = new BehaviorSubject([] as Tournament[])
  tournaments = this.tournamentsSub.asObservable();
  private authStatusSub = new BehaviorSubject(this.currentUser);
  currentAuthStatus = this.authStatusSub.asObservable();

  ngOnInit(): void {
  }

  makeData(id: string) {
    this.userSub = this.afs.collection('users', ref => ref.where('uid', '==', id)).valueChanges().subscribe(
      val => {
        this.userInfo = val as User[]
        this.userInfoSub.next(this.userInfo[0])
        const adminInfo = {
          displayName: this.userInfo[0].displayName,
          uid: this.userInfo[0].uid,
          tournaments: []
        }
        //console.log(adminInfo)
        this.adminInfoSub.next(adminInfo)
      }
    );
    this.tournamentSub = this.afs.collection('tournaments').snapshotChanges().subscribe(async (resp) => {
      const tournaments = []
      for (const item of resp) {
        tournaments.push({
          ...(item.payload.doc.data() as any),
          uid: item.payload.doc.id
        })
    }

    this.tournamentsSub.next(tournaments)
  });
  }

  authStatusListener(){
    this.afAuth.onAuthStateChanged((credential)=>{
      if(credential){
        this.authStatusSub.next(credential.uid);
        this.makeData(this.authStatusSub.value)
        localStorage.setItem('user', JSON.stringify(credential));
      }
      else{
        this.authStatusSub.next(null);
      }
    })
  }
  // Sign in with email/password
  async SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
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

  // getUserInfo(): Observable<User> {
  //   return (this.usersInfo)
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
      siteAdmin: false,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    userRef.set(userData, {
      merge: true,
    });

    return "User data set successfully"
  }
  // Sign out
  async SignOut() {
    return this.afAuth.signOut().then(() => {
      this.userSub?.unsubscribe()
      this.tournamentSub?.unsubscribe()
      localStorage.removeItem('user');
      setTimeout(() => {
        this.ngZone.run(() => {
          this.router.navigate(['sign-in']);
        });
      }, 200)
    });
  }

  setAdminInfo(info: adminInfo) {
    this.adminInfoSub.next(info)
  }

  setTournaments(info: Tournament[]) {
    this.tournamentsSub.next(info)
  }
}