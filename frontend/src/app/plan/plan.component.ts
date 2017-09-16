import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConnectionsService} from "./connections/connections.service";
import {Connection} from "./connections/connection.interface";
import {Router} from "@angular/router";
import {Subject} from "rxjs/Subject";
import {AuthService} from "../common/services/auth/auth.service";

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  planForm: FormGroup;
  connectionResults$: Subject<Connection[]> = new Subject();
  rankingArray = [];

  constructor(private connectionsService: ConnectionsService, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.planForm = new FormGroup({
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required])
    });
  }

  get startControl() {
    return this.planForm.get('start');
  }

  get endControl() {
    return this.planForm.get('end');
  }

  lookup() {
    this.connectionsService.getConnections(this.startControl.value, this.endControl.value)
      .subscribe((connections: Connection[]) => {
        console.log(connections);
        connections.map((connection) => {
          const counter = Math.round(Math.round(connection.ranking*10)/2);
          this.rankingArray.push(this.createArray(counter));
        })
        this.connectionResults$.next(connections);
      });
  }

  createArray(counter) {
    const foo = [];

    for (let i = 1; i <= counter; i++) {
      foo.push(i);
    }
    return foo;
  }

  choose(connection: Connection) {
    const userId = this.authService.userProfile$.getValue().sub;
    console.log('[PlanComponent] choose', connection, userId);

    this.connectionsService.saveConnection(userId, connection).subscribe();
  }
}
