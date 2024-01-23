import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminPanelComponent } from "./admin-panel.component";
import { AdminPanelRoutingModule } from "./admin-panel-routing.module";
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from "@angular/material/divider";

@NgModule({
    declarations: [AdminPanelComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDividerModule,
        AdminPanelRoutingModule
    ],
    exports: [AdminPanelComponent]
})

export class AdminPanelModule {
    constructor() {
    }
}