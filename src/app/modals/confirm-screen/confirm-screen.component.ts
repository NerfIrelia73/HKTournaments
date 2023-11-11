import { Component, Inject, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-screen',
  templateUrl: './confirm-screen.component.html',
  styleUrls: ['./confirm-screen.component.scss']
})
export class ConfirmScreenComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public afs: AngularFirestore, private dialogRef: MatDialogRef<ConfirmScreenComponent>) {

  }

  ngOnInit() {
  }

  async confirm() {
    if (this.data.choice == "comms") {
      this.afs.doc(`tournaments/${this.data.source.tournament}/matches/${this.data.source.matchId}`).update({
        comms: this.data.commsForm,
      })
      this.dialogRef.close()
    } else if (this.data.choice == "restreamer") {
      this.afs.doc(`tournaments/${this.data.source.tournament}/matches/${this.data.source.matchId}`).update({
        restreamer: this.data.restreamerForm,
      })
      this.dialogRef.close()
    }
  }

  cancel() {
    this.dialogRef.close()
  }

}

@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [ConfirmScreenComponent],
})
export class ConfirmScreenModule {}
