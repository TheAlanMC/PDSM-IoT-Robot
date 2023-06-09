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
  readyMessages: any[] = [];
  roomId: string;

  constructor(
    private websocketService: WebsocketService,
    private activatedRoute: ActivatedRoute,
    private roomsService: RoomsService
  ) {
    this.roomId = this.activatedRoute.snapshot.paramMap.get('id')!;
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
      this.members = this.members.map((member) => {
        if(member.userName === message.userName) {
          member.isReady = message.isReady;
        }
        return member;
      });
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

}
