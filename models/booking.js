module.exports = function(){
    var twilio = require('../config/twilio');
	var db      = require('../config/db.js');
        mongoose    = require('mongoose');
        mongoose.Promise = require('bluebird');
        email = require('../config/email');
	    bodyParser = require('body-parser');

    var Schema   = mongoose.Schema;
       
    var bookingSchema = new mongoose.Schema({
	    firstName: 	  String,
	    lastName:     String,
	    tell: 		  Number,
	    bookDate:     Date,
	    calendarId:   String,
	    createdAt:    String,
	    visible:      String
	});

	var _model = mongoose.model('booking', bookingSchema);

	_addBooking = function (req, cal, res){

		var booking = new _model({

			firstName: 	  req.body.firstName,
		    lastName:     req.body.lastName,
		    tell: 		  req.body.tell,
		    bookDate:     req.body.bookDate,
		    calendarId:   cal.calendarId,
		    createdAt:    new Date(),
		    visible:      'true'       
        	})
			// Save to Database
			booking.save(function(err){
				if (err) {
					throw err;
				}else{
					//Send Email
  					// email.sendMail(doc, res);
  					//twilio.sendText(doc, res);
  					//console.log('Saved Booking to DB');
				};
    			
  			});
	}

	_allBookings = function(fail, success){
			_model.find({visible:"true"}, function(err, doc){
				if(err){
					fail(err);
				}else{
					success(doc);
				}
			}).sort({createdAt: -1});
		}

	_remove = function(id, success){
		_model.update({_id: id},{$set:{visible:'false'}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	_findOne = function(id ,success){
		_model.findOne({'_id': id}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	_findOneAndDelete = function(id ,success){
		_model.findOneAndUpdate({'_id': id}, { visible: 'false' },function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	_update = function(req, res, success){
		var id = req.params.id;
		var d = new Date(req.body.updatebookDate+' '+req.body.updatebookTime+':00');

		console.log(d);
		_model.update({_id: id},{$set:{
			firstName:req.body.updatefirstName,
			lastName: req.body.updatelastName,
			tell: req.body.updatetell,
			bookDate: d
		}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}


	return {
		schema     		: bookingSchema,
		addBooking   	: _addBooking,
		allBookings  	: _allBookings,
		deleteBooking 	: _remove,
		findBooking  	: _findOne,
		updateBooking 	: _update,
		findOneAndDelete: _findOneAndDelete
	};




}();







