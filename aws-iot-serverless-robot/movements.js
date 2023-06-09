const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const DynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ROOMS_TABLE;

// POST http://setMovements
// {
//   roomId: 1,
//   userName: "iguiPichi",
//   movements: {
//     rightMotorSpeed: 45,
//     leftMotorSpeed: 45,
//     rightMotorDirection: 1,
//     leftMotorDirection: 1,
//   }
// }

module.exports.setMovements = async (event) => {
  const { roomId, userName, movements: newMovements } = JSON.parse(event.body);

  const roomData = await DynamoDB.get({
    TableName: TABLE_NAME,
    Key: { roomId: roomId },
  }).promise();

  if (!roomData.Item) {
    console.log("Room not found");
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Room not found" }),
    };
  }

  const roomMembers = roomData.Item.members;
  const memberFound = roomMembers.iterable.find((item) => {
    if (item.userName == userName) {
      item.movements = item.movements.concat(newMovements);
      return true;
    }
    return false;
  });

  if (!memberFound) {
    console.log("Member not found");
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Member not found" }),
    };
  }

  await DynamoDB.update({
    TableName: TABLE_NAME,
    Key: { roomId: roomId },
    UpdateExpression: "set members = :members",
    ExpressionAttributeValues: {
      ":members": roomMembers,
    },
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Movements updated" }),
  };
};

module.exports.getMovements = async (event) => {
  const { roomId } = JSON.parse(event.body);

  const roomData = await DynamoDB.get({
    TableName: TABLE_NAME,
    Key: { roomId: roomId },
  }).promise();

  if (!roomData.Item) {
    console.log("Room not found");
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Room not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(roomData.Item.members),
  };
};

module.exports.getRooms = async () => {
  const roomsData = await DynamoDB.scan({
    TableName: TABLE_NAME,
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(roomsData.Items),
  };
};
