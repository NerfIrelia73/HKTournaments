import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TournamentSignUpComponent } from './tournament-sign-up.component';


const routes: Routes = [
  {
    path: '',
    component: TournamentSignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentSignUpRoutingModule { }