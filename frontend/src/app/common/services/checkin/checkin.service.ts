import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

@Injectable()
export class CheckinService {
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getRouteId(stationId: string): Observable<string> {
    return this.httpClient.post('/api/trip/identify', {
      userId: this.authService.userProfile$.getValue().sub,
      stationId: stationId,
      time: (new Date()).getTime()
    });
  }

  checkIn(stationId: string, routeId: string): Observable<boolean> {
    return Observable.create((obs: Observer<boolean>) => {

    });
  }
}
