const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const DynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE,PATCH"
}

module.exports.registerNewRobot = async (event) => {
  try {
    // TODO: MAYBE ADD A SECRET KEY TO REGISTER A NEW ROBOT
    const { robotIp, hostname } = JSON.parse(event.body);
    const robotId = uuidv4();
    const timestamp = Date.now();
    const date = new Date(timestamp);

    await DynamoDB.put({
      TableName: TABLE_NAME,
      Item: {
        robotId,
        robotIp,
        hostname,
        timestamp: date.toISOString(),
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
    // get robots from the last 10 minutes
    const { Items } = await DynamoDB.scan({
      TableName: TABLE_NAME,
      FilterExpression: "timestamp > :timestamp",
      ExpressionAttributeValues: {
        ":timestamp": Date.now() - 10 * 60 * 1000,
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
