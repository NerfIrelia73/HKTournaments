import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoComponent } from '../modals/user-info/user-info.component';
import { AuthService } from "../shared/services/auth.service";
import { User } from '../shared/services/user';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopNavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public afs: AngularFirestore, public modalService: NgbModal
  ) { }

  @Input() userInfo: User
  currentOption = "schedule"
  @Output() newOption = new EventEmitter<string>();

  ngOnInit(): void {
  }

  toggleButton(choice: string) {
    if (this.currentOption != choice) {
      this.currentOption = choice
      this.newOption.emit(choice)
    }
  }

  displayUserInfo() {
    const modalRef = this.modalService.open(UserInfoComponent, {
      size: 'm',
      centered: true,
      windowClass: 'dark-modal'
    });
    modalRef.componentInstance.userInfo = this.userInfo
  }

}
