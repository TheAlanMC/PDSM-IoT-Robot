import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { SetUserDtoWs } from "../models/set.user.dto.ws";
import { CreateRoomDtoWs } from "../models/create.room.dto.ws";
import { JoinRoomDtoWs } from "../models/join.room.dto.ws";
import {Router} from "@angular/router";
import {from, Subject} from "rxjs";

export interface Message {
  action: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private wsUrl = environment.wsUrl;
  private socket$!: WebSocketSubject<any>;
  joinSubject = new Subject<any>();
  readySubkect = new Subject<any>();

  constructor(private router: Router) {
  }

  public connect(): void {
    console.log('connect')
    if(!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(this.wsUrl);

      this.socket$.subscribe((data: any) => {
        console.log(data);
        if(data.type === 'room-join') {
          this.router.navigate([`/rooms/${data.message}`]);
        } else if(data.type === 'room-update') {
          this.joinSubject.next({
            message: data.message,
            timestamp: new Date()
          });
        } else if(data.type === 'set-ready') {
          this.readySubkect.next({
            userName: data.userName,
            isReady: data.isReady
          })
        }
      });
    }
  }

  public getMessageObservable() {
    return this.joinSubject.asObservable();
  }

  public getReadyObservable() {
    return this.readySubkect.asObservable();
  }

  setUser(user: string, robot: string) {
    console.log(this.socket$);
    const message: SetUserDtoWs = {
      action: 'setUserRobot',
      user,
      robot
    }
    this.socket$.next(message);
  }

  createRoom(roomName: string, password: string) {
    const message: CreateRoomDtoWs = {
      action: 'createRoom',
      roomName,
      password
    }
    this.socket$.next(message);
  }

  joinRoom(roomId: string, password: string) {
    const message: JoinRoomDtoWs = {
      action: 'joinRoom',
      roomId,
      password
    }
    this.socket$.next(message);
  }

  setReady(isReady: boolean, roomId: string)  {
    const message: any = {
      action: 'setReady',
      isReady,
      roomId
    }
    this.socket$.next(message);
  }


  // to be used on ngOnDestroy
  close() {
    this.socket$.complete();
  }
}
