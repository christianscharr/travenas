import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Connection, Connections} from "./connection.interface";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/mergeAll";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/map";
import "rxjs/add/observable/from";

@Injectable()
export class ConnectionsService {

  constructor(private httpClient: HttpClient) {
  }

  getConnections(startStation: string, endStation: string): Observable<Connection[]> {
    // Initialize Params Object
    let params = new HttpParams();
    params = params.append("from", startStation);
    params = params.append("to", endStation);

    return this.httpClient.get<Connections>("/api/connections", {
      params: params
    }).mergeMap((connections: Connections) => {
      const connectionArr: Connection[] = connections.connections;
      return Observable.from(connectionArr);
    }).toArray();
  }

  saveConnection(userId: string, connection: Connection): Observable<any> {
    // Initialize Params Object
    let params = new HttpParams();
    params = params.append("userId", userId);
    params = params.append("from", connection.from);
    params = params.append("depart", connection.depart.toString());
    params = params.append("to", connection.to);
    params = params.append("arrival", connection.arrival.toString());

    return this.httpClient.post<Connections>("/api/trip", {
      params: params
    });
  }
}
