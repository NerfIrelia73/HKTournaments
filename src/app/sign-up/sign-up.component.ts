import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { faEnvelope, faLock, faUser, faHashtag, faGamepad, faVenusMars, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ScheduleComponent } from '../modals/schedule/schedule.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  constructor(
    public authService: AuthService, private modalService: NgbModal
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
    this.modalService.open(ScheduleComponent, {
      size: 'xl',
      centered: true,
      windowClass: 'dark-modal'
    });
  }
}