import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeRoutingModule } from "./home-routing.module";
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from "../shared/shared.module";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HomeComponent } from "./home.component";

@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        MatTabsModule,
        MatSlideToggleModule,
        HomeRoutingModule,
        SharedModule
    ],
    exports: []
})

export class HomeModule {
    constructor() {
    }
}