import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: [
    './match-details.component.scss',
    './match-details.component.css',
  ],
})
export class MatchDetailsComponent implements OnInit {
  roomId: number | null = null;

  constructor(private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.params.subscribe((params: Params) => {
      this.roomId = params['id'];
    });
  }
}
