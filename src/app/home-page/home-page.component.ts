import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/services/user';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(public authService: AuthService, public afs: AngularFirestore) {}

  userInfo: User[] = []
  isAuthenticated = false

  ngOnInit(): void {
    this.authService.currentAuthStatus.subscribe(authStatus => {
      console.log(authStatus)
      this.isAuthenticated = authStatus
      this.afs.collection('users', ref => ref.where('uid', '==', this.isAuthenticated)).valueChanges().subscribe(
        val => this.userInfo = val as User[]
      );
    })
    console.log(this.authService.currentAuthStatus)
  }

}
