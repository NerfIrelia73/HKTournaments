import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignUpComponent } from "./sign-up.component";
import { SignUpRoutingModule } from "./sign-up-routing.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [SignUpComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        MatButtonModule,
        SignUpRoutingModule
    ],
    exports: [SignUpComponent]
})

export class SignUpModule {
    constructor() {
    }
}