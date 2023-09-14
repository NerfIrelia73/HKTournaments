import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VerifyEmailComponent } from "./verify-email.component";
import { VerifyEmailRoutingModule } from "./verify-email-routing.module";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [VerifyEmailComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        VerifyEmailRoutingModule
    ],
    exports: [VerifyEmailComponent]
})

export class VerifyEmailModule {
    constructor() {
    }
}