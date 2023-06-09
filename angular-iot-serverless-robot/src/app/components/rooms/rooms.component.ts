import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import {WebsocketService} from "../../services/websocket.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: any[] = [];
  constructor(private http: HttpClient, private webSocketService: WebsocketService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getRooms()
  }
  getRooms() {
    console.log('getting rooms')
    this.http.get<any>('https://dz40eacaqk.execute-api.us-east-1.amazonaws.com/dev/rooms').subscribe(
      response => {
        console.log(response)
        this.rooms = response;
      },
      error => {
        console.error('Error retrieving available robots:', error);
      }
    );
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
}
