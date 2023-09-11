import { Component, OnInit } from '@angular/core';
import { ScheduleComponent } from '../modals/schedule/schedule.component';
import { AuthService } from "../shared/services/auth.service";
import { faEnvelope, faLock, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(
    public authService: AuthService, public dialog: MatDialog
  ) { }

  faEnvelope = faEnvelope
  faLock = faLock
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