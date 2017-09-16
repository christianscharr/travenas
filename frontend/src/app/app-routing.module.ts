import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import {StartComponent} from "./start/start.component";

const appRoutes: Routes = [
  { path: '',   component: StartComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
