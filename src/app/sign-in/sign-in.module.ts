import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignInComponent } from "./sign-in.component";
import { SignInRoutingModule } from "./sign-in-routing.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [SignInComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        MatButtonModule,
        SignInRoutingModule
    ],
    exports: [SignInComponent]
})

export class SignInModule {
    constructor() {
    }
}