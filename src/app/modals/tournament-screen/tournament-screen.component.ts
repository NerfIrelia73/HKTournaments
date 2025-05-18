import { Component, Inject, NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
  deadline = new FormControl('')
  originalAdmins: string[] =[]
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
    this.originalAdmins = this.data.admins
    this.admins.setValue(this.originalAdmins)
    this.deadline.setValue(this.data.deadline)
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
    const deadlineDate = new Date(this.deadline.value as string)
    deadlineDate.setHours(23, 59, 59, 999);
    this.afs.collection(`tournaments`).add({
      name: this.name.value,
      description: this.description.value,
      deadline: deadlineDate,
      admins: this.admins.value,
      seedingEnabled: false,
      participants: []
    })
    this.dialogRef.close()
  }

  async editTournament() {
    const deadlineDate = new Date(this.deadline.value as string)
    deadlineDate.setHours(23, 59, 59, 999);
    this.afs.doc(`tournaments/${this.data.id}`).update({
      name: this.name.value,
      description: this.description.value,
      deadline: deadlineDate,
      admins: this.admins.value
    })
    this.dialogRef.close()
  }

  cancel() {
    this.dialogRef.close()
  }

}

@NgModule({
  imports: [CommonModule, MatButtonModule, FormsModule, MatDividerModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  declarations: [TournamentScreenComponent],
})
export class TournamentScreenModule {}
