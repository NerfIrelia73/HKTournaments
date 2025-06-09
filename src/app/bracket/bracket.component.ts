import { Component, ElementRef, ViewChild } from '@angular/core';
import { Tournament } from '../shared/services/tournament';
import { Participant } from '../shared/services/user';
import { UntypedFormControl } from '@angular/forms';
import { adminInfo } from '../matches/participant';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DoubleEliminationManager } from '../shared/services/double-elimination-manager';
import { LazyDialogService } from '../shared/services/lazy-dialog.service';

@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss']
})
export class BracketComponent {
  constructor(public authService: AuthService, public afs: AngularFirestore, public router: Router, public lazyDialog: LazyDialogService) {
  }

  tournaments: Tournament[] = []
  tournament: any = {}
  selectedTournament = new UntypedFormControl(null)
  participantList: Participant[] = []
  loading = false
  adminInfo: adminInfo = {
    uid: "",
    displayName: "",
    tournaments: []
  }
  authSubscription: Subscription | undefined
  winnersBracket: any[] = []
  losersBracket: any[] = []
  managerDE: any
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  async ngOnInit(): Promise<void> {
    this.managerDE = new DoubleEliminationManager();
    this.authSubscription = this.authService.adminInfo.subscribe(info => {
      this.adminInfo = info
    })
    this.afs.collection('tournaments').snapshotChanges().subscribe(async (resp) => {
      const modified = resp.filter(x => x.type == "modified")
      this.tournaments = []
      for (const item of resp) {
        this.tournaments.push({
          ...(item.payload.doc.data() as any),
          uid: item.payload.doc.id
        })
      }
      if (modified.length > 0 && modified[0].payload.doc.id == this.tournament.uid && this.tournament) {
        this.tournament = this.tournaments.find(tournament => tournament.uid == modified[0].payload.doc.id)
      }
    });

    this.selectedTournament.valueChanges.subscribe(val => {
      this.tournament = this.tournaments.find(tournament => tournament.uid == val)
      this.participantList = this.tournament.participants
      if (this.tournament.bracket != null) {
        this.winnersBracket = this.expandBracket(this.tournament.bracket.winnersBracket)
        this.losersBracket = this.expandBracket(this.tournament.bracket.losersBracket)
      } else {
        this.winnersBracket = []
        this.losersBracket = []
      }
      this.managerDE.setWinnersandLosers(this.winnersBracket, this.losersBracket, this.participantList)
    })
  }

  startTournament() {
    if (!this.tournament.started) {
      this.afs.doc(`tournaments/${this.tournament.uid}`).update({
          started: !this.tournament.started,
          originalBracket: {
            winnersBracket: this.flattenBracket(this.winnersBracket),
            losersBracket: this.flattenBracket(this.losersBracket)
          },
          bracket: {
            winnersBracket: this.flattenBracket(this.winnersBracket),
            losersBracket: this.flattenBracket(this.losersBracket)
          }
      });
    } else {
      this.afs.doc(`tournaments/${this.tournament.uid}`).update({
          started: !this.tournament.started,
          bracket: this.tournament.originalBracket
      });
      this.winnersBracket = this.expandBracket(this.tournament.originalBracket.winnersBracket)
      this.losersBracket = this.expandBracket(this.tournament.originalBracket.losersBracket)
      this.managerDE.setWinnersandLosers(this.winnersBracket, this.losersBracket, this.participantList)
    }
  }

  async updateMatch(bracket: string, match: any, round: any, matchData: any) {
    if (this.tournament.started && matchData.opponent1 != null && matchData.opponent2 != null) {
      const config = {
        data: {
          bracket: bracket,
          match: match,
          round: round,
          result: matchData.result,
          matchData: matchData,
          adminInfo: this.adminInfo,
          tournament: this.tournament
        },
        position: {
          top: '10%'
        },
        maxHeight: '100vh',
        panelClass: 'match-dialog-panel',
        backdropClass: 'custom-backdrop',
        autoFocus: false
      }
      const dialogRef = await this.lazyDialog.openDialog('match-dialog', config);
      const dialogResult = await firstValueFrom(dialogRef.afterClosed());
      if (dialogResult != null) {
        const data = this.managerDE.reportMatchResult(bracket, match, round, dialogResult, matchData)
        this.winnersBracket = data.winners
        this.losersBracket = data.losers
        this.afs.doc(`tournaments/${this.tournament.uid}`).update({
            bracket: {
              winnersBracket: this.flattenBracket(this.winnersBracket),
              losersBracket: this.flattenBracket(this.losersBracket)
            }
        });
      }
    }
  }

  async generateBracket(): Promise<any> {
    if (!this.tournament.started) {
      let participants = [...this.participantList]

      if (this.tournament.seedingEnabled) {
        participants.sort((a, b) => a.seed - b.seed)
      } else {
        for (let i = participants.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = participants[i];
          participants[i] = participants[j];
          participants[j] = temp;
        }
      }

      this.managerDE.generateBrackets()

      this.winnersBracket = this.managerDE.getWinnersRounds()
      this.losersBracket = this.managerDE.getLosersRounds()
    }
  }

  getMatchId(index: number): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let id = ''

    do {
      id = alphabet[index % 26] + id
      index = Math.floor(index / 26) - 1
    } while (index >= 0)

    return id
  }

  expandBracket(flattened: any[]) {
    const rounds = Math.max(...flattened.map(m => m.round)) + 1;
    return Array.from({ length: rounds }, (_, roundIndex) =>
      flattened
        .filter(m => m.round === roundIndex)
        .sort((a, b) => a.matchIndex - b.matchIndex)
    );
  }

  flattenBracket(bracket: any) {
    return bracket.flatMap((round: any[], roundIndex: any) =>
        round.map((match: any, matchIndex: any) => ({
          ...match,
          round: roundIndex,
          matchIndex
        }))
      );
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1; // multiplier = scroll speed
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  stopDrag() {
    this.isDragging = false;
  }
}
