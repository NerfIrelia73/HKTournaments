import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateMatchComponent } from "./create-match.component";
import { CreateMatchRoutingModule } from "./create-match-routing.module";
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
    declarations: [CreateMatchComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonToggleModule,
        CreateMatchRoutingModule
    ],
    exports: [CreateMatchComponent]
})

export class CreateMatchModule {
    constructor() {
    }
}