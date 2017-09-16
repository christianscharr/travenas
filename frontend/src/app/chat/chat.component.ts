import { Component, OnInit } from '@angular/core';
import * as SendBird from 'SendBird';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public sb;
  private static APP_ID: string = 'F5382E02-4083-4C36-99CC-E4181584CDD8';
  constructor() { }

  ngOnInit() {
    this.sb = new SendBird({'appId': ChatComponent.APP_ID});
    this.sb.start(ChatComponent.APP_ID);
    console.log('Init with SendBird: ', this.sb);

  }
  public enterChat() {
    this.sb.OpenChannel.createChannel('First Chat Room', 'estchannel_01', 'bllablaaaablla', function(createdChannel, error) {
      if (error) {
        console.error('error:', error);
        return;
      }

      // onCreated
      console.log('createdChannel ', createdChannel);
    });


  }

}
