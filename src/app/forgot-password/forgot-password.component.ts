import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { faEnvelope, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ScheduleComponent } from '../modals/schedule/schedule.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    public authService: AuthService, public dialog: MatDialog
  ) { }

  faEnvelope = faEnvelope
  faChevronRight = faChevronRight

  ngOnInit() {
  }

  openSchedule() {
    this.dialog.open(ScheduleComponent, {
      panelClass: 'custom-dialog-container',
      position: {
        top: '9%'
      },
    });
  }
}