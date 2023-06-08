import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-robots',
  templateUrl: './robots.component.html',
  styleUrls: ['./robots.component.scss']
})
export class RobotsComponent implements OnInit {
  availableRobots: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getAvailableRobots();
  }

  getAvailableRobots(): void {
    this.http.get<any>('https://8rxyu04881.execute-api.us-east-1.amazonaws.com/dev/robot/available').subscribe(
      response => {
        this.availableRobots = response.data;
      },
      error => {
        console.error('Error retrieving available robots:', error);
      }
    );
  }
}
