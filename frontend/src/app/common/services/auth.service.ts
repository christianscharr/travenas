import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import {environment} from "../../../environments/environment";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {isNullOrUndefined} from "util";
import {Subject} from "rxjs/Subject";

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'SKFmFCr24uRmtiN93561QdM7r3pqjTEZ',
    domain: 'travenas.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://travenas.eu.auth0.com/userinfo',
    redirectUri: environment.production ? 'http://travenas.com/login' : 'http://localhost:4200/login',
    scope: 'openid profile'
  });

  userProfile$: Subject<any> = new Subject();
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject(this.isAuthenticated());

  constructor(public router: Router) {
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/']);
        console.log('[AuthService] handleAuthentication()', authResult);
        this.isAuthenticated$.next(this.isAuthenticated());
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (!isNullOrUndefined(err)) {
        console.error(err);
        return;
      }

      console.log('[AuthService] setSession() >> userInfo', profile);
      this.userProfile$.next(profile);
    });
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    this.isAuthenticated$.next(this.isAuthenticated());

    // Go back to the home route
    this.auth0.logout({returnTo: environment.production ? 'http://travenas.com/logout' : 'http://localhost:4200/logout'});
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const isAuthenticated = new Date().getTime() < expiresAt;
    const accessToken = localStorage.getItem('access_token');

    if (isAuthenticated && !isNullOrUndefined(accessToken)) {
      this.auth0.client.userInfo(accessToken, (err, profile) => {
        if (!isNullOrUndefined(err)) {
          console.error(err);
          return;
        }

        console.log('[AuthService] isAuthenticated() >> userInfo', profile);
        this.userProfile$.next(profile);
      });
    }

    return isAuthenticated;
  }
}
