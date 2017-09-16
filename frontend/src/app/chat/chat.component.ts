import {Component, OnInit} from '@angular/core';
import * as SendBird from "SendBird";
import {AuthService} from "../common/services/auth.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public sb;
  private static APP_ID: string = 'F5382E02-4083-4C36-99CC-E4181584CDD8';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.sb = new SendBird({'appId': ChatComponent.APP_ID});

    this.sb.start(ChatComponent.APP_ID);
    console.log('Init with SendBird: ', this.sb);
  }

  public enterChat() {
    if (!this.authService.isAuthenticated()) {
      console.error('User must be logged in to use the chat!');
      return;
    }

    this.sb.connect(this.authService.userProfile$.getValue().sub, (user, err) => {
      if (!isNullOrUndefined(err)) {
        console.error(err);
        return;
      }

      console.log('[ChatComponent] user', user);

      this.sb.OpenChannel.createChannel('First Chat Room', 'estchannel_01', 'bllablaaaablla', function (createdChannel, error) {
        if (error) {
          console.error('error:', error);
          return;
        }

        // onCreated
        console.log('createdChannel ', createdChannel);
      });
    });
  }

}
