// arduino-iot-serverless-robot
// Swarm Robot Network
// Final Project SIS-234  
// 
// Apaza Aguilar Chris Alan
// Belmonte Cervero Sebastian Francisco
// Illanes Bequer Ignacio Andres
// Vladislavic Nolasco Radomir Luis

#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h>
#include <Servo.h> 
#include "config.h"

// Define Pins
#define PWM_MOTOR_A 5
#define PWM_MOTOR_B 4
#define DIR_MOTOR_A 0
#define DIR_MOTOR_B 2

// Robot Information
String ipAddress = "";
String hostname = "";
int isRobotEnabled = 1;
int isRobotAvailable = 0;

// Fingerprint for AWS IoT
const uint8_t fingerprint[20] = {0x94, 0xDF, 0xE5, 0xC5, 0x5E, 0x3C, 0x24, 0x0A, 0xEA, 0x10, 0x9C, 0xAA, 0xFF, 0x44, 0x89, 0xF8, 0x4C, 0x81, 0xF6, 0x13};

String registerUrl = "https://yzq79m7h4d.execute-api.us-east-1.amazonaws.com/dev/robot/register";
// Define Servo
Servo servo; 

// DC Motors
int rightMotorDirection = 0;
int rightMotorSpeed = 0;
int leftMotorDirection = 0;
int leftMotorSpeed = 0;
int updateDcMotors = 0;

// Servo
int servoAngle = 0;
int updateServo = 0;

// Creamos el servidor AsyncWebServer en el puerto 80
AsyncWebServer server(80);

void setup() {
  initRobot();
  Serial.begin(115200);
  initWiFi();
  registerRobot();
  // Ruta para actualizar el estado de los motores, enviado como JSON
  server.on("/robot/dc-motors", HTTP_POST, [](AsyncWebServerRequest *request){
            rightMotorDirection = request->arg("rightMotorDirection").toInt();
            rightMotorSpeed = request->arg("rightMotorSpeed").toInt();
            leftMotorDirection = request->arg("leftMotorDirection").toInt();
            leftMotorSpeed = request->arg("leftMotorSpeed").toInt();
            updateDcMotors = 1;
            request->send(200, "text/plain", "OK");
            });
  // Ruta para actualizar el estado del servo, enviado como JSON
  server.on("/robot/servo", HTTP_POST, [](AsyncWebServerRequest *request){
            servoAngle = request->arg("servoAngle").toInt();
            updateServo = 1;
            request->send(200, "text/plain", "OK");
            });
  // Ruta para habiltiar el robot
  server.on("/robot/status", HTTP_POST, [](AsyncWebServerRequest *request){
            isRobotEnabled = request->arg("isRobotEnabled").toInt();
            request->send(200, "text/plain", "OK");
            });
  server.onNotFound([](AsyncWebServerRequest *request) {
  if (request->method() == HTTP_OPTIONS) {
    request->send(200);
  } else {
    request->send(404);
  }});
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "*");
  server.begin();
}

void loop() {
  // Do nothing if robot is not enabled
  if ((isRobotEnabled == 0) || (isRobotAvailable == 0)){
    return;
  }

  // Update dc motors
  if (updateDcMotors == 1) {
    updateDcMotors = 0;
    digitalWrite(DIR_MOTOR_A, rightMotorDirection);
    analogWrite(PWM_MOTOR_A, rightMotorSpeed);
    digitalWrite(DIR_MOTOR_B, leftMotorDirection);
    analogWrite(PWM_MOTOR_B, leftMotorSpeed);
    }

  // Update servo
  if (updateServo == 1) {
    updateServo = 0;
    Serial.println(servoAngle);
    servo.write(servoAngle);
  }

}


void initWiFi(){
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.print("Connected to WiFi, IP address: ");
  Serial.println(WiFi.localIP());
  ipAddress = WiFi.localIP().toString();
  hostname = String(WiFi.SSID());
}

void registerRobot() {
  Serial.println("Registering robot...");
  // Create JSON payload
  StaticJsonDocument<200> doc;
  String payload;
  int httpCode;
  doc["robotIp"] = ipAddress;
  doc["networkName"] = hostname;
  serializeJson(doc, payload);
  Serial.println(payload);
  // Create HTTPS client
  WiFiClientSecure client;
  client.setFingerprint(fingerprint);
  HTTPClient https;
  https.begin(client, registerUrl);
  https.addHeader("Content-Type", "application/json");
  httpCode = https.POST(payload);
  if (httpCode > 0) {
    Serial.printf("[HTTP] POST... code: %d\n", httpCode);
    if (httpCode == HTTP_CODE_OK) {
      String payload = https.getString();
      Serial.println(payload);
      isRobotAvailable = 1;
    }
  } else {
    Serial.printf("[HTTP] POST... failed, error: %s\n", https.errorToString(httpCode).c_str());
  }
  https.end();
}

void initRobot() {
  // Define pins for DC motors
  pinMode(PWM_MOTOR_A, OUTPUT);
  pinMode(PWM_MOTOR_B, OUTPUT);
  pinMode(DIR_MOTOR_A, OUTPUT);
  pinMode(DIR_MOTOR_B, OUTPUT);
  // Initialize servo
  servo.attach(13); 
  servo.write(90);
  // Initialize DC motors
  digitalWrite(DIR_MOTOR_A, LOW);
  analogWrite(PWM_MOTOR_A, 0);
  digitalWrite(DIR_MOTOR_B, LOW);
  analogWrite(PWM_MOTOR_B, 0);
}

