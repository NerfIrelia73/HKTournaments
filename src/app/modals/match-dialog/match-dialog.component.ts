import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-match-dialog',
  templateUrl: './match-dialog.component.html',
  styleUrls: ['./match-dialog.component.scss']
})
export class MatchDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<MatchDialogComponent>) {}

  reportResult(winner: number) {
    this.dialogRef.close(winner);
  }
}

@NgModule({
  imports: [CommonModule, MatButtonModule, MatCardModule],
  declarations: [MatchDialogComponent],
})
export class MatchDialogModule {}
