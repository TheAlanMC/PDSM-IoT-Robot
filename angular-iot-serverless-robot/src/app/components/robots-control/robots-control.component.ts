import {Component, OnInit, ViewChild} from '@angular/core';
import { JoystickEvent, NgxJoystickComponent } from 'ngx-joystick';
import { JoystickManagerOptions, JoystickOutputData } from 'nipplejs';
import {RobotService} from "../../services/robot.service";

@Component({
  selector: 'app-robots-control',
  templateUrl: './robots-control.component.html',
  styleUrls: ['./robots-control.component.scss']
})
export class RobotsControlComponent implements OnInit {
  ip : string = '';

  rightMotorDirection : number = 0;
  leftMotorDirection : number = 0;
  rightMotorSpeed : number = 0;
  leftMotorSpeed : number = 0;

  @ViewChild('motorJoystick') motorJoystick!: NgxJoystickComponent;

  staticOptions: JoystickManagerOptions = {
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'blue',
  };

  motorOutputData!: JoystickOutputData;
  interactingMotor!: boolean;
  isPressed = false;

  constructor(private robotService: RobotService) {}

  ngOnInit() {
    this.startInterval();
    this.ip = sessionStorage.getItem('robotIp') || '';
  }

  setServo(value: number) {
    this.isPressed = !this.isPressed;
    this.robotService.updateServoMotor(this.ip, value).subscribe();
  }

  onStartMotor(event: JoystickEvent) {
    this.interactingMotor = true;
  }

  onEndMotor(event: JoystickEvent) {
    this.interactingMotor = false;
    this.rightMotorSpeed = 0;
    this.leftMotorSpeed = 0;
    this.rightMotorDirection = 0;
    this.leftMotorDirection = 0;
  }

  onMoveMotor(event: JoystickEvent) {
    this.motorOutputData = event.data;
    const direction = this.motorOutputData.direction ? this.motorOutputData.direction.angle : '';
    const speed = this.motorOutputData.distance ? this.motorOutputData.distance : 0;
    this.rightMotorSpeed = parseInt(speed.toString())
    this.leftMotorSpeed = parseInt(speed.toString())
    if (direction === 'up') {
      this.rightMotorDirection = 1;
      this.leftMotorDirection = 1;
      this.rightMotorSpeed = this.rightMotorSpeed * 4;
      this.leftMotorSpeed = this.leftMotorSpeed * 4;
    } else if (direction === 'down') {
      this.rightMotorDirection = 0;
      this.leftMotorDirection = 0;
      this.rightMotorSpeed = this.rightMotorSpeed * 4;
      this.leftMotorSpeed = this.leftMotorSpeed * 4;
    } else if (direction === 'left') {
      this.rightMotorDirection = 1;
      this.leftMotorDirection = 0;
      this.rightMotorSpeed = this.rightMotorSpeed * 4;
      this.leftMotorSpeed = this.leftMotorSpeed * 4;
    } else if (direction === 'right') {
      this.rightMotorDirection = 0;
      this.leftMotorDirection = 1;
      this.rightMotorSpeed = this.rightMotorSpeed * 5;
      this.leftMotorSpeed = this.leftMotorSpeed * 5;
    }
  }

  startInterval() {
    setInterval(() => {
      this.robotService.updateRobotDcMotor(this.ip, this.rightMotorDirection, this.rightMotorSpeed, this.leftMotorDirection, this.leftMotorSpeed)
        .subscribe((response: any) => {
            // console.log(response);
          }
        );
    }, 100);
  }
}
