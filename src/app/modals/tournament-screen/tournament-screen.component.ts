import { Component, Inject, NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/shared/services/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tournament-screen',
  templateUrl: './tournament-screen.component.html',
  styleUrls: ['./tournament-screen.component.scss']
})
export class TournamentScreenComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public afs: AngularFirestore, private dialogRef: MatDialogRef<TournamentScreenComponent>) {

  }

  name = new FormControl('')
  description = new FormControl('')
  admins = new UntypedFormControl('')
  originalAdmins: string[] =[]
  participants = new Map()
  userList: User[] = []
  userSub: Subscription | undefined
  adminSub: Subscription | undefined

  ngOnInit() {
    this.userSub = this.afs.collectionGroup('users', ref => ref.orderBy('displayName')).snapshotChanges().subscribe(async (resp) => {
      this.userList = []
      for (const item of resp) {
        this.userList.push(item.payload.doc.data() as User)
      }
      this.userList = this.userList.sort((a, b) => {
        return a.displayName.localeCompare(b.displayName)
      })
    })
    this.adminSub = this.afs.collection(`tournaments/${this.data.id}/participants`).snapshotChanges().subscribe(
      val => {
        this.participants.clear()
        this.originalAdmins = []
        for (const item of val) {
          this.participants.set((item.payload.doc.data() as any).uid, item.payload.doc.id)
          if ((item.payload.doc.data() as any).admin) {
            this.originalAdmins.push((item.payload.doc.data()as any).uid)
          }
          this.admins.setValue(this.originalAdmins)
        }
      }
    )
    if (this.data.name != null) {
      this.name?.setValue(this.data.name)
    }
    if (this.data.description != null) {
      this.description?.setValue(this.data.description)
    }
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe()
    this.adminSub?.unsubscribe()
  }

  async createTournament() {
    const resp = this.afs.collection(`tournaments`).add({
      name: this.name.value,
      description: this.description.value,
    })
    for (const admin of this.admins.value) {
      this.afs.collection(`tournaments/${(await resp).id}/participants`).add({
        admin: true,
        superadmin: false,
        uid: admin
      })
    }
    this.dialogRef.close()
  }

  async editTournament() {
    this.afs.doc(`tournaments/${this.data.id}`).update({
      name: this.name.value,
      description: this.description.value,
    })
    const filteredAdmins = this.admins.value.filter((value: string) => !this.originalAdmins.includes(value)).concat(this.originalAdmins.filter(value => !this.admins.value.includes(value)));
    for (const admin of filteredAdmins) {
      if (this.originalAdmins.includes(admin)) {
        this.afs.doc(`tournaments/${this.data.id}/participants/${this.participants.get(admin)}`).set({
          admin: false,
        }, { merge: true })
      } else {
        if (this.participants.get(admin) != null) {
          this.afs.doc(`tournaments/${this.data.id}/participants/${this.participants.get(admin)}`).set({
            admin: true,
          }, { merge: true })
        } else {
          this.afs.collection(`tournaments/${this.data.id}/participants`).add({
            admin: true,
            superadmin: false,
            uid: admin
          })
        }
      }
    }
    this.dialogRef.close()
  }

  cancel() {
    this.dialogRef.close()
  }

}

@NgModule({
  imports: [CommonModule, MatButtonModule, FormsModule, MatDividerModule, ReactiveFormsModule, MatSelectModule, MatInputModule],
  declarations: [TournamentScreenComponent],
})
export class TournamentScreenModule {}
