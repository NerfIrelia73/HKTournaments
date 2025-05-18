import { Component, NgModule, OnInit } from '@angular/core';
import { Participant, User } from '../shared/services/user';
import { UntypedFormControl } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Tournament } from '../shared/services/tournament';


@Component({
  selector: 'app-tournament-settings',
  templateUrl: './tournament-settings.component.html',
  styleUrls: ['./tournament-settings.component.scss']
})
export class TournamentSettingsComponent implements OnInit {

  constructor(public authService: AuthService, public afs: AngularFirestore, public router: Router) {
  }

  tournaments: Tournament[] = []
  tournamentIndex = -1
  selectedTournament = new UntypedFormControl('')
  participantList: Participant[] = []
  loading = false
  seedingEnabled = false;

  ngOnInit(): void {
    this.afs.collection('tournaments').get().forEach(async (resp) => {
      this.tournaments = []
      for (const item of resp.docs) {
        this.tournaments.push({
          ...(item.data() as any),
          uid: item.id
        })
      }
    });

    this.selectedTournament.valueChanges.subscribe(val => {
      this.tournamentIndex = this.tournaments.findIndex(tournament => tournament.uid == val)
    })
  }

  toggleSeeding(enabled: boolean): void {
    if (this.tournamentIndex >= 0) {
      this.tournaments[this.tournamentIndex].seedingEnabled = enabled;
      this.afs.doc(`tournaments/${this.tournaments[this.tournamentIndex].uid}`).update({
        seedingEnabled: enabled
      });
    }
  }

  saveSettings(): void {
    if (this.tournamentIndex >= 0) {
      this.afs.doc(`tournaments/${this.tournaments[this.tournamentIndex].uid}`).update({
        participants: this.participantList
      });
    }
    //console.log('Tournament settings saved for', this.tournaments[this.tournamentIndex]);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (!this.seedingEnabled) return;
    this.participantList = this.tournaments[this.tournamentIndex].participants;
    moveItemInArray(this.participantList, event.previousIndex, event.currentIndex);

    // Update seed values after reorder
    this.participantList.forEach((participant, index) => {
      participant.seed = index + 1;
    });
  }
}
