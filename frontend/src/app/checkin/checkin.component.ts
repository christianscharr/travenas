import {Component, OnInit} from '@angular/core';
import {ChatService} from "../common/services/chat/chat.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CheckinService} from "../common/services/checkin/checkin.service";
import {isNullOrUndefined} from "util";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/empty";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
  checkinForm: FormGroup;

  constructor(private chatService: ChatService, private checkinService: CheckinService, private route: ActivatedRoute, private router: Router) {
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
        const routeId = route[0]['route'];
        this.checkinService.checkIn(this.stationControl.value, routeId).subscribe((data: any) => {
          this.chatService.enterChannel(data.RouteUrl)
            .catch((err) => {
              console.error("Error occured while joining channels, retry...", err);
              this.doCheckIn();
              return Observable.empty();
            })
            .subscribe((channel) => {
              console.log('[CheckinComponent] Channel beigetreten', channel);
            });

          this.chatService.enterChannel(data.StationUrl)
            .catch((err) => {
              console.error("Error occured while joining channels, retry...", err);
              this.doCheckIn();
              return Observable.empty();
            })
            .subscribe((channel) => {
              console.log('[CheckinComponent] Channel beigetreten', channel);
              this.router.navigate(['ride']);
            });
        });
      }
    });
  }
}
