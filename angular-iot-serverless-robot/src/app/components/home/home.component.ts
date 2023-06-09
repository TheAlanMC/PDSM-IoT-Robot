import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {WebsocketService} from "../../services/websocket.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private websocketService: WebsocketService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required]
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }
    const username = this.loginForm.value.username;
    sessionStorage.setItem('user', username);
    this.router.navigate(['/robots'])
  }

  ngOnInit() {
    this.websocketService.connect();
  }
}
