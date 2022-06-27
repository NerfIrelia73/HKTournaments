import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopNavbarComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  @Output() newModeEvent = new EventEmitter<number>();
  @Input() public user: any;

  ngOnInit(): void {
  }

}
