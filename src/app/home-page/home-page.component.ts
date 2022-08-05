import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/services/user';
import { adminInfo } from './participant';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(public authService: AuthService, public afs: AngularFirestore) {}

  userInfo: User[] = []
  isAuthenticated = false
  adminInfo: adminInfo = null

  ngOnInit(): void {
    this.authService.currentAuthStatus.subscribe(authStatus => {
      console.log(authStatus)
      this.isAuthenticated = authStatus
      this.afs.collection('users', ref => ref.where('uid', '==', this.isAuthenticated)).valueChanges().subscribe(
        val => {
          this.userInfo = val as User[]
          console.log(JSON.stringify(this.userInfo))
          this.afs.collection('tournaments/2cFP7NykXFZhEG06HpAL/participants', ref => ref.where('uid', '==', this.userInfo[0].uid)).valueChanges().subscribe(
            info => {
              this.adminInfo = info[0] as adminInfo
              console.log(this.adminInfo)
            }
          );
        }
      );
    })
    console.log(this.authService.currentAuthStatus)
  }

}
