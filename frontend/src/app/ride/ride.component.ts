import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../common/services/auth/auth.service";
import {FormControl, FormGroup} from "@angular/forms";
import {isNullOrUndefined} from "util";
import * as SendBird from "sendbird/sendbird.min";
import {Subject} from "rxjs/Subject";
import {CheckinService} from "../common/services/checkin/checkin.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ride',
  templateUrl: './ride.component.html',
  styleUrls: ['./ride.component.css']
})
export class RideComponent implements OnInit, OnDestroy {
  private SENDBIRD_APP_ID: string = 'F5382E02-4083-4C36-99CC-E4181584CDD8';
  private sb = new SendBird({'appId': this.SENDBIRD_APP_ID});

  stationChatForm: FormGroup;
  private handlerIDs: Array<string> = [];
  private messageStream$: Subject<string> = new Subject();

  private tripStatus = null;
  private newScore = null;

  constructor(private authService: AuthService, private checkinService: CheckinService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.tripStatus = params['status'];
        this.newScore = params['score'];
      });

    this.stationChatForm = new FormGroup({
      'stationMessages': new FormControl('', []),
      'stationMessage': new FormControl('', [])
    });

    this.authService.userProfile$.subscribe((userProfil) => {
      if (userProfil === null) {
        return;
      }

      this.subscribeToStationChat(userProfil);
    });
  }

  subscribeToStationChat(userProfil) {
    this.sb.connect(userProfil.sub, (user, err) => {
      if (!isNullOrUndefined(err)) {
        console.error('[RideComponent] connect failed, try again', err);
        this.subscribeToStationChat(userProfil);
        return;
      }

      console.log(`StationChannelUrl: ${CheckinService.StationChannelUrl}`);

      this.sb.OpenChannel.getChannel(CheckinService.StationChannelUrl, (channel, error) => {
        if (error) {
          console.error('[RideComponent] get channel failed, try again', error);
          this.subscribeToStationChat(userProfil);
          return;
        }

        channel.enter((response, error) => {
          if (error) {
            console.error('[RideComponent] enter channel failed, try again', error);
            this.subscribeToStationChat(userProfil);
            return;
          }

          this.messageStream$.subscribe((msg: string) => {
            channel.sendUserMessage(msg, (message, error) => {
              if (!isNullOrUndefined(error)) {
                console.error(error);
                return;
              }

              console.log('successfully send a message');
            });
          });

          const stationChannelHandler = new this.sb.ChannelHandler();

          stationChannelHandler.onMessageReceived = function(channel, message){
            console.log(channel, message);
          };

          this.sb.addChannelHandler(channel.name + "_" + userProfil.sub, stationChannelHandler);
        });
      });
    });
  }

  get stationMessagesControl() {
    return this.stationChatForm.get('stationMessages');
  }

  get stationMessageControl() {
    return this.stationChatForm.get('stationMessage');
  }

  ngOnDestroy(): void {
    this.handlerIDs.map((item) => {
      this.sb.removeChannelHandler(item);
    })
  }

  sendStationMessage() {
    const msg: string =  this.stationMessageControl.value;
    this.messageStream$.next(msg);
  }
}
