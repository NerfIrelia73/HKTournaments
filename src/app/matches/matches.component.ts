import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { validateBasis } from '@angular/flex-layout';
import { MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR } from '@angular/material/checkbox';
import { MatAccordion } from '@angular/material/expansion';
import { User } from '../shared/services/user';
import { Match } from './matches';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {

  constructor(public afs: AngularFirestore, private _changeDetectionRef: ChangeDetectorRef) { }

  @ViewChild(MatAccordion) accordion: MatAccordion;
  displayedColumns: string[] = ['Runners', 'Comms', 'Restreamer', 'Date', 'Locked'];
  dataSource = [];

  ngOnInit(): void {
    this.afs.collection('tournaments/2cFP7NykXFZhEG06HpAL/matches').valueChanges().subscribe(async (resp) => {
      const matches: Match[] = []
      for (const match of resp) {
        const tmpMatch: Match = {
          runners: [],
          comms: [],
          restreamer: [],
          date: null,
          locked: false,
       }
        const d = match["date"].toDate()
        const utcD = d.toUTCString();
        tmpMatch.runners = await this.getUsers(match["runners"])
        tmpMatch.comms = await this.getUsers(match["comms"])
        tmpMatch.restreamer = await this.getUsers(match["restreamer"])
        tmpMatch.locked = match["locked"]
        tmpMatch.date = `${utcD}`
        //tmpMatch.date = `${match["date"].toDate().toDateString()} ${match["date"].toDate().toLocaleTimeString('en-US')}`
        matches.push(tmpMatch)
      }
      this.createDataTable(matches)
    });
  }

  async getUsers(users: string[]): Promise<User[]> {
    const retList: User[] = []
    for (const user of users) {
      await this.afs.collection('users').doc(user).ref.get().then(function (doc) {
        if (doc.exists) {
          retList.push(doc.data() as User)
        } else {
          console.log("There is no document!");
        }
      }).catch(function (error) {
        console.log("There was an error getting your document:", error);
      });
    }
    return retList
  }

  createDataTable(matches: Match[]) {
    this.dataSource = []
    for (const match of matches) {
      const participantInfo = []
      let runners = `${match.runners[0].displayName}`
      let runnerCommand = `!editcom !runners ${match.runners[0].displayName}: ${match.runners[0].twitch}`
      let commsCommand = `!editcom !comms ${match.comms[0].displayName}: ${match.comms[0].twitch}`
      participantInfo.push(`${match.runners[0].displayName}: ${match.runners[0].discordId}, ${match.runners[0].pronouns}`)
      for (let i = 1; i < match.runners.length; i++) {
        runners += `, ${match.runners[i].displayName}`
        runnerCommand += `, ${match.runners[i].displayName}: ${match.runners[i].twitch}`
        participantInfo.push(`${match.runners[i].displayName}: ${match.runners[i].discordId}, ${match.runners[i].pronouns}`)
      }
      let comms = `${match.comms[0].displayName}`
      participantInfo.push(`${match.comms[0].displayName}: ${match.comms[0].discordId}, ${match.comms[0].pronouns}`)
      for (let i = 1; i < match.comms.length; i++) {
        comms += `, ${match.comms[i].displayName}`
        commsCommand += `, ${match.comms[i].displayName}: ${match.comms[i].twitch}`
        participantInfo.push(`${match.comms[i].displayName}: ${match.comms[i].discordId}, ${match.comms[i].pronouns}`)
      }
      let restreamer = `${match.restreamer[0].displayName}`
      participantInfo.push(`${match.restreamer[0].displayName}: ${match.restreamer[0].discordId}, ${match.restreamer[0].pronouns}`)
      for (let i = 1; i < match.restreamer.length; i++) {
        restreamer += `, ${match.restreamer[i].displayName}`
        participantInfo.push(`${match.restreamer[i].displayName}: ${match.restreamer[i].discordId}, ${match.restreamer[i].pronouns}`)
      }
      this.dataSource.push({
        runners: runners,
        comms: comms,
        restreamer: restreamer,
        date: match.date,
        locked: match.locked,
        participantInfo: participantInfo,
        commands: [runnerCommand, commsCommand]
      })
    }
    this.dataSource = [...this.dataSource]
    console.log(JSON.stringify(this.dataSource))
  }

}
