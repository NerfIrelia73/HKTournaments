import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/services/user';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  constructor(public afs: AngularFirestore, public activeModal: NgbActiveModal) { }

  @Input() public userInfo: User
  displayName = new FormControl('')
  discordId = new FormControl('')
  twitch = new FormControl('')
  pronouns = new FormControl('')

  ngOnInit(): void {
    this.displayName.setValue(this.userInfo.displayName)
    this.discordId.setValue(this.userInfo.discordId)
    this.twitch.setValue(this.userInfo.twitch)
    this.pronouns.setValue(this.userInfo.pronouns)
  }

  setUserData() {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${this.userInfo.uid}`
    );
    const userData = {
      displayName: this.displayName.value,
      discordId: this.discordId.value,
      twitch: this.twitch.value,
      pronouns: this.pronouns.value,
    };

    userRef.set(userData, {
      merge: true,
    });

    this.activeModal.dismiss('Cross click')
  }
}
