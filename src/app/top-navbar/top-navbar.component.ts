import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from "../shared/services/auth.service";
import { User } from '../shared/services/user';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

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
  ]
})
export class TopNavbarComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router) {
    this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.navTab = event.url.split("#")[0]
      if (this.navTab == '/sign-up' || this.navTab == '/sign-in' || this.navTab == '/forgot-password') {
        this.displayNav = false
      } else {
        this.displayNav = true
      }
    });
  }

  @Input() userInfo: User | undefined
  displayNav = false
  currentOption = ""
  screenWidth = window.innerWidth
  navToggle = false
  navTab = ""
  @Output() newOption = new EventEmitter<string>();

  ngOnInit(): void {
    this.authService.usersInfo.subscribe(info => {
      this.userInfo = info
    })
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
  }

  toggleButton(choice: string) {
    if (this.currentOption != choice) {
      this.currentOption = choice
      this.newOption.emit(choice)
    }
  }

  toggleNav(choice: string) {
    if (choice == 'title') {
      this.navToggle = false;
    } else {
      this.navToggle = !this.navToggle
    }
  }

}
