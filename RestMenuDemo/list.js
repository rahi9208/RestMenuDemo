let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
let translate = new AWS.Translate();
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
	}, async function (err, data) {
		if (!err && data.Items) {
			response.body = JSON.stringify(await Promise.all(data.Items.map(async (item) => {
				item.image = "https://s3.amazonaws.com/" + process.env["IMAGE_BUCKET"] + "/" + item.itemCode + ".jpg";
				item.itemName = await translateName(item.itemName, "zh");
				return item;
			})));
		} else {
			response.body = "No Items";
		}
		callback(err, response);
	});




}


async function translateName(name, to) {
	return (await translate.translateText({ SourceLanguageCode: "en", TargetLanguageCode: to, Text: name }).promise()).TranslatedText;
}