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

  selectedParticipants = new FormControl('');

}
