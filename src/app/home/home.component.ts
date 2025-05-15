import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LazyDialogService } from '../shared/services/lazy-dialog.service';
import { Subscription } from 'rxjs';
import { adminInfo } from '../matches/participant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(public authService: AuthService, public afs: AngularFirestore, public lazyDialog: LazyDialogService) { }

  adminInfo: adminInfo = {
      uid: "",
      displayName: "",
      tournaments: []
    }
    tournaments: {name: string, uid: string, details: string}[] = []
    authSubscription: Subscription | undefined
    adminTournaments: string[] = []
    selectedTournaments: string[] = []

  ngOnInit(): void {
    this.authSubscription = this.authService.adminInfo.subscribe(info => {
      this.adminInfo = info
      this.adminTournaments = info.tournaments.filter((a) => {
        if (a.admin) {
          return true
        } else {
          return false
        }
      }).map((a) => a.tournamentId)
      console.log(this.adminInfo)
      console.log(this.adminTournaments)
    })
    this.authService.tournaments.subscribe(info => {
      this.tournaments = info
      this.selectedTournaments = info.map((a: { uid: any; }) => a.uid)
    })
  }

}
