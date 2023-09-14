import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ForgotPasswordComponent } from "./forgot-password.component";
import { ForgotPasswordRoutingModule } from "./forgot-password-routing.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [ForgotPasswordComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        MatButtonModule,
        ForgotPasswordRoutingModule
    ],
    exports: [ForgotPasswordComponent]
})

export class ForgotPasswordModule {
    constructor() {
    }
}