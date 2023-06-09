import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { SetUserDtoWs } from "../models/set.user.dto.ws";
import { CreateRoomDtoWs } from "../models/create.room.dto.ws";
import { JoinRoomDtoWs } from "../models/join.room.dto.ws";
import {Router} from "@angular/router";

export interface Message {
  action: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private wsUrl = environment.wsUrl;
  private socket$!: WebSocketSubject<any>;

  constructor(private router: Router) {
  }

  public connect(): void {
    console.log('connect')
    if(!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(this.wsUrl);

      this.socket$.subscribe((data: any) => {
        console.log(data);
        if(data.type === 'room-info') {
          this.router.navigate([`/rooms/${data.message}`]);
        }
      });
    }
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
