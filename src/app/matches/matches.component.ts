import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UntypedFormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { adminInfo } from './participant';
import { User } from '../shared/services/user';
import { UserListService } from '../user-list.service';
import { AuthService } from '../shared/services/auth.service';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LazyDialogService } from '../shared/services/lazy-dialog.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
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
export class MatchesComponent implements OnInit {

  constructor(public afs: AngularFirestore, public router: Router, public userService: UserListService, public authService: AuthService, public lazyDialog: LazyDialogService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url != '/') {
        this.subscription?.unsubscribe()
      }
  });
  }

  @Input() matchFilter: string = ""

  faChevronDown = faChevronDown
  adminInfo: adminInfo = {
    uid: "",
    displayName: "",
    tournaments: []
  }
  tournaments: {name: string, uid: string, details: string}[] = []
  selectedView = new UntypedFormControl("list")
  selectedTournaments: string[] = []
  displayedColumns: string[] = ['Runners', 'Comms', 'Restreamer', 'Date', 'Locked']
  dataSource: any = []
  resetDataSource: any = []
  userList: User[] = []
  subscription: Subscription | undefined
  adminTournaments: string[] = []

  ngOnInit(): void {
    this.authService.adminInfo.subscribe(info => {
      this.adminInfo = info
      this.adminTournaments = info.tournaments.filter((a) => {
        if (a.admin) {
          return true
        } else {
          return false
        }
      }).map((a) => a.tournamentId)
    })
    this.authService.tournaments.subscribe(info => {
      this.tournaments = info
      this.selectedTournaments = info.map((a: { uid: any; }) => a.uid)
    })

    this.userList = this.userService.getUserList()
    this.subscription = this.afs.collectionGroup('matches', ref => ref.orderBy('date')).snapshotChanges().subscribe(async (resp) => {
      for (const item of resp) {
        const index = this.dataSource.findIndex((source: any) => source.matchId == item.payload.doc.id)
        if (item.type == "added" && index == -1) {
          const dataEntry = await this.createDataEntry(item.payload.doc.data(), item.payload.doc.id, item.payload.doc.ref.parent.parent?.id as string)
          this.dataSource.push(dataEntry)
          this.resetDataSource.push(JSON.parse(JSON.stringify(dataEntry)))
        } else if (item.type == "modified" && index != -1) {
          const dataEntry = await this.createDataEntry(item.payload.doc.data(), item.payload.doc.id, item.payload.doc.ref.parent.parent?.id as string)
          const openStatus = this.dataSource[index].open
          this.dataSource[index] = dataEntry
          this.dataSource[index].open = openStatus
        }
      }
      this.dataSource = this.dataSource.filter((value: { matchId: "", }) => {
        const tmp = resp.map(a => a.payload.doc.id)
        return tmp.includes(value.matchId)
      })
    });
  }

  updateSelectedTournaments(event: any) {
    if (event.checked) {
      this.selectedTournaments.push(event.source.value)
    } else {
      this.selectedTournaments.splice(this.selectedTournaments.indexOf(event.source.value), 1)
    }
  }

  async createDataEntry(data: any, id: string, tournament: string) {
    const d = data.date.toDate()
    const timestamp = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), 0)
    const timeString = "<t:" + timestamp.getTime().toString().substring(0, timestamp.getTime().toString().length - 3) + ":F>"
    const runnersList = await this.getUsers(data.runners)
    const commsList = await this.getUsers(data.comms)
    const restreamerList = await this.getUsers(data.restreamer)

    const participantInfo = []
    const adminComms = []
    const adminRestreamer = []
    const runnerIds = runnersList.map(a => a.uid)
    let runners = ""
    let runnerCommand = ""
    let comms = ""
    let commsCommand = ""
    let restreamer = ""
    if (runnersList.length > 0) {
      runners = `${runnersList[0].displayName}`
      runnerCommand = `!setrunners ${runnersList[0].displayName}: ${runnersList[0].twitch}`
      participantInfo.push(`${runnersList[0].displayName}: ${runnersList[0].discordId}, ${runnersList[0].pronouns}`)
      for (let i = 1; i < runnersList.length; i++) {
        runners += `, ${runnersList[i].displayName}`
        runnerCommand += `, ${runnersList[i].displayName}: ${runnersList[i].twitch}`
        participantInfo.push(`${runnersList[i].displayName}: ${runnersList[i].discordId}, ${runnersList[i].pronouns}`)
      }
    }
    if (commsList.length > 0) {
      adminComms.push({
        name: commsList[0].displayName,
        id: commsList[0].uid
      })
      comms = `${commsList[0].displayName}`
      commsCommand = `!setcomms ${commsList[0].displayName}: ${commsList[0].twitch}`
      participantInfo.push(`${commsList[0].displayName}: ${commsList[0].discordId}, ${commsList[0].pronouns}`)
      for (let i = 1; i < commsList.length; i++) {
        adminComms.push({
          name: commsList[i].displayName,
          id: commsList[i].uid
        })
        comms += `, ${commsList[i].displayName}`
        commsCommand += `, ${commsList[i].displayName}: ${commsList[i].twitch}`
        participantInfo.push(`${commsList[i].displayName}: ${commsList[i].discordId}, ${commsList[i].pronouns}`)
      }
    }
    if (restreamerList.length > 0) {
      adminRestreamer.push({
        name: restreamerList[0].displayName,
        id: restreamerList[0].uid
      })
      restreamer = `${restreamerList[0].displayName}`
      participantInfo.push(`${restreamerList[0].displayName}: ${restreamerList[0].discordId}, ${restreamerList[0].pronouns}`)
      for (let i = 1; i < restreamerList.length; i++) {
        adminRestreamer.push({
          name: restreamerList[i].displayName,
          id: restreamerList[i].uid
        })
        restreamer += `, ${restreamerList[i].displayName}`
        participantInfo.push(`${restreamerList[i].displayName}: ${restreamerList[i].discordId}, ${restreamerList[i].pronouns}`)
      }
    }

    const selectedComms = new UntypedFormControl('')
    selectedComms.setValue(adminComms.map(a => a.id))
    const selectedRestreamer = new UntypedFormControl('')
    selectedRestreamer.setValue(adminRestreamer.map(a => a.id))
    const matchTitle = new UntypedFormControl('')
    matchTitle.setValue(data.title)
    return {
      title: runners,
      color: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
      },
      start: data.date.toDate(),
      commsForm: selectedComms,
      restreamerForm: selectedRestreamer,
      adminComms: adminComms,
      adminRestreamer: adminRestreamer,
      runnerIds: runnerIds,
      runners: runners,
      comms: comms,
      restreamer: restreamer,
      date: d.toString().replace(d.toString().substring(d.toString().indexOf("GMT"), d.toString().indexOf("GMT") + 8), ""),
      timestamp: timeString,
      locked: data.locked,
      matchId: id,
      participantInfo: participantInfo,
      tournament: tournament,
      onHKC: data.onHKC,
      matchTitle: matchTitle,
      commands: [runnerCommand, commsCommand],
      open: false
    }
  }

  async getUsers(users: string[]): Promise<User[]> {
    const retList: User[] = []
    for (const user of users) {
      if (this.userList.map(a => a.uid).includes(user)) {
        retList.push(this.userList.filter(item => item.uid == user)[0])
      } else {
        let tmpUser: User = {
          uid: "",
          email: "",
          displayName: "",
          discordId: "",
          twitch: "",
          pronouns: "",
          photoURL: "",
          emailVerified: false
       }
        await this.afs.collection('users').doc(user).ref.get().then(function (doc) {
          if (doc.exists) {
            retList.push(doc.data() as User)
            tmpUser = doc.data() as User
          }
        }).catch(function (error) {

        });
        this.userService.addToList(tmpUser)
      }
    }
    return retList
  }

  toggleConfirm(source: any) {
    this.afs.doc(`tournaments/${source.tournament}/matches/${source.matchId}`).update({
      comms: source.commsForm.value,
      restreamer: source.restreamerForm.value,
      locked: !source.locked
    })
  }

  resetMatch(source: any) {
    const index = this.dataSource.findIndex((match: any) => match.matchId == source.matchId)
    const indexCopy = this.resetDataSource.findIndex((match: any) => match.matchId == source.matchId)
    this.dataSource[index].commsForm.setValue(this.resetDataSource[indexCopy].commsForm.value)
    this.dataSource[index].adminComms = JSON.parse(JSON.stringify(this.resetDataSource[indexCopy].adminComms))
    this.dataSource[index].restreamerForm.setValue(this.resetDataSource[indexCopy].restreamerForm.value)
    this.dataSource[index].adminRestreamer = JSON.parse(JSON.stringify(this.resetDataSource[indexCopy].adminRestreamer))
  }

  deleteMatch(source: any) {
    this.afs.doc(`tournaments/${source.tournament}/matches/${source.matchId}`).delete()
  }

  toggleSignUp(choice: string, source: any) {
    const index = this.dataSource.findIndex((match: any) => match.matchId == source.matchId)
    if (choice == "comms") {
      let commsForm = source.commsForm.value
      if (this.dataSource[index].commsForm.value.includes(this.adminInfo.uid)) {
        commsForm = commsForm.filter((item: string) => item != this.adminInfo.uid)
      } else {
        commsForm.push(this.adminInfo.uid)
      }
      this.afs.doc(`tournaments/${source.tournament}/matches/${source.matchId}`).update({
        comms: commsForm,
      })
    } else if (choice == "restreamer") {
      let restreamerForm = source.restreamerForm.value
      if (this.dataSource[index].restreamerForm.value.includes(this.adminInfo.uid)) {
        restreamerForm = restreamerForm.filter((item: string) => item != this.adminInfo.uid)
      } else {
        restreamerForm.push(this.adminInfo.uid)
      }
      this.afs.doc(`tournaments/${source.tournament}/matches/${source.matchId}`).update({
        restreamer: restreamerForm,
      })
    }
  }

  saveMatchTitle(source: any) {
    this.afs.doc(`tournaments/${source.tournament}/matches/${source.matchId}`).update({
      title: source.matchTitle.value,
    })

    const config = {
      data: 'Stream title updated!',
      position: {
        top: '5%'
      }
    }
    this.lazyDialog.openDialog('confirm-screen', config)
  }

  toggleHKC(source: any) {
    this.afs.doc(`tournaments/${source.tournament}/matches/${source.matchId}`).update({
      onHKC: !source.onHKC,
    })
  }

  updateMatch(data: any) {
    if (data.option == 'confirm') {
      this.toggleConfirm(data.source)
    } else if (data.option == 'delete') {
      this.deleteMatch(data.source)
    } else if (data.option == 'reset') {
      this.resetMatch(data.source)
    } else if (data.option == 'HKC') {
      this.toggleHKC(data.source)
    } else if (data.option == 'SignUp') {
      this.toggleSignUp(data.choice, data.source)
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
