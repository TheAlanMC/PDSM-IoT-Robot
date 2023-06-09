import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private movementsUrl = environment.movementsUrl;

  constructor(private http: HttpClient) {}

  getMovements() {
    return this.http.get(this.movementsUrl);
  }
}
