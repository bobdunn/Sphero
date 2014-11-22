var twitterAPI = require('node-twitter-api');
var keys = require('./twitter-creds.js');

exports.tweet = function(message) {
var restClient = new twitterAPI({consumerKey: keys.consumerKey, consumerSecret: keys.consumerSecret, callback: 'http://pluralsight.com/testCallback'});

restClient.statuses("update", {
	status: message
}, keys.token, keys.tokenSecret, function(error, data, response){
	if (error) {
		console.error(error);
	}
});
};