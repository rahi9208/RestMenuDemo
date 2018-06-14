let AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB.DocumentClient();
let validateJS = require("validate.js");
exports.handler = function (event, context, callback) {

	let invalid = validateJS(event, {
		itemCode: { presence: true }
	});

	if (invalid) {
		callback(JSON.stringify(invalid));
	}
	ddb.put({
		TableName: 'MenuItems',
		Item: { 'itemCode': event.itemCode, 'itemName': event.itemName, 'itemPrice': event.itemPrice, 'itemType': event.itemType }
	}, function (err, data) {
		let objectKey = event.itemCode + ".jpg";
		let image = Buffer.from(event.itemImage, "base64");
		s3.putObject({
			"Body": image,
			"Bucket": "slappforge.menu",
			"Key": objectKey,
			"ACL": "public-read",
			"ContentType":"image/jpeg"
		})
			.promise()
			.then(data => {
					callback(err, 'Successfully persisted');
			})
			.catch(err => {
					callback(err);
			});




	
	});


}