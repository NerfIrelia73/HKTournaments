import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleComponent } from '../modals/schedule/schedule.component';
import { AuthService } from "../shared/services/auth.service";
import { faEnvelope, faLock, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  constructor(
    public authService: AuthService, private modalService: NgbModal
  ) { }

  faEnvelope = faEnvelope
  faLock = faLock
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