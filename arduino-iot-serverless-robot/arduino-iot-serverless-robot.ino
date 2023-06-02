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
const String robotName = "Robot 1";
String ipAddress = "";
bool isRobotEnabled = false;
bool isRobotAvailable = false;

// Fingerprint for AWS IoT
const uint8_t fingerprint[20] = {0xD2, 0x0E, 0x70, 0x7B, 0xA8, 0x2F, 0xA3, 0xD5, 0xC6, 0xAF, 0xCF, 0x55, 0xF9, 0x79, 0xE5, 0x65, 0xF0, 0x95, 0xFA, 0x04};
String registerUrl = "https://c6od8hlxv0.execute-api.us-west-1.amazonaws.com/dev/robot/register";
// Define Servo
Servo servo; 

// DC Motors
bool rightMotorEnabled = false;
int rightMotorSpeed = 0;
bool leftMotorEnabled = false;
int leftMotorSpeed = 0;
bool updateDcMotors = false;

// Servo
int servoAngle = 0;
bool updateServo = false;

// Creamos el servidor AsyncWebServer en el puerto 80
AsyncWebServer server(80);

//
StaticJsonDocument<200> doc;

void setup() {
  Serial.begin(115200);
  initWiFi();
  initRobot();
  registerRobot();
  // Ruta para actualizar el estado de los motores, enviado como JSON
  server.on("/robot/dc-motors", HTTP_POST, [](AsyncWebServerRequest *request){
            deserializeJson(doc, request->arg("plain"));
            rightMotorEnabled = doc["rightMotorEnabled"];
            rightMotorSpeed = doc["rightMotorSpeed"];
            leftMotorEnabled = doc["leftMotorEnabled"];
            leftMotorSpeed = doc["leftMotorSpeed"];
            updateDcMotors = true;
            request->send(200, "text/plain", "OK");
            });
  // Ruta para actualizar el estado del servo, enviado como JSON
  server.on("/robot/servo", HTTP_POST, [](AsyncWebServerRequest *request){
            deserializeJson(doc, request->arg("plain"));
            servoAngle = doc["servoAngle"];
            updateServo = true;
            request->send(200, "text/plain", "OK");
            });
  // Ruta para habiltiar el robot
  server.on("/robot/status", HTTP_POST, [](AsyncWebServerRequest *request){
            deserializeJson(doc, request->arg("plain"));
            isRobotEnabled = doc["isRobotEnabled"];
            request->send(200, "text/plain", "OK");
            });
  server.begin();
}

void loop() {
  // Do nothing if robot is not enabled
  if (!isRobotEnabled || !isRobotAvailable){
    return;
  }

  // Update dc motors
  if (updateDcMotors) {
    updateDcMotors = false;
    if (rightMotorEnabled) {
      digitalWrite(DIR_MOTOR_A, HIGH);
      analogWrite(PWM_MOTOR_A, rightMotorSpeed);
    } else {
      digitalWrite(DIR_MOTOR_A, LOW);
      analogWrite(PWM_MOTOR_A, 0);
    }
    if (leftMotorEnabled) {
      digitalWrite(DIR_MOTOR_B, HIGH);
      analogWrite(PWM_MOTOR_B, leftMotorSpeed);
    } else {
      digitalWrite(DIR_MOTOR_B, LOW);
      analogWrite(PWM_MOTOR_B, 0);
    }
  }

  // Update servo
  if (updateServo) {
    updateServo = false;
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
}

void registerRobot() {
  Serial.println("Registering robot...");
  // Create JSON payload
  String payload;
  int httpCode;
  doc["robotIp"] = ipAddress;
  doc["robotName"] = robotName;
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
      isRobotAvailable = true;
    }
  } else {
    Serial.printf("[HTTP] POST... failed, error: %s\n", https.errorToString(httpCode).c_str());
  }
  https.end();
}

void initRobot() {
  // Initialize motors
  pinMode(PWM_MOTOR_A, OUTPUT);
  pinMode(PWM_MOTOR_B, OUTPUT);
  pinMode(DIR_MOTOR_A, OUTPUT);
  pinMode(DIR_MOTOR_B, OUTPUT);
  // Initialize servo
  servo.attach(13); //D7
  servo.write(90);
}
