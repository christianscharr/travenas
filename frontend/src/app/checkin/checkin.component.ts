import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CheckinService} from "../common/services/checkin/checkin.service";
import {isNullOrUndefined} from "util";
import "rxjs/add/observable/empty";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
  checkinForm: FormGroup;

  constructor(private checkinService: CheckinService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.checkinForm = new FormGroup({
      'station': new FormControl('', [Validators.required])
    });

    this.route.paramMap.subscribe((params) => {
      const stationId = params.get('stationId');

      if (!isNullOrUndefined(stationId) && stationId.trim().length > 0) {
        this.stationControl.patchValue(stationId);
      }
    });
  }

  get stationControl() {
    return this.checkinForm.get('station');
  }

  doCheckIn() {
    this.checkinService.getRouteId(this.stationControl.value).subscribe((route) => {
      if (!isNullOrUndefined(route) && route.length > 0) {
        CheckinService.ROUTE_ID = route[0]['route'];;
        CheckinService.STATION_ID = this.stationControl.value;

        this.router.navigate(['ride']);
      }
    });
  }
}
