import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from 'src/app/services/websocket.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-robots',
  templateUrl: './robots.component.html',
  styleUrls: ['./robots.component.scss']
})
export class RobotsComponent implements OnInit {
  availableRobots: any[] = [];

  constructor(private http: HttpClient, private webSocketService: WebsocketService,
              private router: Router) { }

  ngOnInit(): void {
    this.getAvailableRobots();
  }

  getAvailableRobots(): void {
    this.http.get<any>('https://dz40eacaqk.execute-api.us-east-1.amazonaws.com/dev/robot/available').subscribe(
      response => {
        this.availableRobots = response.data;
      },
      error => {
        console.error('Error retrieving available robots:', error);
      }
    );
  }

  onSelectedRobot(robot: any): void {
    console.log('Selected robot:', robot);
    const user = sessionStorage.getItem('user');
    this.webSocketService.setUser(user!, robot.robotId);
    sessionStorage.setItem('robotIp', robot.robotIp)
    this.router.navigate(['/rooms']);
  }
}
