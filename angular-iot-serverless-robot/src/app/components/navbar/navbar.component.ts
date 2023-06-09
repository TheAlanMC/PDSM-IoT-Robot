import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  date: Date = new Date();
  constructor() {
    setInterval(() => {
      this.date = new Date();
    }, 1000)
  }

  ngOnInit(): void {
  }

  protected readonly Date = Date;
}
