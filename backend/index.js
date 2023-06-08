const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");

const app = express();

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "YOUR_ACCESS",
  secretAccess: "YOUR_SECRET",
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json());

app.post("/robot/movements", (req, res) => {
  const body = req.body;
  console.log(body);

  const robotId = body.robotId;
  const x = body.x;
  const y = body.y;
  const matchUUID = body.matchUUID;

  const params = {
    TableName: "robot-movements",
    Item: {
      robotId: robotId,
      x: x,
      y: y,
      matchUUID: matchUUID,
    },
  };

  dynamodb.put(params, (err, _data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Could not insert robot movements" });
    } else {
      res.json({ success: "Robot movements inserted successfully" });
    }
  });
});

app.get("/matches", (_req, res) => {
  const params = {
    TableName: "matches",
  };

  dynamodb.query(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error while fetching DynamoDB");
    } else {
      console.log(data);
      res.send(data);
    }
  });
  //
  // res.send([
  //   {
  //     matchUUID: "1234",
  //     player1: "player1",
  //     player2: "player2",
  //     player1Score: 0,
  //     player2Score: 0,
  //     status: "in_progress",
  //   },
  //   {
  //     matchUUID: "1234",
  //     player1: "player1",
  //     player2: "player2",
  //     player1Score: 0,
  //     player2Score: 0,
  //     status: "in_progress",
  //   },
  // ]);
});

app.get("/matches/:matchUUID", (req, res) => {
  const matchUUID = req.params.matchUUID;

  const params = {
    TableName: "matches",
    KeyConditionExpression: "room = :matchUUID",
    ExpressionAttributeValues: {
      ":matchUUID": matchUUID,
    },
  };

  dynamodb.query(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error while fetching DynamoDB");
    } else {
      console.log(data);
      res.send(data);
    }
  });

  // res.send("ok");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
