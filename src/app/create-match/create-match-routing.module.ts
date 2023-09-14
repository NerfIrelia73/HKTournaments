import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMatchComponent } from './create-match.component';


const routes: Routes = [
  {
    path: '',
    component: CreateMatchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateMatchRoutingModule { }