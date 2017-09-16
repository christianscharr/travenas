import {Component} from '@angular/core';
import {AuthService} from "./common/services/auth/auth.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loggedIn$: BehaviorSubject<boolean>;
  userProfile$: BehaviorSubject<any>;

  constructor(private authService: AuthService) {
    this.loggedIn$ = authService.isAuthenticated$;
    this.userProfile$ = authService.userProfile$;
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
