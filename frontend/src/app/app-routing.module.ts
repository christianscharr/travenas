import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StartComponent} from "./start/start.component";
import {LoginComponent} from "./login/login.component";
import {environment} from "../environments/environment";
import {LogoutComponent} from "./logout/logout.component";
import {CheckinComponent} from "./checkin/checkin.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {PlanComponent} from "./plan/plan.component";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'plan',
    component: PlanComponent
  },
  {
    path: 'checkin',
    component: CheckinComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: '',
    component: StartComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: !environment.production} // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
