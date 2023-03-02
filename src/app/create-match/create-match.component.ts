import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Participant, User } from '../shared/services/user';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.component.html',
  styleUrls: ['./create-match.component.scss']
})
export class CreateMatchComponent implements OnInit {

  constructor(public authService: AuthService, public afs: AngularFirestore, public router: Router) {
  }


  runnerList: Participant[] = []
  tournaments: {name: string, uid: string, participants: User[]}[] = []
  tournamentIndex = -1
  selectedTournament = new FormControl('')
  participantList: User[] = []
  selectedParticipants = new FormControl('')
  selectedTime = new FormControl('')
  selectedDate = new FormControl(Date)
  loading = false

  availableTimes: {time: string, value: string}[] = [
    { time: "12:30 AM", value: "00:30" },
    { time: "2:00 AM", value: "02:00" },
    { time: "3:30 AM", value: "03:30" },
    { time: "5:00 AM", value: "05:00" },
    { time: "6:30 AM", value: "06:30" },
    { time: "8:00 AM", value: "08:00" },
    { time: "9:30 AM", value: "09:30" },
    { time: "11:00 AM", value: "11:00" },
    { time: "12:30 PM", value: "12:30" },
    { time: "2:00 PM", value: "14:00" },
    { time: "3:30 PM", value: "15:30" },
    { time: "5:00 PM", value: "17:00" },
    { time: "6:30 PM", value: "18:30" },
    { time: "8:00 PM", value: "20:00" },
    { time: "9:30 PM", value: "21:30" },
    { time: "11:00 PM", value: "23:00" }
  ]

  ngOnInit(): void {
    this.afs.collection('tournaments').get().forEach(async (resp) => {
      this.tournaments = []
      for (const item of resp.docs) {
        this.tournaments.push({
          name: (item.data() as any).name,
          uid: item.id,
          participants: []
        })
      }
    });

    this.afs.collection('users').get().forEach(
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
              const index = this.tournaments.findIndex(tournament => tournament.uid == item.ref.parent.parent.id)
              if (item.ref.parent.parent.id == "CVCUTJbiES3dvFmZVWNV") {
              }
              if (!this.tournaments[index].participants.includes(user[0]))
              this.tournaments[index].participants.push(user[0])
            }
          }
        );
      }
    );

    this.selectedTournament.valueChanges.subscribe(val => {
      this.selectedParticipants.setValue('')
      this.tournamentIndex = this.tournaments.findIndex(tournament => tournament.uid == val)
    })
  }

  addMatch() {
    if (!this.loading) {
      this.loading = true
      const d = new Date(Date.UTC(this.selectedDate.value.getFullYear(), this.selectedDate.value.getMonth(), this.selectedDate.value.getDate(), this.selectedTime.value.split(":")[0], this.selectedTime.value.split(":")[1], 0))
      const finalRunners = this.participantList.filter(user => {
        return this.selectedParticipants.value.includes(user.displayName)
      }).map(a => a.uid)
      this.afs.collection(`tournaments/${this.selectedTournament.value}/matches`).add({
        comms: [],
        date: d,
        restreamer: [],
        runners: finalRunners,
        locked: false
      }).then(() => {
        this.router.navigate([''])
      })
    }
  }

}
