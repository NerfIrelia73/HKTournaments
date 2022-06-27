import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    console.log(this.authService)
    console.log(this.authService.userInfo)
  }

}
