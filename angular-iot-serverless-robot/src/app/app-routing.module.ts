import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatchesComponent } from './components/matches/matches.component';
import {HomeComponent} from "./components/home/home.component";
import {RobotsComponent} from "./components/robots/robots.component";
import {RoomsComponent} from "./components/rooms/rooms.component";
import {RoomHomeComponent} from "./components/room-home/room-home.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'robots', component: RobotsComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'rooms/:id', component: RoomHomeComponent },
  { path: 'matches', component: MatchesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
