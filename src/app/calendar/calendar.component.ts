import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import {
  isSameDay,
  isSameMonth
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { CalendarMatchComponent } from '../modals/calendar-match/calendar-match.component';
import { adminInfo } from '../home-page/participant';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor(public modalService: NgbModal) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Changes on calendar")
    console.log(changes)
    if (changes.events != null && this.modalRef != null) {
      console.log(this.modalRef.componentInstance.source.matchId)
      const index = changes.events.currentValue.findIndex(item => {
        return(item.matchId == this.modalRef.componentInstance.source.matchId)
      })
      console.log(index)
      if(index != -1)
      this.modalRef.componentInstance.source = changes.events.currentValue[index]
      this.modalRef.componentInstance.dataSource = changes.events.currentValue[index]
    }
  }

  @Input() events = []
  @Input() resetDataSource: any
  @Input() adminInfo: adminInfo = null
  @Input() adminTournaments: string[] = []
  @Input() selectedTournaments: any
  @Output() updateMatch = new EventEmitter<{
    source: any,
    choice: string,
    option: string
  }>();

  modalRef: NgbModalRef = null

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh = new Subject<void>();

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: any): void {
    console.log(event)
    this.modalRef = this.modalService.open(CalendarMatchComponent, {
      size: 'xl',
      centered: true,
      windowClass: 'dark-modal'
    });
    this.modalRef.componentInstance.source = event
    this.modalRef.componentInstance.dataSource = event
    this.modalRef.componentInstance.resetDataSource = this.resetDataSource
    this.modalRef.componentInstance.adminInfo = this.adminInfo
    this.modalRef.componentInstance.adminTournaments = this.adminTournaments
    this.modalRef.componentInstance.selectedTournaments = this.selectedTournaments
    this.modalRef.componentInstance.updateCalendar.subscribe((data) => {
      console.log("We received the data")
      console.log(data);
      this.updateMatch.emit(data)
      })
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
