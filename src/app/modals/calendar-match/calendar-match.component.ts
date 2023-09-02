import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserListService } from 'src/app/user-list.service';

@Component({
  selector: 'app-calendar-match',
  templateUrl: './calendar-match.component.html',
  styleUrls: ['./calendar-match.component.scss']
})
export class CalendarMatchComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, public afs: AngularFirestore, public router: Router, public userService: UserListService) { }

  @Input() public source: any
  @Input() public dataSource: any
  @Input() public resetDataSource: any
  @Input() public adminInfo: any
  @Input() public adminTournaments: any
  @Input() public selectedTournaments: any

  @Output() updateCalendar = new EventEmitter<{
    source: any,
    choice: string,
    option: string
  }>();

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Changes in modal")
    console.log(changes)
  }

  sendToCalendar(source: any, choice: string, option: string) {
    const data = {
      source: source,
      choice: choice,
      option: option
    }
    this.updateCalendar.emit(data)
  }
}