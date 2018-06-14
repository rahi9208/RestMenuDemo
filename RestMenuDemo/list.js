let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {

	let response = {
		"statusCode": 200,
		"headers": {
			"Access-Control-Allow-Origin": "*"
		},
		"body": "..."
	};
	let itemType = (event.queryStringParameters && event.queryStringParameters.type) || "NON_VEG";

	ddb.scan({
		TableName: 'MenuItems',
		ExpressionAttributeValues: {
			':it': itemType
		},
		FilterExpression: 'itemType = :it'
	}, function (err, data) {
		if(!err && data.Items){
			response.body = JSON.stringify(data.Items);
		}else{
			response.body = "No Items";
		}
		callback(err, response);
	});




}