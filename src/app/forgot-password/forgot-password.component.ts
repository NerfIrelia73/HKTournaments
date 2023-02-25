import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { faEnvelope, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ScheduleComponent } from '../modals/schedule/schedule.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    public authService: AuthService, private modalService: NgbModal
  ) { }

  faEnvelope = faEnvelope
  faChevronRight = faChevronRight

  ngOnInit() {
  }

  openSchedule() {
    this.modalService.open(ScheduleComponent, {
      size: 'xl',
      centered: true,
      windowClass: 'dark-modal'
    });
  }
}