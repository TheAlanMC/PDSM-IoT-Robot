import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchesComponent } from './components/matches/matches.component';
import { HomeComponent } from './components/home/home.component';
import { RobotsComponent } from './components/robots/robots.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RoomHomeComponent } from './components/room-home/room-home.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchesComponent,
    HomeComponent,
    RobotsComponent,
    RoomsComponent,
    RoomHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
