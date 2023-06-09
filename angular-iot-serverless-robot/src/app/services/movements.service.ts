import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private movementsUrl = environment.baseUrl + '/robot/movements';

  constructor(private http: HttpClient) {}

  getMovements() {
    return this.http.get(this.movementsUrl);
  }

  getMovementByRoomId(roomId: string) {
    return this.http.get(`${this.movementsUrl}`);
  }
}
