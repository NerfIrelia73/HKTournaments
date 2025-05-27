import { Component, NgModule, OnInit } from '@angular/core';
import { Participant, User } from '../shared/services/user';
import { UntypedFormControl } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Tournament } from '../shared/services/tournament';
import { adminInfo } from '../matches/participant';
import { firstValueFrom, Subscription } from 'rxjs';
import { LazyDialogService } from '../shared/services/lazy-dialog.service';


@Component({
  selector: 'app-tournament-settings',
  templateUrl: './tournament-settings.component.html',
  styleUrls: ['./tournament-settings.component.scss']
})
export class TournamentSettingsComponent implements OnInit {

  constructor(public authService: AuthService, public afs: AngularFirestore, public router: Router, public lazyDialog: LazyDialogService) {
  }

  tournaments: Tournament[] = []
  tournamentIndex = -1
  selectedTournament = new UntypedFormControl('')
  participantList: Participant[] = []
  loading = false
  adminInfo: adminInfo = {
        uid: "",
        displayName: "",
        tournaments: []
      }
  authSubscription: Subscription | undefined

  ngOnInit(): void {
    this.authSubscription = this.authService.adminInfo.subscribe(info => {
      this.adminInfo = info
    })
    this.afs.collection('tournaments').get().forEach(async (resp) => {
      this.tournaments = []
      for (const item of resp.docs) {
        if ((item.data() as any).admins.includes(this.adminInfo.uid)) {
          this.tournaments.push({
            ...(item.data() as any),
            uid: item.id
          })
        }
      }
    });

    this.selectedTournament.valueChanges.subscribe(val => {
      this.tournamentIndex = this.tournaments.findIndex(tournament => tournament.uid == val)
      this.participantList = this.tournaments[this.tournamentIndex].participants
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

  async removeParticipant(participant: any) {
    const config = {
      data: {
        text: `Are you sure you want to remove ${participant.displayName} from the tournament?`
      },
      position: {
        top: '18%'
      },
      autoFocus: false
    }
    const dialogRef = await this.lazyDialog.openDialog('confirm-screen', config);
    const dialogResult = await firstValueFrom(dialogRef.afterClosed());
    if (dialogResult) {
      this.participantList.splice(this.participantList.indexOf(participant), 1)
      this.afs.doc(`tournaments/${this.tournaments[this.tournamentIndex].uid}`).update({
        participants: this.participantList
      });
    }
  }

  getParticipantColumns(participants: any[], size: number = 24): any[][] {
    const columns = [];
    for (let i = 0; i < participants.length; i += size) {
      columns.push(participants.slice(i, i + size));
    }
    return columns;
  }

  drop(event: CdkDragDrop<any[]>) {
    if (!this.tournaments[this.tournamentIndex].seedingEnabled) return;
    this.participantList = this.tournaments[this.tournamentIndex].participants;
    moveItemInArray(this.participantList, event.previousIndex, event.currentIndex);

    // Update seed values after reorder
    this.participantList.forEach((participant, index) => {
      participant.seed = index + 1;
    });
  }
}
