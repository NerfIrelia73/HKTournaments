import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/services/user';
import { UserListService } from 'src/app/user-list.service';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  animations: [
    trigger('toggle', [
      /*
        state hamburguer => is the regular 3 lines style.
        states topX, hide, and bottomX => used to style the X element
      */
      state('closed', style({})),
      // style top bar to create the X
      state(
        'open',
        style({
          transform: 'rotate(180deg)',
        })
      ),
      transition('* => *', [
        animate('0.25s'), // controls animation speed
      ]),
    ])
  ]
})
export class ScheduleComponent implements OnInit {

  constructor(public afs: AngularFirestore, public userService: UserListService) { }

  displayedColumns: string[] = ['Runners', 'Comms', 'Restreamer', 'Date', 'Locked']
  tournaments: {name: string, uid: string, details: string}[] = []
  selectedTournaments: string[] = []
  userList: User[] = []
  dataSource: any = []
  subscription: Subscription | undefined
  faChevronDown = faChevronDown

  ngOnInit(): void {

    this.userList = this.userService.getUserList()
    this.subscription = this.afs.collectionGroup('matches', ref => ref.orderBy('date')).snapshotChanges().subscribe(async (resp) => {
      for (const item of resp) {
        const index = this.dataSource.findIndex((source: any) => source.matchId == item.payload.doc.id)
        if (item.type == "added" && index == -1) {
          const dataEntry = await this.createDataEntry(item.payload.doc.data(), item.payload.doc.id, item.payload.doc.ref.parent.parent?.id as string)
          this.dataSource.push(dataEntry)
        } else if (item.type == "modified" && index != -1) {
          const dataEntry = await this.createDataEntry(item.payload.doc.data(), item.payload.doc.id, item.payload.doc.ref.parent.parent?.id as string)
          this.dataSource[index] = dataEntry
        }
      }
      this.dataSource = this.dataSource.filter((value: { matchId: string; }) => {
        const tmp = resp.map(a => a.payload.doc.id)
        return tmp.includes(value.matchId)
      })
    });

    this.afs.collection('tournaments').snapshotChanges().subscribe(async (resp) => {
      const tournaments = []
      for (const item of resp) {
        tournaments.push({
          name: (item.payload.doc.data() as any).name,
          uid: item.payload.doc.id,
          details: (item.payload.doc.data() as any).description
        })
      }
      this.tournaments = tournaments
      this.selectedTournaments = tournaments.map((a: { uid: any; }) => a.uid)
    });
  }

  async createDataEntry(data: any, id: string, tournament: string) {
    const d = data.date.toDate()
    const timestamp = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), 0)
    const timeString = "<t:" + timestamp.getTime().toString().substring(0, timestamp.getTime().toString().length - 3) + ":F>"
    const runnersList = await this.getUsers(data.runners)
    const commsList = await this.getUsers(data.comms)
    const restreamerList = await this.getUsers(data.restreamer)

    const participantInfo = []
    let runners = ""
    let comms = ""
    let restreamer = ""
    if (runnersList.length > 0) {
      runners = `${runnersList[0].displayName}`
      participantInfo.push(`${runnersList[0].displayName}: ${runnersList[0].discordId}, ${runnersList[0].pronouns}`)
      for (let i = 1; i < runnersList.length; i++) {
        runners += `, ${runnersList[i].displayName}`
        participantInfo.push(`${runnersList[i].displayName}: ${runnersList[i].discordId}, ${runnersList[i].pronouns}`)
      }
    }
    if (commsList.length > 0) {
      comms = `${commsList[0].displayName}`
      participantInfo.push(`${commsList[0].displayName}: ${commsList[0].discordId}, ${commsList[0].pronouns}`)
      for (let i = 1; i < commsList.length; i++) {
        comms += `, ${commsList[i].displayName}`
        participantInfo.push(`${commsList[i].displayName}: ${commsList[i].discordId}, ${commsList[i].pronouns}`)
      }
    }
    if (restreamerList.length > 0) {
      restreamer = `${restreamerList[0].displayName}`
      participantInfo.push(`${restreamerList[0].displayName}: ${restreamerList[0].discordId}, ${restreamerList[0].pronouns}`)
      for (let i = 1; i < restreamerList.length; i++) {
        restreamer += `, ${restreamerList[i].displayName}`
        participantInfo.push(`${restreamerList[i].displayName}: ${restreamerList[i].discordId}, ${restreamerList[i].pronouns}`)
      }
    }

    const selectedComms = new UntypedFormControl('')
    const selectedRestreamer = new UntypedFormControl('')
    return {
      commsForm: selectedComms,
      restreamerForm: selectedRestreamer,
      runners: runners,
      comms: comms,
      restreamer: restreamer,
      date: d.toString().replace(d.toString().substring(d.toString().indexOf("GMT"), d.toString().indexOf("GMT") + 8), ""),
      timestamp: timeString,
      locked: data.locked,
      matchId: id,
      participantInfo: participantInfo,
      tournament: tournament,
      open: false,
    }
  }

  async getUsers(users: string[]): Promise<User[]> {
    const retList: User[] = []
    for (const user of users) {
      if (this.userList.map(a => a.uid).includes(user)) {
        retList.push(this.userList.filter(item => item.uid == user)[0])
      } else {
        let tmpUser: User | undefined
        await this.afs.collection('users').doc(user).ref.get().then(function (doc) {
          if (doc.exists) {
            retList.push(doc.data() as User)
            tmpUser = doc.data() as User
          }
        }).catch(function (error) {

        });
        this.userService.addToList(tmpUser as User)
      }
    }
    return retList
  }

  updateSelectedTournaments(event: any) {
    if (event.checked) {
      this.selectedTournaments.push(event.source.value)
    } else {
      this.selectedTournaments.splice(this.selectedTournaments.indexOf(event.source.value), 1)
    }
  }

  toggleOpen(source: any) {
    const index = this.dataSource.findIndex((match: any) => match.matchId == source.matchId)
    this.dataSource[index].open = !this.dataSource[index].open
  }

  toggleExpand(expand: boolean) {
    if (expand) {
      for (const source of this.dataSource) {
        source.open = true
      }
    } else {
      for (const source of this.dataSource) {
        source.open = false
      }
    }
  }

}
