import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
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
  tournamentSub: Subscription = null
  tournaments: {name: string, uid: string}[] = null
  page = "schedule"

  ngOnInit(): void {
    this.authService.currentAuthStatus.subscribe(authStatus => {
      this.isAuthenticated = authStatus

      this.afs.collection('users', ref => ref.where('uid', '==', this.isAuthenticated)).valueChanges().subscribe(
        val => {
          this.userInfo = val as User[]
          try {
            this.afs.collectionGroup('participants', ref => ref.where('uid', '==', this.userInfo[0].uid)).snapshotChanges().subscribe(
              info => {
                let tournaments = []
                for (const item of info) {
                  tournaments.push({
                    admin: (item.payload.doc.data() as any).admin,
                    superadmin: (item.payload.doc.data() as any).superadmin,
                    tournamentId: item.payload.doc.ref.parent.parent.id
                  })
                }
                this.adminInfo = {
                  displayName: this.userInfo[0].displayName,
                  uid: this.userInfo[0].uid,
                  tournaments: tournaments
                }
              }
            );
          } catch(e) {
            //console.log(e);
          }
        }
      );
    })

    this.tournamentSub = this.afs.collection('tournaments').snapshotChanges().subscribe(async (resp) => {
      this.tournaments = []
      for (const item of resp) {
        this.tournaments.push({
          name: (item.payload.doc.data() as any).name,
          uid: item.payload.doc.id
        })
      }
    });
  }

  changePage(page: string) {
    this.page = page
  }

}
