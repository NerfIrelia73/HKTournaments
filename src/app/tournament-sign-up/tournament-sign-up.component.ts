import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { adminInfo } from '../matches/participant';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-tournament-sign-up',
  templateUrl: './tournament-sign-up.component.html',
  styleUrls: ['./tournament-sign-up.component.scss']
})
export class TournamentSignUpComponent implements OnInit {

  constructor(public authService: AuthService, public afs: AngularFirestore) {}

  adminInfo: adminInfo = {
    uid: "",
    displayName: "",
    tournaments: []
  }
  tournaments: {name: string, uid: string, details: string}[] = []

  joinedTournaments: string[] | undefined
  faCheck = faCheck

  async ngOnInit() {
    this.authService.adminInfo.subscribe(info => {
      this.adminInfo = info
      this.joinedTournaments = this.adminInfo.tournaments.map(a => a.tournamentId)
    })
    this.authService.tournaments.subscribe(info => {
      this.tournaments = info
    })
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  addToTournament(tournamentId: string) {
    const participationData = {
      admin: false,
      superadmin: false,
      uid: this.adminInfo?.uid
    }

    this.afs.collection(`tournaments/${tournamentId}/participants`).add(
      participationData
    )
  }

}
