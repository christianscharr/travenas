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
import {TravelComponent} from './travel/travel.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ChatService} from "./common/services/chat/chat.service";

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    LoginComponent,
    LogoutComponent,
    StartComponent,
    CheckinComponent,
    CheckoutComponent,
    TravelComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
