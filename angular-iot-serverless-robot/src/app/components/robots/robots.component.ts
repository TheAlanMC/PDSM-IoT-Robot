import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-robots',
  templateUrl: './robots.component.html',
  styleUrls: ['./robots.component.scss']
})
export class RobotsComponent implements OnInit {
  availableRobots: any[] = [];

  constructor(private http: HttpClient, private webSocketService: WebsocketService) { }

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

  onSelectedRobot(robot: string): void {
    console.log('Selected robot:', robot);
    const user = sessionStorage.getItem('user');
    this.webSocketService.setUser(user!, robot);
  }
}
