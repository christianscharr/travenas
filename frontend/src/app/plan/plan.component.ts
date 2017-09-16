import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConnectionsService} from "./connections/connections.service";
import {Connection, Connections} from "./connections/connection.interface";
import {Router} from "@angular/router";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  planForm: FormGroup;
  connectionResults$: Subject<Connection[]> = new Subject();

  constructor(private connectionsService: ConnectionsService, private router: Router) {
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
        this.connectionResults$.next(connections);
      });
  }

  choose(connection: Connection) {
    console.log('[PlanComponent] choose', connection);
  }
}
