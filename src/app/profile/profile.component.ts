import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../shared/services/user';
import { LazyDialogService } from '../shared/services/lazy-dialog.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(public authService: AuthService, public afs: AngularFirestore, public lazyDialog: LazyDialogService) { }

  displayName = new FormControl('')
  discordId = new FormControl('')
  twitch = new FormControl('')
  pronouns = new FormControl('')
  userInfo: User | undefined

  async ngOnInit() {
    this.authService.usersInfo.subscribe(info => {
      if (info != null) {
        this.displayName.setValue(info.displayName)
        this.discordId.setValue(info.discordId)
        this.twitch.setValue(info.twitch)
        this.pronouns.setValue(info.pronouns)
        this.userInfo = info
      }
    })
  }

  setUserData() {
    if (this.userInfo != null) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(
        `users/${this.userInfo?.uid}`
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

      const config = {
        data: {
          good: true,
          text: "Profile settings updated!"
        },
        position: {
          top: '5%'
        }
      }
      this.lazyDialog.openDialog('confirm-screen', config)

    }

  }

}
