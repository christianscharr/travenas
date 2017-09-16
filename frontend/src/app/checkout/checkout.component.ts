import { Component, OnInit } from '@angular/core';
import {ChatService} from "../common/services/chat/chat.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  doCheckOut() {
    console.log('CheckoutComponent] channels', ChatService.channels);
  }
}
