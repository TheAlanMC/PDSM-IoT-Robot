import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import {WebsocketService} from "../../services/websocket.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {RoomsService} from "../../services/rooms.service";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: any[] = [];
  constructor(private http: HttpClient, private webSocketService: WebsocketService,
              private router: Router, private roomsService: RoomsService) {
  }

  ngOnInit(): void {
    this.getRooms()
  }

  getRooms() {
    console.log('getting rooms')
    this.roomsService.getRooms().subscribe({
      next: (response: any) => {
        console.log(response)
        this.rooms = response
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  createRoom() {
    const roomName = prompt("Ingresa el nombre de la sala")
    if (roomName) {
      const password = prompt("Ingresa la contraseña de la sala")
      if (password) {
        this.webSocketService.createRoom(roomName, password)
      }
    }
  }

  joinRoom(roomId: string) {
    const password = prompt("Ingresa la contraseña de la sala")
    if (password) {
      this.webSocketService.joinRoom(roomId, password)
    }
  }
}
