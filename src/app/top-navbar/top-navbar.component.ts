import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopNavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public afs: AngularFirestore
  ) { }

  @Input() displayName: String = ""
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

}
