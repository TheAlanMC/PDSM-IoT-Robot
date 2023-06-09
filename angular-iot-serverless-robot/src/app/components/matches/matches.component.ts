import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss', './matches.component.css'],
})
export class MatchesComponent implements OnInit {
  matches: any[] = [];

  constructor(private router: Router, private roomsService: RoomsService) {}

  ngOnInit(): void {
    this.roomsService.getRooms().subscribe((rooms: any) => {
      console.log('rooms', rooms);
      this.matches = rooms;
    });
  }

  viewMatchDetails(roomId: number) {
    console.log('viewMatchDetails', roomId);
    this.router.navigate(['/matches', roomId]);
  }
}
