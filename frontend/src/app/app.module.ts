import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {StartComponent} from './start/start.component';
import {AppRoutingModule} from "./app-routing.module";
import {AuthService} from "./common/services/auth/auth.service";
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {CheckinComponent} from './checkin/checkin.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {ReactiveFormsModule} from "@angular/forms";
import {PlanComponent} from './plan/plan.component';
import {ConnectionsService} from "./plan/connections/connections.service";
import {HttpClientModule} from "@angular/common/http";
import {AuthGuard} from "./auth-guard.service";
import {CheckinService} from "./common/services/checkin/checkin.service";
import {RideComponent} from './ride/ride.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    LoginComponent,
    LogoutComponent,
    StartComponent,
    CheckinComponent,
    CheckoutComponent,
    PlanComponent,
    RideComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    ConnectionsService,
    CheckinService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
