
var mongoose = require( 'mongoose' );
 
var unString = 'mongodb://0.0.0.0:27017/sachebd';

//MONGOOSE CONECTION
mongoose.connect(unString, function(err, res){
	if(err){
		console.log('ERROR CONECTING TO DATABASE');
	}else{
		console.log('CONNECTED TO DATABASE');
	}
});

