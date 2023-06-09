const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const DynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers" : "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE,PATCH"
}

module.exports.registerNewRobot = async (event) => {
  try {
    // TODO: MAYBE ADD A SECRET KEY TO REGISTER A NEW ROBOT
    const { robotIp, robotName } = JSON.parse(event.body);
    // If exists a robot with the same ip, the same name and is online, return an error that the robot is already registered
    const { Items } = await DynamoDB.scan({
      TableName: TABLE_NAME,
      FilterExpression:
        "robotIp = :robotIp and robotName = :robotName and isOnline = :isOnline",
      ExpressionAttributeValues: {
        ":robotIp": robotIp,
        ":robotName": robotName,
        ":isOnline": true,
      },
    }).promise();
    if (Items.length > 0) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        },
        body: JSON.stringify({
          data: null,
          message: "Robot already registered",
          sucessful: false,
        }),
      };
    }
    const robotId = uuidv4();
    await DynamoDB.put({
      TableName: TABLE_NAME,
      Item: {
        robotId,
        robotIp,
        robotName,
        isOnline: true,
        isAvailable: true,
        timestamp: Date.now(),
      },
    }).promise();
    // TODO: Register in a new table for a new game
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
      body: JSON.stringify({
        data: null,
        message: "Robot registered successfully",
        sucessful: true,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
      body: JSON.stringify({
        data: null,
        message: "Error registering robot",
        sucessful: false,
      }),
    };
  }
};

module.exports.getAvailableRobots = async (event) => {
  try {
    const { Items } = await DynamoDB.scan({
      TableName: TABLE_NAME,
      FilterExpression: "isAvailable = :isAvailable",
      ExpressionAttributeValues: {
        ":isAvailable": true,
      },
    }).promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
      body: JSON.stringify({
        data: Items.map((item) => ({
          robotId: item.robotId,
          robotIp: item.robotIp,
          robotName: item.robotName,
          isOnline: item.isOnline,
          isAvailable: item.isAvailable,
        })),
        message: "Robots retrieved successfully",
        sucessful: true,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
      body: JSON.stringify({
        data: null,
        message: "Error retrieving robots",
        sucessful: false,
      }),
    };
  }
};

module.exports.setRobotStatus = async (event) => {
  try {
    const { robotId, isAvailable, isOnline } = JSON.parse(event.body);
    await DynamoDB.update({
      TableName: TABLE_NAME,
      Key: {
        robotId,
      },
      UpdateExpression: "set isAvailable = :isAvailable, isOnline = :isOnline",
      ExpressionAttributeValues: {
        ":isAvailable": isAvailable,
        ":isOnline": isOnline,
      },
    }).promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
      body: JSON.stringify({
        data: null,
        message: "Robot status updated successfully",
        sucessful: true,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
      body: JSON.stringify({
        data: null,
        message: "Error updating robot status",
        sucessful: false,
      }),
    };
  }
};
