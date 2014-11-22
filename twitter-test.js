var twitterAPI = require('node-twitter-api');
var keys = require('./twitter-creds.js');


console.log(keys.consumerKey);
console.log(keys.consumerSecret);
console.log(keys.token);
console.log(keys.tokenSecret);
var restClient = new twitterAPI({consumerKey: keys.consumerKey, consumerSecret: keys.consumerSecret, callback: 'http://pluralsight.com/testCallback'});

restClient.verifyCredentials(keys.token, keys.tokenSecret, function(error, data){
	if(error) {
		console.error(error);
	} else {
		console.log('Connection successful!');
	}
});

restClient.statuses("update", {
	status: "Laptop: $2000\nSphero: $130\nWriting code: $400\n\nHaving a plastic ball tweet \"ouch\" when it hits something: Priceless #UtahTechWeek"
}, keys.token, keys.tokenSecret, function(error, data, response){
	if (error) {
		console.error(error);
	}
});
