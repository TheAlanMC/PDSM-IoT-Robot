import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
})
export class MatchesComponent implements OnInit {
  matches: any[] = [
    {
      roomId: 1,
      members: [
        {
          connectionId: 'CONNECTION_ID_1',
          isHost: false,
          isReady: false,
          userName: 'USER_NAME_1',
        },
        {
          connectionId: 'CONNECTION_ID_2',
          isHost: true,
          isReady: false,
          userName: 'USER_NAME_2',
        },
      ],
      password: 'PASSWORD',
      roomName: 'ROOM_NAME',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  viewMatchDetails(roomId: number) {
    console.log('viewMatchDetails', roomId);
    this.router.navigate(['/matches', roomId]);
  }
}
