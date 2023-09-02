import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoComponent } from '../modals/user-info/user-info.component';
import { AuthService } from "../shared/services/auth.service";
import { User } from '../shared/services/user';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss'],
  animations: [
    trigger('navBar', [
      state('navMenuVisible', style({
        opacity: '1',
        'pointer-events': 'all'
      })),
      state('navMenuHidden', style({
        opacity: '0',
        'pointer-events': 'none'
      })),
      state('borderVisible', style({
        'border-bottom': '2px solid purple',
      })),
      state('borderHidden', style({
        'border-bottom': '2px solid black'
      })),
      transition('* => *', [
        group([
        query('@hamburgerX', animateChild(), { optional: true}),
        animate('0.25s'), // controls animation speed
        ]),
      ]),
    ]),
    trigger('hamburgerX', [
      /*
        state hamburguer => is the regular 3 lines style.
        states topX, hide, and bottomX => used to style the X element
      */
      state('hamburger', style({})),
      // style top bar to create the X
      state(
        'topX',
        style({
          transform: 'rotate(45deg)',
          transformOrigin: 'left',
          margin: '6px',
        })
      ),
      // hides element when create the X (used in the middle bar)
      state(
        'hide',
        style({
          opacity: 0,
        })
      ),
      // style bottom bar to create the X
      state(
        'bottomX',
        style({
          transform: 'rotate(-45deg)',
          transformOrigin: 'left',
          margin: '6px',
        })
      ),
      transition('* => *', [
        animate('0.25s'), // controls animation speed
      ]),
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class TopNavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public afs: AngularFirestore, public modalService: NgbModal
  ) { }

  @Input() userInfo: User
  currentOption = ""
  screenWidth = window.innerWidth
  navToggle = false
  navTab = ""
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

  toggleNav(choice: string) {
    if (choice == 'title') {
      this.navToggle = false;
    } else {
      this.navToggle = !this.navToggle
    }
  }

}
