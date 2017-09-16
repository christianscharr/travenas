import { Injectable, OnDestroy } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import * as SendBird from "sendbird/SendBird.min";
import {isNullOrUndefined} from "util";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import "rxjs/add/operator/catch";

@Injectable()
export class ChatService implements OnDestroy{
  ngOnDestroy(): void {
    ChatService.handlerIDs.map((item) => {
      ChatService.sendBird.removeChannelHandler(item);
    })

  }

  private static APP_ID: string = 'F5382E02-4083-4C36-99CC-E4181584CDD8';
  private static sendBird;
  private static connected = false;
  private static joinedChannels: Array<any> = [];
  private static handlerIDs: Array<string> = [];

  constructor(private authService: AuthService) {
    ChatService.sendBird = new SendBird({'appId': ChatService.APP_ID});
  }

  private connect(): Observable<any> {
    return Observable.create((obs: Observer<any>) => {
      if (!this.authService.isAuthenticated()) {
        console.error('User must be logged in to use the chat service!');
        obs.error('User must be logged in to use the chat service!');
        return;
      }

      ChatService.sendBird.connect(this.authService.userProfile$.getValue().sub, (user, err) => {
        if (!isNullOrUndefined(err)) {
          console.error(err);
          obs.error(err);
          return;
        }

        ChatService.connected = true;

        ChatService.sendBird.updateCurrentUserInfo(this.authService.userProfile$.getValue().nickname, null, function (response, error) {
          console.log(response, error);
        });

        obs.next(user);
        obs.complete();
      });
    });
  }

  public sendMessage(message: string, channel: string): Observable<any> {
    return Observable.create((obs: Observer<any>) => {
      if (!ChatService.connected) {
        this.connect()
          .subscribe((user) => {
            this.enterChannel(channel)
              .subscribe((channel) => {
                channel.sendUserMessage(message, {}, 'webchat', function (message, error) {
                  if (error) {
                    console.error(error);
                    obs.error(error);
                    return;
                  }

                  obs.next(true);
                  obs.complete();
                });
              });
          });
      } else {
        this.enterChannel(channel)
          .subscribe((channel) => {
            channel.sendUserMessage(message, {}, 'webchat', function (message, error) {
              if (error) {
                console.error(error);
                obs.error(error);
                return;
              }

              obs.next(true);
              obs.complete();
            });
          });
      }
    });
  }

  public enterChannel(channel: string): Observable<any> {
    return Observable.create((obs: Observer<any>) => {
      if (!ChatService.connected) {
        this.connect()
          .subscribe((user) => {
            ChatService.sendBird.OpenChannel.getChannel(channel, function (channel, error) {
              if (error) {
                console.error(error);
                obs.error(error);
                return;
              }

              channel.enter(function (response, error) {
                if (error) {
                  console.error(error);
                  obs.error(error);
                  return;
                }

                const ChannelHandler = new ChatService.sendBird.ChannelHandler();

                ChannelHandler.onMessageReceived = function(channel, message){
                  // do something...
                  console.log('recieving messages !!! ', channel, message);

                  // channel.sendUserMessage('hhhhhaaallll', function(message, error){
                  //   if (error) {
                  //     console.error(error);
                  //
                  //     return;
                  //   }
                  //
                  //   // onSent
                  //   console.log('sending messages !!', message);
                  // });


                };
                console.log('addChannelHandler done  ', channel);
                const uniqueHandlerId = channel.url + user;
                ChatService.sendBird.addChannelHandler(uniqueHandlerId, ChannelHandler);
                ChatService.handlerIDs.push(uniqueHandlerId);
                ChatService.joinedChannels.push(channel);
                obs.next(channel);
                obs.complete();
              });
            });
          });
      } else {
        ChatService.sendBird.OpenChannel.getChannel(channel, function (channel, error) {
          if (error) {
            console.error(error);
            obs.error(error);
            return;
          }

          channel.enter(function (response, error) {
            if (error) {
              console.error(error);
              obs.error(error);
              return;
            }

            obs.next(channel);
            obs.complete();
          });
        });
      }
    });
  }

  public leaveChannel(channel: string): Observable<any> {
    return Observable.create((obs: Observer<any>) => {
      if (!ChatService.connected) {
        obs.complete();
        return;
      }

      ChatService.sendBird.OpenChannel.getChannel(channel, function (channel, error) {
        if (error) {
          console.error(error);
          obs.error(error);
          return;
        }

        channel.leave(function (response, error) {
          if (error) {
            console.error(error);
            obs.error(error);
            return;
          }

          obs.next(channel);
          obs.complete();
        });
      });
    });
  }

  static get channels() {
    return ChatService.joinedChannels;
  }
}
