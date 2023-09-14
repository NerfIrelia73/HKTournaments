import { Component, Inject, NgModule } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-screen',
  templateUrl: './confirm-screen.component.html',
  styleUrls: ['./confirm-screen.component.scss']
})
export class ConfirmScreenComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
  }

}

@NgModule({
  imports: [],
  declarations: [ConfirmScreenComponent],
})
export class ConfirmScreenModule {}
