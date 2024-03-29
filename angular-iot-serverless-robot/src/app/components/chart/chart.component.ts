import { AfterViewInit, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Chart, registerables } from 'chart.js';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit {
  roomId: string = '';
  player: any[] = [];

  constructor(
    private roomsService: RoomsService,
    private router: ActivatedRoute
  ) {}

  async ngAfterViewInit()  {
    this.initChartData();
  }

  initChartData() {
    console.log("init charts")
    this.router.params.subscribe((params: Params) => {
      this.roomId = params['id'];
    });
    console.log(this.roomId)
    this.roomsService.getRoomById(this.roomId).subscribe({
      next: (data: any) => {
        console.log("I am here")
        console.log(data);
        for (let i = 0; i < 4; i++) {
          let rightMotorSpeed: number[] = [];
          let rightMotorDirection: number[] = [];
          let leftMotorSpeed: number[] = [];
          let leftMotorDirection: number[] = [];
          let servoAngle: number[] = [];
          data.members[i].movements.forEach((element: any) => {
            rightMotorSpeed.push(element.rightMotorSpeed);
            rightMotorDirection.push(element.rightMotorDirection);
            leftMotorSpeed.push(element.leftMotorSpeed);
            leftMotorDirection.push(element.leftMotorDirection);
            servoAngle.push(element.servoAngle);
          });

          this.player.push([
            rightMotorSpeed,
            rightMotorDirection,
            leftMotorSpeed,
            leftMotorDirection,
            servoAngle,
          ]);
        }
        Chart.register(...registerables);

        const chartRightMotor1 = new Chart(
          document.getElementById('chartRightMotor1') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Motor Derecho',
                  data: this.player[0][0],
                },
                {
                  label: 'Direccion del motor',
                  data: this.player[0][1],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );
        const chartLeftMotor1 = new Chart(
          document.getElementById('chartLeftMotor1') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Motor Izquierdo',
                  data: this.player[0][2],
                },
                {
                  label: 'Direccion del motor',
                  data: this.player[0][3],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );
        const chartServoAngle1 = new Chart(
          document.getElementById('chartServoAngle1') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Control Servo',
                  data: this.player[0][4],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );

        //PLAYER 2
        const chartRightMotor2 = new Chart(
          document.getElementById('chartRightMotor2') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Motor Derecho',
                  data: this.player[1][0],
                },
                {
                  label: 'Direccion del motor',
                  data: this.player[1][1],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );
        const chartLeftMotor2 = new Chart(
          document.getElementById('chartLeftMotor2') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Motor Izquierdo',
                  data: this.player[1][2],
                },
                {
                  label: 'Direccion del motor',
                  data: this.player[1][3],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );
        const chartServoAngle2 = new Chart(
          document.getElementById('chartServoAngle2') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Control Servo',
                  data: this.player[1][4],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );

        //PLAYER
        const chartRightMotor3 = new Chart(
          document.getElementById('chartRightMotor3') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Motor Derecho',
                  data: this.player[2][0],
                },
                {
                  label: 'Direccion del motor',
                  data: this.player[2][1],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );
        const chartLeftMotor3 = new Chart(
          document.getElementById('chartLeftMotor3') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Motor Izquierdo',
                  data: this.player[2][2],
                },
                {
                  label: 'Direccion del motor',
                  data: this.player[2][3],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );
        const chartServoAngle3 = new Chart(
          document.getElementById('chartServoAngle3') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Control Servo',
                  data: this.player[2][4],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );

        //PLAYER 4
        const chartRightMotor4 = new Chart(
          document.getElementById('chartRightMotor4') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Motor Derecho',
                  data: this.player[3][0],
                },
                {
                  label: 'Direccion del motor',
                  data: this.player[3][1],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );
        const chartLeftMotor4 = new Chart(
          document.getElementById('chartLeftMotor4') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Motor Izquierdo',
                  data: this.player[3][2],
                },
                {
                  label: 'Direccion del motor',
                  data: this.player[3][3],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );
        const chartServoAngle4 = new Chart(
          document.getElementById('chartServoAngle4') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'Control Servo',
                  data: this.player[3][4],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
