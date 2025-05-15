import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { CalendarComponent } from '../calendar/calendar.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SharedRoutingModule } from './shared-routing.module';
import { MatchesComponent } from '../matches/matches.component';
import { TournamentSettingsComponent } from '../tournament-settings/tournament-settings.component';
import { BracketComponent } from '../bracket/bracket.component';


@NgModule({
  declarations: [MatchesComponent, CalendarComponent, TournamentSettingsComponent, BracketComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    FontAwesomeModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSlideToggleModule,
    DragDropModule
  ],
  exports: [MatchesComponent, TournamentSettingsComponent, BracketComponent]
})
export class SharedModule { }

export class MatchesModule {}
