
var mongoose = require( 'mongoose' );
 
var unString = 'mongodb://zaina:zaina4727@ds161505.mlab.com:61505/heroku_k1dd6bv8';

//MONGOOSE CONECTION
mongoose.connect(unString, function(err, res){
	if(err){
		console.log('ERROR CONECTING TO DATABASE');
	}else{
		console.log('CONNECTED TO DATABASE');
	}
});

