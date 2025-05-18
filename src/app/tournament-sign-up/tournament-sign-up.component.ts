import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { adminInfo } from '../matches/participant';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion } from '@angular/fire/firestore';
import { AuthService } from '../shared/services/auth.service';
import { Tournament } from '../shared/services/tournament';

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
  tournaments: Tournament[] = []

  faCheck = faCheck

  async ngOnInit() {
    this.authService.adminInfo.subscribe(info => {
      this.adminInfo = info
    })
    this.authService.tournaments.subscribe(info => {
      this.tournaments = info
    })
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  addToTournament(tournament: any) {
    //console.log(tournament)
    //console.log(this.adminInfo)

    this.afs.doc(`tournaments/${tournament.uid}`).update({
      participants: arrayUnion({
        displayName: this.adminInfo.displayName,
        uid: this.adminInfo.uid,
        seed: 0
      })
    })
  }

  passedDeadline(deadline: Date): boolean {
    if (!deadline) return false;
    const d = new Date();
    return d > deadline;
  }

  isParticipant(tournament: Tournament, uid: string) {
    return tournament.participants.some((x: any) => x.uid == uid);
  }

}
