import {Component, OnInit} from '@angular/core';
import {ChatService} from "../common/services/chat/chat.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
  checkinForm: FormGroup;

  constructor(private chatService: ChatService) {
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
    this.chatService.enterChannel(this.stationControl.value)
      .catch((err) => {
        console.error('[CheckinComponent] doCheckIn()', err);
        return Observable.from([err]);
      })
      .subscribe();
  }
}
