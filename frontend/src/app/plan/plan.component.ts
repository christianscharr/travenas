import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConnectionsService} from "./connections/connections.service";
import {Connection} from "./connections/connection.interface";
import {Router} from "@angular/router";
import {Subject} from "rxjs/Subject";
import {AuthService} from "../common/services/auth/auth.service";
import {CheckinService} from "../common/services/checkin/checkin.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/mergeAll";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/do";

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  planForm: FormGroup;
  choosenConnResults$: Observable<Connection[]>;
  connectionResults$: Subject<Connection[]> = new Subject();
  rankingArray = [];
  showNotification:boolean = false;
  private noConnectionsFound: boolean = false;

  constructor(private connectionsService: ConnectionsService, private router: Router, private authService: AuthService, private checkinService: CheckinService) {
  }

  ngOnInit() {
    this.planForm = new FormGroup({
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required])
    });

    this.choosenConnResults$ = this.checkinService.getChoosenRoutes()
      .mergeMap(connections => connections)
      .map((connection: Connection) => {
        connection.ranking = Math.round(Math.round(connection.ranking*10)/2);
        return Observable.from([connection]);
      })
      .mergeAll()
      .toArray()
      .do(console.log);
  }

  get startControl() {
    return this.planForm.get('start');
  }

  get endControl() {
    return this.planForm.get('end');
  }

  lookup() {
    this.noConnectionsFound = false;
    this.connectionsService.getConnections(this.startControl.value, this.endControl.value)
      .subscribe((connections: Connection[]) => {
        console.log(connections);
        connections.map((connection) => {
          const counter = Math.round(Math.round(connection.ranking*10)/2);
          this.rankingArray.push(this.createArray(counter));
        });
        this.connectionResults$.next(connections);
      }, (error: any) => {
        this.noConnectionsFound = true;
      });
  }

  createArray(counter) {
    const foo = [];

    if(counter === 1) {
      return foo;
    }
    for (let i = 1; i <= counter; i++) {
      foo.push(i);
    }
    return foo;
  }

  choose(connection: Connection) {
    const userId = this.authService.userProfile$.getValue().sub;
    console.log('[PlanComponent] choose', connection, userId);

    this.connectionsService.saveConnection(userId, connection).subscribe((value) => {
        this.showNotification = true;
    });
  }

  disableNotification() {
    this.showNotification = false;
  }

  checkin(connection: Connection) {

  }

  get noConnections(){
    return this.noConnectionsFound;
  }
}
