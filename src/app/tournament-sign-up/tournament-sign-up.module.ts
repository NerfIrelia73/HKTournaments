import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TournamentSignUpComponent } from "./tournament-sign-up.component";
import { TournamentSignUpRoutingModule } from "./tournament-sign-up-routing.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    declarations: [TournamentSignUpComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        MatButtonModule,
        MatDividerModule,
        TournamentSignUpRoutingModule
    ],
    exports: [TournamentSignUpComponent]
})

export class TournamentSignUpModule {
    constructor() {
    }
}