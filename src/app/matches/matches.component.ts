import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { adminInfo } from '../home-page/participant';
import { User } from '../shared/services/user';
import { UserListService } from '../user-list.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {

  constructor(public afs: AngularFirestore, public router: Router, public userService: UserListService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url != '/') {
        this.subscription.unsubscribe()
      }
  });
  }

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() adminInfo: adminInfo = null
  @Input() tournaments: {name: string, uid: string}[] = null
  selectedView = new FormControl("list")
  selectedTournaments: string[] = []
  displayedColumns: string[] = ['Runners', 'Comms', 'Restreamer', 'Date', 'Locked']
  dataSource = []
  resetDataSource = []
  userList: User[] = []
  subscription: Subscription = null
  adminTournaments: string[] = []

  ngOnInit(): void {
    this.userList = this.userService.getUserList()
    this.subscription = this.afs.collectionGroup('matches', ref => ref.orderBy('date')).snapshotChanges().subscribe(async (resp) => {
      for (const item of resp) {
        const index = this.dataSource.findIndex((source) => source.matchId == item.payload.doc.id)
        if (item.type == "added" && index == -1) {
          const dataEntry = await this.createDataEntry(item.payload.doc.data(), item.payload.doc.id, item.payload.doc.ref.parent.parent.id)
          this.dataSource.push(dataEntry)
          this.resetDataSource.push(JSON.parse(JSON.stringify(dataEntry)))
        } else if (item.type == "modified" && index != -1) {
          const dataEntry = await this.createDataEntry(item.payload.doc.data(), item.payload.doc.id, item.payload.doc.ref.parent.parent.id)
          this.dataSource[index] = dataEntry
        }
      }
      this.dataSource = this.dataSource.filter(value => {
        const tmp = resp.map(a => a.payload.doc.id)
        return tmp.includes(value.matchId)
      })
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tournaments != null && changes.tournaments.currentValue != null) {
      this.selectedTournaments = changes.tournaments.currentValue.map(a => a.uid)
    }
    if (changes.adminInfo != null && changes.adminInfo.currentValue != null) {
      this.adminTournaments = changes.adminInfo.currentValue.tournaments.filter(a => {
        if (a.admin) {
          return true
        } else {
          return false
        }
      }).map(a => a.tournamentId)
    }
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

}

  updateSelectedTournaments(event: any) {
    if (event.checked) {
      this.selectedTournaments.push(event.source.value)
    } else {
      this.selectedTournaments.splice(this.selectedTournaments.indexOf(event.source.value), 1)
    }
  }

  async createDataEntry(data: any, id: string, tournament: string) {
    const d = data.date.toDate().toString()
    const runnersList = await this.getUsers(data.runners)
    const commsList = await this.getUsers(data.comms)
    const restreamerList = await this.getUsers(data.restreamer)

    const participantInfo = []
    const adminComms = []
    const adminRestreamer = []
    let runners = ""
    let runnerCommand = ""
    let comms = ""
    let commsCommand = ""
    let restreamer = ""
    if (runnersList.length > 0) {
      runners = `${runnersList[0].displayName}`
      runnerCommand = `!editcom !r ${runnersList[0].displayName}: ${runnersList[0].twitch}`
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
      commsCommand = `!editcom !comms ${commsList[0].displayName}: ${commsList[0].twitch}`
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

    const selectedComms = new FormControl('')
    selectedComms.setValue(adminComms.map(a => a.id))
    const selectedRestreamer = new FormControl('')
    selectedRestreamer.setValue(adminRestreamer.map(a => a.id))
    return {
      commsForm: selectedComms,
      restreamerForm: selectedRestreamer,
      adminComms: adminComms,
      adminRestreamer: adminRestreamer,
      runners: runners,
      comms: comms,
      restreamer: restreamer,
      date: d.replace(d.substring(d.indexOf("GMT"), d.indexOf("GMT") + 8), ""),
      locked: data.locked,
      matchId: id,
      participantInfo: participantInfo,
      tournament: tournament,
      commands: [runnerCommand, commsCommand]
    }
  }

  async getUsers(users: string[]): Promise<User[]> {
    const retList: User[] = []
    for (const user of users) {
      if (this.userList.map(a => a.uid).includes(user)) {
        retList.push(this.userList.filter(item => item.uid == user)[0])
      } else {
        let tmpUser: User = null
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
    const index = this.dataSource.findIndex((match) => match.matchId == source.matchId)
    const indexCopy = this.resetDataSource.findIndex((match) => match.matchId == source.matchId)
    this.dataSource[index].commsForm.setValue(this.resetDataSource[indexCopy].commsForm.value)
    this.dataSource[index].adminComms = JSON.parse(JSON.stringify(this.resetDataSource[indexCopy].adminComms))
    this.dataSource[index].restreamerForm.setValue(this.resetDataSource[indexCopy].restreamerForm.value)
    this.dataSource[index].adminRestreamer = JSON.parse(JSON.stringify(this.resetDataSource[indexCopy].adminRestreamer))
  }

  deleteMatch(source: any) {
    this.afs.doc(`tournaments/${source.tournament}/matches/${source.matchId}`).delete()
  }

  toggleSignUp(choice: string, source: any) {
    const index = this.dataSource.findIndex((match) => match.matchId == source.matchId)
    if (choice == "comms") {
      let commsForm = source.commsForm.value
      if (this.dataSource[index].commsForm.value.includes(this.adminInfo.uid)) {
        commsForm = commsForm.filter(item => item != this.adminInfo.uid)
      } else {
        commsForm.push(this.adminInfo.uid)
      }
      this.afs.doc(`tournaments/${source.tournament}/matches/${source.matchId}`).update({
        comms: commsForm,
      })
    } else if (choice == "restreamer") {
      let restreamerForm = source.restreamerForm.value
      if (this.dataSource[index].restreamerForm.value.includes(this.adminInfo.uid)) {
        restreamerForm = restreamerForm.filter(item => item != this.adminInfo.uid)
      } else {
        restreamerForm.push(this.adminInfo.uid)
      }
      this.afs.doc(`tournaments/${source.tournament}/matches/${source.matchId}`).update({
        restreamer: restreamerForm,
      })
    }
  }
}
