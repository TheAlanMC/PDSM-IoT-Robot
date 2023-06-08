const AWS = require("aws-sdk");
const uuid = require('uuid');

const DynamoDB = new AWS.DynamoDB.DocumentClient();

const ACTIVE_CONNECTIONS_TABLE = process.env.ACTIVE_CONNECTIONS_TABLE;
const ROOMS_TABLE = process.env.ROOMS_TABLE;

// Constant values
const successfulResponse = {
    statusCode: 200,
    body: 'Successful request'
};
const failedResponse = (statusCode, errorMessage) => {
    return {
        statusCode: statusCode,
        body: errorMessage
    };
};


// Main handlers
module.exports.connectHandler = async (event, context, callback) => {
    try {
        console.log("New connection event")
        const connectionId = event.requestContext.connectionId;

        console.log(`Connection ID is ${connectionId}`)
        const connectionData = {
            connectionId: connectionId
        };
    
        await DynamoDB.put({
            TableName: ACTIVE_CONNECTIONS_TABLE,
            Item: connectionData
        }).promise();
    } catch (err) {
        console.log(err);
        callback(failedResponse(500, "Error creating a new connection"));
    }

    callback(null, successfulResponse);
};

module.exports.disconnectHandler = async (event, _context, callback) => {
    try {
        console.log("Disconnect event")
        const connectionId = event.requestContext.connectionId;

        console.log(`Connection ID is ${connectionId}`)
        const deleteParams = {
            TableName: ACTIVE_CONNECTIONS_TABLE,
            Key: {
                connectionId: connectionId
            }
        };

        await DynamoDB.delete(deleteParams).promise();
    } catch (err) {
        console.log(err);
        callback(failedResponse(500, "Error deleting connection"));
    }

    callback(null, successfulResponse);
};

module.exports.defaultHandler = async (_event, _context, callback) => {
    callback(failedResponse(400, "Invalid request"))
};

/**
 * Function that sets the user and the robot for a given connection
 */
