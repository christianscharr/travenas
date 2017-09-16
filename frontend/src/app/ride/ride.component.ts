import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../common/services/auth/auth.service";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {Subject} from "rxjs/Subject";
import {CheckinService} from "../common/services/checkin/checkin.service";
import {ActivatedRoute} from '@angular/router';
import io from 'socket.io-client';
import {environment} from "../../environments/environment";
import {isNullOrUndefined} from "util";
import {GameField} from "./GameField";
import "rxjs/add/operator/debounceTime";

@Component({
  selector: 'app-ride',
  templateUrl: './ride.component.html',
  styleUrls: ['./ride.component.css']
})
export class RideComponent implements OnInit, OnDestroy {
  stationChatForm: FormGroup;
  routeChatForm: FormGroup;

  private socketIO;
  private stationRoom: string;
  private routeRoom: string;

  private messageStation$: Subject<string> = new Subject();
  private messageRoute$: Subject<string> = new Subject();
  private gameField$: Subject<GameField[][]> = new Subject();
  private gameAction$: Subject<any> = new Subject();

  private tripStatus = null;
  private newScore = null;

  private won$: Subject<boolean> = new Subject();

  constructor(private authService: AuthService, private checkinService: CheckinService, private route: ActivatedRoute) {
  }

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

    this.routeChatForm = new FormGroup({
      'routeMessages': new FormControl('', []),
      'routeMessage': new FormControl('', [])
    });

    this.authService.userProfile$.subscribe((userProfil) => {
      if (userProfil === null || !isNullOrUndefined(this.socketIO)) {
        return;
      }

      this.stationRoom = 'Station ' + CheckinService.STATION_ID;
      this.routeRoom = 'Route ' + CheckinService.ROUTE_ID;

      this.socketIO = io(environment.production === false ? 'http://localhost:3000' : 'http://travenas.com');

      this.socketIO.emit('room', {
        room: this.stationRoom,
        userId: userProfil.sub
      });

      this.socketIO.on('message', (msg) => {
        this.stationMessagesControl.patchValue(this.stationMessagesControl.value + "\n"
          + '[' + msg.userId + ']: ' + msg.txt);
      });

      this.socketIO.emit('room', {
        room: this.routeRoom,
        userId: userProfil.sub
      });

      this.socketIO.on('message', (msg) => {
        this.routeMessagesControl.patchValue(this.routeMessagesControl.value + "\n"
          + '[' + msg.userId + ']: ' + msg.txt);
      });

      this.socketIO.on('game', (msg) => {
        console.log("Got update game data from server!");

        if (msg.win === true && msg.winner === userProfil.sub) {
          this.won$.next(true);
        }

        this.gameField$.next(msg.gameField);
      });

      this.messageRoute$.subscribe((msg) => {
        this.socketIO.emit("message", {
          txt: msg,
          userId: userProfil.sub
        });
      });

      this.messageStation$.subscribe((msg) => {
        this.socketIO.emit("message", {
          txt: msg,
          userId: userProfil.sub
        });
      });

      this.gameAction$
        .debounceTime(500)
        .subscribe((action) => {
        console.log("Got game action!");

        this.socketIO.emit("game", {
          flip: {
            x: action.posX,
            y: action.posY
          },
          userId: userProfil.sub,
          room: this.routeRoom
        });
      })
    });
  }

  ngOnDestroy() {
  }

  get stationMessageControl(): AbstractControl {
    return this.stationChatForm.get('stationMessage');
  }

  get stationMessagesControl(): AbstractControl {
    return this.stationChatForm.get('stationMessages');
  }

  get routeMessageControl(): AbstractControl {
    return this.routeChatForm.get('routeMessage');
  }

  get routeMessagesControl(): AbstractControl {
    return this.routeChatForm.get('routeMessages');
  }

  sendStationMessage() {
    this.messageStation$.next(this.stationMessageControl.value);
  }

  sendRouteMessage() {
    this.messageRoute$.next(this.routeMessageControl.value);
  }

  chooseField(posX: number, posY: number) {
    console.log("GameAction: " + posX + " " + posY);

    this.gameAction$.next({
      posX: posX,
      posY: posY
    });
  }
}
