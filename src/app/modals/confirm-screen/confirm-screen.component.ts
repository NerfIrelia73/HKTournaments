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
    //console.log(this.data)
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
    } else if (this.data.choice == "tournament") {
      this.afs.collection(`tournaments/${this.data.tournamentId}/matches`).snapshotChanges().subscribe(async (resp) => {
        for (const item of resp) {
          this.afs.doc(`tournaments/${this.data.tournamentId}/matches/${item.payload.doc.id}`).delete()
        }
      })
      this.afs.doc(`tournaments/${this.data.tournamentId}`).delete()
      this.dialogRef.close()
    } else {
      this.dialogRef.close(true);
    }
  }

  cancel() {
    this.dialogRef.close(false)
  }

}

@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [ConfirmScreenComponent],
})
export class ConfirmScreenModule {}
