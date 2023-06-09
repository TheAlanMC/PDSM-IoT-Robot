import { Component, OnInit } from '@angular/core';
import {WebsocketService} from "../../services/websocket.service";
import {ActivatedRoute} from "@angular/router";
import {MovementsService} from "../../services/movements.service";
import {RoomsService} from "../../services/rooms.service";

@Component({
  selector: 'app-room-home',
  templateUrl: './room-home.component.html',
  styleUrls: ['./room-home.component.scss']
})
export class RoomHomeComponent implements OnInit {

  joinMessages: any[] = [];
  members: any[] = [];
  roomId: string;
  isDisabled = false;

  constructor(
    private websocketService: WebsocketService,
    private activatedRoute: ActivatedRoute,
    private roomsService: RoomsService
  ) {
    this.roomId = this.activatedRoute.snapshot.paramMap.get('id')!;
    sessionStorage.setItem('roomId', this.roomId);
  }

  ngOnInit(): void {
    this.websocketService.getMessageObservable().subscribe((message) => {
      this.joinMessages.push(message);
      console.log(message);
      this.members.push({
        userName: message.message.split(' ingresó')[0],
        isReady: false
      })
    })
    this.websocketService.getReadyObservable().subscribe((message) => {
      if(message.startGame) {
        this.members = this.members.map((member) => {
          member.isReady = true;
          return member;
        });
        this.startGame();
      } else {
        this.members = this.members.map((member) => {
          if(member.userName === message.userName) {
            member.isReady = message.isReady;
          }
          return member;
        });
      }
    })
    this.roomsService.getRoomById(this.roomId).subscribe({
      next: (response: any) => {
        this.members = response.members;
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  setReady(isReady: boolean) {
    this.websocketService.setReady(isReady, this.roomId);
  }

  startGame() {
    this.isDisabled = true;
    let currVal = 5;
    const interval = setInterval(() => {
      if(currVal === -1) {
        clearInterval(interval);
        return;
      }
      this.joinMessages = [
        ...this.joinMessages,
        {
          message: 'El juego comenzará en ' + currVal,
          timestamp: new Date()
        }
      ]
      currVal--;
    }, 1000);
  }
}
