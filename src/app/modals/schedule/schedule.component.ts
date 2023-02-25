import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/services/user';
import { UserListService } from 'src/app/user-list.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  constructor(public afs: AngularFirestore, public userService: UserListService, public activeModal: NgbActiveModal) { }

  displayedColumns: string[] = ['Runners', 'Comms', 'Restreamer', 'Date', 'Locked']
  userList: User[] = []
  dataSource = []
  subscription: Subscription = null

  ngOnInit(): void {
    console.log("Getting matches")
    this.userList = this.userService.getUserList()
    this.subscription = this.afs.collection('tournaments/2cFP7NykXFZhEG06HpAL/matches').snapshotChanges().subscribe(async (resp) => {
      for (const item of resp) {
        const index = this.dataSource.findIndex((source) => source.matchId == item.payload.doc.id)
        if (item.type == "added" && index == -1) {
          const dataEntry = await this.createDataEntry(item.payload.doc.data(), item.payload.doc.id)
          this.dataSource.push(dataEntry)
        } else if (item.type == "modified" && index != -1) {
          const dataEntry = await this.createDataEntry(item.payload.doc.data(), item.payload.doc.id)
          this.dataSource[index] = dataEntry
        }
      }
      this.dataSource = this.dataSource.filter(value => {
        const tmp = resp.map(a => a.payload.doc.id)
        return tmp.includes(value.matchId)
      })
    });
  }

  async createDataEntry(data: any, id: string) {
    const d = data.date.toDate()
    const utcD = d.toUTCString();
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

    const selectedComms = new FormControl('')
    const selectedRestreamer = new FormControl('')
    return {
      commsForm: selectedComms,
      restreamerForm: selectedRestreamer,
      runners: runners,
      comms: comms,
      restreamer: restreamer,
      date: `${utcD.replace("GMT", "UTC")}`,
      locked: data.locked,
      matchId: id,
      participantInfo: participantInfo,
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

}
