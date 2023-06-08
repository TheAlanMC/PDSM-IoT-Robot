import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import {WebsocketService} from "../../services/websocket.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  userForm: FormGroup;
  createRoomForm: FormGroup;
  joinRoomForm: FormGroup;
  setReadyForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private websocketService: WebsocketService,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      user: ['', Validators.required],
    });
    this.createRoomForm = this.formBuilder.group({
      roomName: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.joinRoomForm = this.formBuilder.group({
      roomId: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.setReadyForm = this.formBuilder.group({
      roomId: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    // this should be done only once
    this.websocketService.connect();
  }

  setUser() {
    const user = this.userForm.get('user')?.value;
    this.websocketService.setUser(user, 'not a robot xd');
  }

  createRoom() {
    const roomName = this.createRoomForm.get('roomName')?.value;
    const password = this.createRoomForm.get('password')?.value;
    this.websocketService.createRoom(roomName, password);
  }

  joinRoom() {
    const roomId = this.joinRoomForm.get('roomId')?.value;
    const password = this.joinRoomForm.get('password')?.value;
    this.websocketService.joinRoom(roomId, password);
  }

  setReady(isReady: boolean) {
    const roomId = this.setReadyForm.get('roomId')?.value;
    this.websocketService.setReady(isReady, roomId);
  }
}
