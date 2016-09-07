
module.exports = function(){

var twilio = require("twilio");

var accountSid = 'ACcdcb679686f7bd9089e978fc6ef751e9'; // Your Account SID from www.twilio.com/console
var authToken = '5888f47e83023e82e3914a7e20402b9b';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

_text = function(doc, res){

	client.messages.create({
	    body: 'Reservation Confirmed '+doc.firstName+' '+doc.lastName,
	    to: doc.tell,  // Text this number
	    from: '+13474914750' // From a valid Twilio number
	}, function(err, message) {
	    if(err) {
	        console.error(err.message);
	    }
	});

}

return{
  sendText: _text
}

}();

