
module.exports = function(){
    var twilio = require('../../config/twilio');
	var db      = require('../../config/db.js');
        mongoose    = require('mongoose');
        mongoose.Promise = require('bluebird');
        email = require('../../config/email');
	    bodyParser = require('body-parser');

    var Schema   = mongoose.Schema;
       
    var bookingSchema = new mongoose.Schema({
	    firstName: 	  String,
	    lastName:     String,
	    tell: 		  Number,
	    bookDate:     String,
	    bookTime:     String,
	    createdAt:    String,
	    visible:      String
	});

	var _model = mongoose.model('booking', bookingSchema);

	_addBooking = function (req, res){

		var booking = new _model({

			firstName: 	  req.body.firstName,
		    lastName:     req.body.lastName,
		    tell: 		  req.body.tell,
		    bookDate:     req.body.bookDate,
		    bookTime:     req.body.bookTime,
		    createdAt:    new Date(),
		    visible:      'true'       
        	})
			// Save to Database
			booking.save(function(err, doc){
				if (err) {
					throw err;
				}else{
					//Send Email
  					// email.sendMail(doc, res);
  					twilio.sendText(doc, res);
  					//console.log('Saved to DB');
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


	return {
		schema     : bookingSchema,
		addBooking   : _addBooking,
		allBookings  : _allBookings,
		deleteBooking: _remove,
		userBooking  : _findOne
	};




}();







