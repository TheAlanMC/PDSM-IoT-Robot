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
    const { robotIp, networkName } = JSON.parse(event.body);
    const robotId = uuidv4();
    const timestamp = Date.now();
    const date = new Date(timestamp);

    await DynamoDB.put({
      TableName: TABLE_NAME,
      Item: {
        robotId,
        robotIp,
        networkName,
        currentTime: date.toISOString(),
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
    const currentTime = new Date();
    const fifteenMinutesAgo = new Date(currentTime.getTime() - 15 * 60000);

    const { Items } = await DynamoDB.scan({
      TableName: TABLE_NAME,
      FilterExpression: '#currentTime between :start_time and :end_time',
      ExpressionAttributeNames: {
        '#currentTime': 'currentTime',
      },
      ExpressionAttributeValues: {
        ':start_time': fifteenMinutesAgo.toISOString(),
        ':end_time': currentTime.toISOString(),
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
          networkName: item.networkName
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
