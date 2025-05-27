import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LazyDialogService } from '../shared/services/lazy-dialog.service';
import { Subscription } from 'rxjs';
import { adminInfo } from '../matches/participant';
import { Tournament } from '../shared/services/tournament';

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
    tournaments: Tournament[] = []
    authSubscription: Subscription | undefined
    adminTournaments: string[] = []
    selectedTournaments: string[] = []

  ngOnInit(): void {
    this.authSubscription = this.authService.adminInfo.subscribe(info => {
      this.adminInfo = info
      this.adminTournaments = this.tournaments.filter(tournament => tournament.admins.includes(this.adminInfo.uid)).map(tournament => tournament.uid);
    })
    this.authService.tournaments.subscribe(info => {
      this.tournaments = info
      this.selectedTournaments = info.map((a: { uid: any; }) => a.uid)
    })
  }

}
