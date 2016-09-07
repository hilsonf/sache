//800-
module.exports = function(){
	var db      = require('../config/db.js');
        mongoose    = require('mongoose');
        mongoose.Promise = require('bluebird');
        email = require('../config/email');
	    bodyParser = require('body-parser');

    var Schema   = mongoose.Schema;
       
    var calendarSchema = new mongoose.Schema({
	    text: 	  String,
	    start_date: String,
        end_date:   String
	});

	var _model = mongoose.model('calendar', calendarSchema);

	_addCalendar = function (req, res){

		var calendar = new _model({


			text: 	     req.body.firstName+' '+req.body.lastName+' Appointment',
		    start_date:  req.body.bookDate,
		    end_date:    req.body.bookDate   
        	})
			// Save to Database
			calendar.save(function(err, doc){
				if (err) {
					throw err;
				}else{
					//Send Email
  					console.log('Calendar Saved to DB');
				};
    			
  			});
	}

	_allCalendar = function(fail, success){
			_model.find({}, function(err, doc){
				if(err){
					fail(err);
				}else{
					success(doc);
				}
			});
		}


	return {
		schema     : calendarSchema,
		addCalendar   : _addCalendar,
		allCalendar  : _allCalendar
	};




}();







