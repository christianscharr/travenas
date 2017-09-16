import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StartComponent} from "./start/start.component";
import {LoginComponent} from "./login/login.component";
import {environment} from "../environments/environment";
import {LogoutComponent} from "./logout/logout.component";
import {CheckinComponent} from "./checkin/checkin.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {PlanComponent} from "./plan/plan.component";
import {AuthGuard} from "./auth-guard.service";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'plan',
    component: PlanComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkin',
    component: CheckinComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
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
