import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Participant, User } from '../shared/services/user';

@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.component.html',
  styleUrls: ['./create-match.component.scss']
})
export class CreateMatchComponent implements OnInit {

  constructor(public authService: AuthService, public afs: AngularFirestore) { }


  runnerList: Participant[] = []
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
      this.afs.collection('users').valueChanges().subscribe(
        (val) => {
          this.afs.collection('users').valueChanges().subscribe(
            (val) => {
              this.participantList = val as User[]
              this.afs.collection('tournaments/2cFP7NykXFZhEG06HpAL/participants').valueChanges().subscribe(
                (val) => {
                  this.runnerList = val as Participant[]
                  const tmp = this.runnerList.map(a => a.uid)
                  this.participantList = this.participantList.filter(user => {
                    return tmp.includes(user.uid)
                  })
                }
              );
            }
          );
        }
      );
  }

  addMatch() {
    if (!this.loading) {
      this.loading = true
      console.log("We are adding the match")
      const d = new Date(Date.UTC(this.selectedDate.value.getFullYear(), this.selectedDate.value.getMonth(), this.selectedDate.value.getDate(), this.selectedTime.value.split(":")[0], this.selectedTime.value.split(":")[1], 0))
      console.log(d.toUTCString())
      console.log(this.selectedParticipants.value)
      const finalRunners = this.participantList.filter(user => {
        return this.selectedParticipants.value.includes(user.displayName)
      }).map(a => a.uid)
      console.log(finalRunners)
      this.afs.collection("tournaments/2cFP7NykXFZhEG06HpAL/matches").add({
        comms: [],
        date: d,
        restreamer: [],
        runners: finalRunners,
        locked: false
      })
    }
  }

}
