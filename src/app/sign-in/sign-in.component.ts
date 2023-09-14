import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { faEnvelope, faLock, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { LazyDialogService } from '../shared/services/lazy-dialog.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(public authService: AuthService, public lazyDialog: LazyDialogService) { }

  faEnvelope = faEnvelope
  faLock = faLock
  faChevronRight = faChevronRight

  ngOnInit() { }

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