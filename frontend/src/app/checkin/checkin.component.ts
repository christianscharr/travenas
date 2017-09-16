import {Component, OnInit} from '@angular/core';
import {ChatService} from "../common/services/chat/chat.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import {CheckinService} from "../common/services/checkin/checkin.service";

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
  checkinForm: FormGroup;

  constructor(private chatService: ChatService, private checkinService: CheckinService) {
  }

  ngOnInit() {
    this.checkinForm = new FormGroup({
      'station': new FormControl('', [Validators.required])
    });
  }

  get stationControl() {
    return this.checkinForm.get('station');
  }

  doCheckIn() {
    this.checkinService.getRouteId(this.stationControl.value).subscribe((route) => {

    });

    this.chatService.enterChannel(this.stationControl.value)
      .catch((err) => {
        console.error('[CheckinComponent] doCheckIn()', err);
        return Observable.from([err]);
      })
      .subscribe();
  }
}
