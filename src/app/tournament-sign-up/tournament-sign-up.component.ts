import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { adminInfo } from '../home-page/participant';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-tournament-sign-up',
  templateUrl: './tournament-sign-up.component.html',
  styleUrls: ['./tournament-sign-up.component.scss']
})
export class TournamentSignUpComponent implements OnInit {

  constructor(public afs: AngularFirestore) { }

  @Input() adminInfo: adminInfo = null
  @Input() tournaments: {name: string, uid: string}[] = null

  joinedTournaments: string[]
  faCheck = faCheck

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.adminInfo != null && changes.adminInfo.currentValue != null) {
      this.joinedTournaments = changes.adminInfo.currentValue.tournaments.map(a => a.tournamentId)
    }
  }

  addToTournament(tournamentId: string) {
    const participationData = {
      admin: false,
      superadmin: false,
      uid: this.adminInfo.uid
    }

    this.afs.collection(`tournaments/${tournamentId}/participants`).add(
      participationData
    )
  }

}
