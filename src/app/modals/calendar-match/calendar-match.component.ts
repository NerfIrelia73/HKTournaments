import { Component, EventEmitter, Inject, NgModule, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserListService } from 'src/app/user-list.service';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from "../../shared/shared.module";

@Component({
  selector: 'app-calendar-match',
  templateUrl: './calendar-match.component.html',
  styleUrls: ['./calendar-match.component.scss']
})
export class CalendarMatchComponent implements OnInit {

  constructor(public afs: AngularFirestore, public router: Router, public userService: UserListService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  @Output() updateCalendar = new EventEmitter<{
    source: any,
    choice: string | null,
    option: string
  }>();

  ngOnInit(): void {
  }

  sendToCalendar(source: any, choice: string | null, option: string) {
    const data = {
      source: source,
      choice: choice,
      option: option
    }
    this.updateCalendar.emit(data)
  }
}

@NgModule({
    declarations: [CalendarMatchComponent],
    imports: [MatDialogModule, SharedModule]
})
export class CalendarMatchModule {}