import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {Observable} from "rxjs/Observable";
import {Connection} from "../../../plan/connections/connection.interface";
import {Observer} from "rxjs/Observer";
import {isNullOrUndefined} from "util";

@Injectable()
export class CheckinService {
  public static STATION_ID: string;
  public static ROUTE_ID: string;

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getChoosenRoutes(): Observable<Connection[]> {
    return Observable.create((obs: Observer<Connection[]>) => {
      this.authService.userProfile$.subscribe(profile => {
        if (isNullOrUndefined(profile)) {
          return;
        }

        this.httpClient.post('/api/trip/choosen', {
          userId: profile.sub,
          time: (new Date()).getTime()
        }).subscribe((data: Connection[]) => {
          obs.next(data);
          obs.complete();
        })
      });
    });
  }

  getRouteId(stationId: string): Observable<string> {
    return this.httpClient.post('/api/trip/identify', {
      userId: this.authService.userProfile$.getValue().sub,
      stationId: stationId,
      time: (new Date()).getTime()
    });
  }

  checkIn(stationId: string, routeId: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.append("stationId", stationId);
    params = params.append("routeId", routeId);
    params = params.append("userId", this.authService.userProfile$.getValue().sub);

    return this.httpClient.get('/api/checkin', {
      params: params
    });
  }

  checkTripEnded(stationId: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.append("stationId", stationId);
    params = params.append("userId", this.authService.userProfile$.getValue().sub);

    return this.httpClient.get('/api/tripending', {
      params: params
    });
  }
}
