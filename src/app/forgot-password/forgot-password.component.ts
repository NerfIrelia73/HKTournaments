import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { faEnvelope, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { LazyDialogService } from '../shared/services/lazy-dialog.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  constructor(public authService: AuthService, public lazyDialog: LazyDialogService) { }

  faEnvelope = faEnvelope
  faChevronRight = faChevronRight

  ngOnInit() {
  }

  openSchedule() {
    const config = {
      panelClass: 'custom-dialog-container',
      position: {
        top: '9%'
      },
    }
    this.lazyDialog.openDialog('schedule', config)
  }
}