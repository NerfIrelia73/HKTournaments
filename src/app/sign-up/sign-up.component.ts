import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { faEnvelope, faLock, faUser, faHashtag, faGamepad, faVenusMars, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ScheduleComponent } from '../modals/schedule/schedule.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  constructor(
    public authService: AuthService, public dialog: MatDialog
  ) { }

    faEnvelope = faEnvelope
    faLock = faLock
    faUser = faUser
    faHashtag = faHashtag
    faGamepad = faGamepad
    faVenusMars = faVenusMars
    faChevronRight = faChevronRight

  ngOnInit() { }

  openSchedule() {
    this.dialog.open(ScheduleComponent, {
      panelClass: 'custom-dialog-container',
      position: {
        top: '9%'
      },
    });
  }
}