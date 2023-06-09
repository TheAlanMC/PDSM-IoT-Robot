import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private roomsUrl = `${environment.baseUrl}/rooms`;
  constructor(private http: HttpClient) {
  }

  getRooms() {
    return this.http.get(this.roomsUrl);
  }

  getRoomById(roomId: string) {
    return this.http.get(`${this.roomsUrl}?roomId=${roomId}`);
  }
}
