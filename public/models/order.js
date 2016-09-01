
module.exports = function(){
	var db      = require('../../config/db.js');
        mongoose    = require('mongoose');
        mongoose.Promise = require('bluebird');
        email = require('../../config/email');
	    bodyParser = require('body-parser');

    var Schema   = mongoose.Schema;
       
    var orderSchema = new mongoose.Schema({
	    productName: 	  String,
	    productDes:       String,
	    productSize: 	  String,
	    quantity: 	      Number,
	    company: 		  String,
	    email: 		      String,
	    tell: 		      Number,
	    billingAddress:   String,
	    shippingAddress:  String,
	    shipDate:         String,
	    createdAt:        String,
	    visible:          String,
	    orderStatus:      String
	});

	var _model = mongoose.model('order', orderSchema);

	_addOrder = function (req, res){

		var order = new _model({

			productName: 	  req.body.productName,
		    productDes:       req.body.productDes,
		    productSize:      req.body.productSize,
		    quantity: 	      req.body.quantity,
		    company: 		  req.body.company,
		    email: 		      req.body.email,
		    tell: 		      req.body.tell,
		    billingAddress:   req.body.billingAddress,
		    shippingAddress:  req.body.shippingAddress,
		    shipDate:         req.body.shipDate,         
		    createdAt:        req.body.createdAt,
		    visible:          'true',         
		    orderStatus:      'Pending',         
        	})
			// Save to Database
			order.save(function(err, doc){
				if (err) {
					throw err;
				}else{
					//Send Email
  					email.sendMail(doc, res);
				};
    			
  			});
	}

	_allOrders = function(fail, success){
			_model.find({visible:"true"}, function(err, doc){
				if(err){
					fail(err);
				}else{
					success(doc);
				}
			}).sort({createdAt: -1});
		}

	// _delete = function(id, success){
	// 	console.log(id);
	// 	_model.remove({_id: id}, function(err, doc){
	// 		if(err){
	// 			throw err;
	// 		}else{
				
	// 			success(doc);
	// 		}
	// 	})
	// }

	_remove = function(id, success){
		_model.update({_id: id},{$set:{visible:'false'}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	_update = function(req, res, success){
 		
		  var order = req.body.order;
		  var id = req.body.order._id;
		  var status = req.body.order.orderStatus;
		_model.update({_id: id},{$set:{orderStatus:status}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
				//Order Status Email
				email.sendMail2(order, res);
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
		schema     : orderSchema,
		addOrder   : _addOrder,
		allOrders  : _allOrders,
		deleteOrder: _remove,
		updateOrder: _update,
		userOrder  : _findOne
	};




}();







