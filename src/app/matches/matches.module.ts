import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatchesRoutingModule } from "./matches-routing.module";
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
        FontAwesomeModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDividerModule,
        MatchesRoutingModule
    ],
    exports: []
})

export class MatchesModule {
    constructor() {
    }
}