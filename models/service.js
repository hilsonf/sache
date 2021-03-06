module.exports = function(){
	var mongoose    		= require('mongoose');
	mongoose.Promise 	= require('bluebird');
	var bodyParser 			= require('body-parser');
	var Schema   			= mongoose.Schema;

	var serviceSchema = new mongoose.Schema({
		name:     	  String,
		categories:      [{
			type: Schema.Types.ObjectId,
			ref: 'category'
		}],
		galleries:      [{
			type: Schema.Types.ObjectId,
			ref: 'gallery'
		}]
	});

	var _service = mongoose.model('service', serviceSchema);

	_allServices = function(success){
		_service.find({}, function(err, doc){
			if(err){
				fail(err);
			}else{
				success(doc);
			}
		}).populate(['categories', 'galleries']).sort({ 'name': 1 })
	}

	_allServiceGalleries = function(success){
		_service.find({galleries: { $exists: true, $ne: [] }}, 
			function(err, doc){
				if(err){
					fail(err);
				}else{
					success(doc);
				}
		}).populate('galleries').sort({createdAt: -1})
	}

	_addService = function (req, res, success){
		var service = new _service({
			name: req.body.name
		})
		service.save(function(err, doc){
			if (err) {
				throw err;
			}else{
				success(doc);
			};
		});
	}

	_removeService = function(req, res, success){
		_service.findOneAndRemove({_id: req.params.id}, function(err, doc) {
			if (err) {
				throw err;
			}else{
				success(doc);
			}
		});
	}

	_find_oneService = function(req, res, success){
		var id = req.params.id;
		_service.findOne({_id: id}, function(err, doc){
			if(err){
				throw err
			}else{
				success(doc);
			}
		});
	}

	_updateService = function(req, res, success){
		_service.update({_id: req.body.id},{$set:{
			name: req.body.name
		}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	_addGallery = function(req, res, gallery, success){	 
		_service.update({_id: req.body.service},{$push:{
			galleries: gallery._id
		}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	_addCategory = function(req, res, category, success){	 
		_service.update({_id: req.body.service},{$push:{
			categories: category._id
		}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	_updateCategory = function(req, res, category, success){
		_service.update({categories: category._id},{$pull:{ 
			categories: category._id
		}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	_updateGallery = function(req, res, gallery, success){
		_service.update({galleries: gallery._id},{$pull:{ 
			galleries: gallery._id
		}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	_allExcept = function( result, success){
		if (result.services[0] != undefined) {
			_service.find( { name: { $ne: result.services[0].name }},function(err, doc){
				if(err){
					throw err;
				}else{
					success(doc);
				}
			});
		}else{
			_service.find( {},function(err, doc){
				if(err){
					throw err;
				}else{
					success(doc);
				}
			})
		}
	}

	return {
		allServ  				: _allServices,
		allServGal  		: _allServiceGalleries,
		addServ	    		: _addService,
		removeServ  		: _removeService,
		updateServ  		: _updateService, 
		findServ    		: _find_oneService, 
		addCategory 		: _addCategory,
		addGallery 		  : _addGallery,
		updateCategory 	: _updateCategory,
		updateGallery   : _updateGallery,
		allExcept  			: _allExcept
	};


}();