import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RobotService {

  constructor(private http: HttpClient) {
  }

  public updateRobotDcMotor(ip: string, rightMotorDirection: number, rightMotorSpeed: number, leftMotorDirection: number, leftMotorSpeed: number) {
    return this.http.post(`http://${ip}/robot/dc-motors?rightMotorDirection=${rightMotorDirection}&rightMotorSpeed=${rightMotorSpeed}&leftMotorDirection=${leftMotorDirection}&leftMotorSpeed=${leftMotorSpeed}`, {}, {responseType: 'text'});
  }
  public updateServoMotor(ip: string, servoAngle: number) {
    return this.http.post(`http://${ip}/robot/servo?servoAngle=${servoAngle}`, {}, {responseType: 'text'});
  }
}