module.exports.setUserHandler = async (event, context, callback) => {
    const connectionId = event.requestContext.connectionId;
    console.log(`Setting user from ${connectionId}`);

    const body = JSON.parse(event.body);
    console.log(`Event body: ${event.body}`)
    const user = body.user;
    const robot = body.robot;

    // search for the connection in the active connections table
    const connectionData = await DynamoDB.get({
        TableName: ACTIVE_CONNECTIONS_TABLE,
        Key: {
            connectionId: connectionId
        }
    }).promise();

    if (!connectionData.Item) {
        console.log("Connection not found")
        callback(failedResponse(400, "Connection not found"));
    }

    // update the connection with the user and robot
    console.log("Updating connection");
    const updateParams = {
        TableName: ACTIVE_CONNECTIONS_TABLE,
        Key: {
            connectionId: connectionId
        },
        UpdateExpression: "set userName = :user, robot = :robot",
        ExpressionAttributeValues: {
            ":user": user,
            ":robot": robot
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await DynamoDB.update(updateParams).promise();
        console.log("Connection updated")
        callback(null, successfulResponse);
    } catch (err) {
        console.log(err);
        callback(failedResponse(500, "Error updating connection"));
    }
    
};

// Room handlers
module.exports.createRoomHandler = async (event, context, callback) => {
    const connectionId = event.requestContext.connectionId;
    console.log(`Creating room from ${connectionId}`);

    const body = JSON.parse(event.body);
    console.log(`Event body: ${event.body}`)
    const roomName = body.roomName;
    const password = body.password;

    // search for the connection in the active connections table
    const connectionData = await DynamoDB.get({
        TableName: ACTIVE_CONNECTIONS_TABLE,
        Key: {
            connectionId: connectionId
        }
    }).promise();

    if (!connectionData.Item) {
        console.log("Connection not found");
        callback(failedResponse(400, "Connection not found"));
    }

    // create a new room
    console.log("Creating new room");
    const roomId = uuid.v1();
    const roomData = {
        roomId: roomId,
        roomName: roomName,
        password: password,
        members: [{
            connectionId: connectionId,
            isReady: false,
            isHost: true,
            userName: connectionData.Item.userName,
        }],
    };

    try {
        await DynamoDB.put({
            TableName: ROOMS_TABLE,
            Item: roomData
        }).promise();
        console.log("Room created")
        callback(null, successfulResponse);
    } catch (err) {
        console.log(err);
        callback(failedResponse(500, "Error creating a new room"));
    }
};

module.exports.joinRoomHandler = async (event, context, callback) => {
    const connectionId = event.requestContext.connectionId;
    console.log(`Joining room from ${connectionId}`);

    const body = JSON.parse(event.body);
    console.log(`Event body: ${event.body}`)
    const roomId = body.roomId;
    const password = body.password;

    // search for the connection in the active connections table
    const connectionData = await DynamoDB.get({
        TableName: ACTIVE_CONNECTIONS_TABLE,
        Key: {
            connectionId: connectionId
        }
    }).promise();

    if (!connectionData.Item) {
        console.log("Connection not found");
        callback(failedResponse(400, "Connection not found"));
    }

    // search for the room in the rooms table
    const roomData = await DynamoDB.get({
        TableName: ROOMS_TABLE,
        Key: {
            roomId: roomId
        }
    }).promise();

    if (!roomData.Item) {
        console.log("Room not found");
        callback(failedResponse(404, "Room not found"));
    }

    // check if the password is correct
    if (roomData.Item.password !== password) {
        console.log("Incorrect password");
        callback(failedResponse(401, "Incorrect password"));
    }

    // add the connection to the room
    console.log("Adding connection to room");
    const members = roomData.Item.members;
    members.push({
        connectionId: connectionId,
        isReady: false,
        isHost: false,
        userName: connectionData.Item.userName,
    });
    const updateParams = {
        TableName: ROOMS_TABLE,
        Key: {
            roomId: roomId
        },
        UpdateExpression: "set members = :members",
        ExpressionAttributeValues: {
            ":members": members
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await DynamoDB.update(updateParams).promise();
        console.log("Connection added to room")
        // send notification to all members of the room
        const members = roomData.Item.members;
        members.forEach(async (member) => {
            const connectionId = member.connectionId;
            const message = {
                message: `${connectionData.Item.userName} ingresó a la sala`,
                type: "notification"
            };
            await sendToConnection(connectionId, message, event);
        });
        callback(null, successfulResponse);
    } catch (err) {
        console.log(err);
        callback(failedResponse(500, "Error creating a new room"));
    }
};

module.exports.leaveRoomHandler = async (event, context, callback) => {
    const connectionId = event.requestContext.connectionId;
    console.log(`Leaving room from ${connectionId}`);

    const body = JSON.parse(event.body);
    console.log(`Event body: ${event.body}`)
    const roomId = body.roomId;

    // search for the connection in the active connections table
    const connectionData = await DynamoDB.get({
        TableName: ACTIVE_CONNECTIONS_TABLE,
        Key: {
            connectionId: connectionId
        }
    }).promise();

    if (!connectionData.Item) {
        console.log("Connection not found");
        callback(failedResponse(400, "Connection not found"));
    }

    // search for the room in the rooms table
    const roomData = await DynamoDB.get({
        TableName: ROOMS_TABLE,
        Key: {
            roomId: roomId
        }
    }).promise();

    if (!roomData.Item) {
        console.log("Room not found");
        callback(failedResponse(404, "Room not found"));
    }

    // remove the connection from the room
    console.log("Removing connection from room");
    const members = roomData.Item.members;
    const newMembers = members.filter(member => member.connectionId !== connectionId);
    const updateParams = {
        TableName: ROOMS_TABLE,
        Key: {
            roomId: roomId
        },
        UpdateExpression: "set members = :members",
        ExpressionAttributeValues: {
            ":members": newMembers
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await DynamoDB.update(updateParams).promise();
        console.log("Connection removed from room")
        callback(null, successfulResponse);
    } catch (err) {
        console.log(err);
        callback(failedResponse(500, "Error removing connection from room"));
    }
};

module.exports.setReadyHandler = async (event, context, callback) => {
    const connectionId = event.requestContext.connectionId;
    console.log(`Setting ready from ${connectionId}`);

    const body = JSON.parse(event.body);
    console.log(`Event body: ${event.body}`)
    const roomId = body.roomId;
    const isReady = body.isReady;

    // search for the connection in the active connections table
    const connectionData = await DynamoDB.get({
        TableName: ACTIVE_CONNECTIONS_TABLE,
        Key: {
            connectionId: connectionId
        }
    }).promise();

    if (!connectionData.Item) {
        console.log("Connection not found");
        callback(failedResponse(400, "Connection not found"));
    }

    // search for the room in the rooms table
    const roomData = await DynamoDB.get({
        TableName: ROOMS_TABLE,
        Key: {
            roomId: roomId
        }
    }).promise();

    if (!roomData.Item) {
        console.log("Room not found");
        callback(failedResponse(404, "Room not found"));
    }

    // set the connection's ready status
    console.log("Setting ready status");
    const members = roomData.Item.members;
    const newMembers = members.map(member => {
        if (member.connectionId === connectionId) {
            member.isReady = isReady;
        }
        return member;
    });
    const updateParams = {
        TableName: ROOMS_TABLE,
        Key: {
            roomId: roomId
        },
        UpdateExpression: "set members = :members",
        ExpressionAttributeValues: {
            ":members": newMembers
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await DynamoDB.update(updateParams).promise();
        console.log("Ready status set")
        // check if all members are ready
        const allReady = newMembers.every(member => member.isReady);
        if (allReady) {
            // send a message to all members that the game is starting
            const message = {
                action: "startGame",
                roomId: roomId
            };
            const postCalls = newMembers.map(member => {
                return sendToConnection(member.connectionId, message, event);
            });
            await Promise.all(postCalls);
        } else if(isReady) {
            // send a message to all members that a member is ready
            const message = {
                action: "setReady",
                roomId: roomId,
                isReady: isReady,
                userName: connectionData.Item.userName
            };
            const postCalls = newMembers.map(member => {
                return sendToConnection(member.connectionId, message, event);
            });
            await Promise.all(postCalls);
        } else {
            // send a message to all members that a member is not ready
            const message = {
                action: "setReady",
                roomId: roomId,
                isReady: isReady,
                userName: connectionData.Item.userName
            };
            const postCalls = newMembers.map(member => {
                return sendToConnection(member.connectionId, message, event);
            });
            await Promise.all(postCalls);
        }
        callback(null, successfulResponse);
    } catch (err) {
        console.log(err);
        callback(failedResponse(500, "Error setting ready status"));
    }
};

const sendToConnection = async (connectionId, message, event) => {
    console.log(`Sending message to ${connectionId}`);
    console.log(`Message: ${JSON.stringify(message)}`);
    const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
    });

    try {
        await apiGatewayManagementApi.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(message)
        }).promise();
    } catch (err) {
        console.log(err);
        if (err.statusCode === 410) {
            console.log(`Found stale connection, deleting ${connectionId}`);
            await DynamoDB.delete({
                TableName: ACTIVE_CONNECTIONS_TABLE,
                Key: {
                    connectionId: connectionId
                }
            }).promise();
        }
    }
}
