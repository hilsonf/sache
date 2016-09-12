module.exports = function(){
	var db      = require('../config/db.js');
        mongoose    = require('mongoose');
        mongoose.Promise = require('bluebird');
        email = require('../config/email');
	    bodyParser = require('body-parser');

    var Schema   = mongoose.Schema;
       
    var calendarSchema = new mongoose.Schema({
	    text: 	    String,
	    calendarId: String,
	    start_date: String,
        end_date:   String,
        createdAt:  String,
        visible:    String
	});

	var _model = mongoose.model('calendar', calendarSchema);

	_addCalendar = function (req, res, success){

		var calendar = new _model({

			text: 	     req.body.firstName+' '+req.body.lastName+' Appointment',
			calendarId:  req.body.calendarId,
		    start_date:  req.body.bookDate,
		    end_date:    req.body.bookDate,
		    createdAt:    new Date(),
		    visible:      'true'    
        	})
			// Save to Database
			calendar.save(function(err, doc){
				if (err) {
					throw err;
				}else{
					//Send Email
					success(doc);
				};
    			
  			});
	}

	_manuallyAddCalendar = function (req, success){

		var calendar = new _model({

			text: 	     req.body.text+' Appointment',
			calendarId:  req.body.id,
		    start_date:  req.body.start_date,
		    end_date:    req.body.end_date,
		    createdAt:    new Date(),
		    visible:      'true'    
        	})
			// Save to Database
			calendar.save(function(err, doc){
				if (err) {
					throw err;
				}else{
					//Send Email
					success(doc);
				};
    			
  			});
	}

	_allCalendar = function(fail, success){
			_model.find({visible:"true"}, function(err, doc){
				if(err){
					fail(err);
				}else{
					success(doc);
				}
			});
		}

	_updateCalendar = function(req, b, res){
		var id = b.calendarId;
		var d = new Date(req.body.updatebookDate+' '+req.body.updatebookTime+':00');
		_model.update({'calendarId': id},{$set:{
			text: req.body.updatefirstName+' '+req.body.updatelastName+' Appointment',
			start_date: d,
			end_date: d
		}}, function(err){
			if(err){
				throw err;
			}
		})
	}

	_findOneAndDetete = function(calId ,success){
		_model.findOneAndUpdate({'calendarId': calId}, { visible: 'false' },function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	_findOneAndUpdate = function(req, success){
	    var calId = req.body.calendarId
		_model.findOneAndUpdate({'calendarId': calId}, {$set: {
			text: req.body.text+' Appointment',
			start_date: req.body.start_date,
			end_date: req.body.end_date
		}},function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}


	return {
		schema     			: calendarSchema,
		addCalendar   		: _addCalendar,
		manuallyAddCalendar : _manuallyAddCalendar,
		allCalendar  		: _allCalendar,
		updateCalendar 		: _updateCalendar,
		findOneAndDelete 	: _findOneAndDetete,
		findOneAndUpdate 	: _findOneAndUpdate
	};

}();







