module.exports = function(){
    var mongoose    = require('mongoose');
        mongoose.Promise = require('bluebird');
	var bodyParser = require('body-parser');

    var Schema   = mongoose.Schema;
  
  	var serviceSchema = new mongoose.Schema({
	    name:     	  String,
	    category:     Array
	});

	var _service = mongoose.model('service', serviceSchema);

	_allServices = function(success){
			_service.find({}, function(err, doc){
				if(err){
					fail(err);
				}else{
					success(doc);
				}
			});
		}

	_addService = function (req, res){

		cat_arr = new Array()
		for (var i = 0; i < req.body.category.length; i++) {
			_cat = {}
			_cat.name = req.body.category[i].split(',')[0]
			_cat.price = req.body.category[i].split(',')[1]
			cat_arr.push(_cat)
		}

		var service = new _service({
			name: req.body.name,
			category: cat_arr   
        	})
			// Save to Database
			service.save(function(err, doc){
				if (err) {
					throw err;
				}else{
  					console.log('Service Saved to DB');
				};
    			
  			});
	}

	_removeService = function(id){

		_service.remove({_id: id}, function(err, doc) {
	  	if (err) {
	  		throw err;
	  	}else{
	  		console.log('Service Deleted');
	  	}

		});
	}

	_find_oneService = function(req, res, success){
		var id = req.params.id;
		_service.findOne({_id: id}, function(err, doc){
			if(err){
				fail(err);
			}else{
				success(doc);
			}
		});
	}


	_updateService = function(req, res, success){
		cat_arr = new Array()
		for (var i = 0; i < req.body.category.length; i++) {
			_cat = {}
			_cat.name = req.body.category[i].split(',')[0]
			_cat.price = req.body.category[i].split(',')[1]
			cat_arr.push(_cat)
		}
		_service.update({_id: req.body.id},{$set:{
			name: req.body.name,
			category: cat_arr
		}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
				console.log('Service Update');
			}
		})
	}



	return {
		allServ  	: _allServices,
		addServ	    : _addService,
		removeServ  : _removeService,
		updateServ  : _updateService, 
		findServ    : _find_oneService 
	};




}();