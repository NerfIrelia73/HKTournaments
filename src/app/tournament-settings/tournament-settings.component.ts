import { Component, NgModule, OnInit } from '@angular/core';
import { Participant, User } from '../shared/services/user';
import { UntypedFormControl } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-tournament-settings',
  templateUrl: './tournament-settings.component.html',
  styleUrls: ['./tournament-settings.component.scss']
})
export class TournamentSettingsComponent implements OnInit {

  constructor(public authService: AuthService, public afs: AngularFirestore, public router: Router) {
  }

  tournaments: {name: string, uid: string, participants: User[], seedingEnabled: boolean, seeds: User[]}[] = []
  tournamentIndex = -1
  selectedTournament = new UntypedFormControl('')
  participantList: User[] = []
  loading = false
  seedingEnabled = false;

  ngOnInit(): void {
    this.afs.collection('tournaments').get().forEach(async (resp) => {
      this.tournaments = []
      for (const item of resp.docs) {
        this.tournaments.push({
          name: (item.data() as any).name,
          uid: item.id,
          participants: [],
          seedingEnabled: (item.data() as any).seedingEnabled ? (item.data() as any).seedingEnabled : false,
          seeds: (item.data() as any).seeds ? (item.data() as any).seeds : []
        })
      }
    });

    this.afs.collection('users', ref => ref.orderBy('displayName')).get().forEach(
      (val) => {
        this.participantList = []
        for (const item of val.docs) {
          this.participantList.push(item.data() as User)
        }
        this.afs.collectionGroup('participants').get().forEach(
          (resp) => {
            for (const item of resp.docs) {
              const user = this.participantList.filter(user => {
                return user.uid == (item.data() as any).uid
              })
              const index = this.tournaments.findIndex(tournament => tournament.uid == item.ref.parent.parent?.id)
              if (!this.tournaments[index].participants.includes(user[0]))
              this.tournaments[index].participants.push(user[0])
            }
            for (const tournament of this.tournaments) {
              tournament.participants = tournament.participants.sort((a, b) => {
                return a.displayName.localeCompare(b.displayName)
              })
              if (tournament.seeds.length == 0) {
                tournament.seeds = JSON.parse(JSON.stringify(tournament.participants))
              }
            }
            console.log(this.tournaments)
          }
        );
      }
    );

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
        seeds: this.tournaments[this.tournamentIndex].seeds
      });
    }
    console.log('Tournament settings saved for', this.tournaments[this.tournamentIndex]);
  }

  drop(event: CdkDragDrop<any[]>) {
  if (this.tournamentIndex >= 0) {
    moveItemInArray(
      this.tournaments[this.tournamentIndex].seeds,
      event.previousIndex,
      event.currentIndex
    );
  }
}
}
