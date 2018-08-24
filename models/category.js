module.exports = function(){
	var mongoose    	= require('mongoose');
	mongoose.Promise 	= require('bluebird');
	var bodyParser 		= require('body-parser');
	var service 			= require('../models/service');
	var Schema   			= mongoose.Schema;

	var categorySchema = new mongoose.Schema({
		name:     	  String,
		price:     	  Number,
		services:      [{
			type: Schema.Types.ObjectId,
			ref: 'service'
		}]
	});

	var _category = mongoose.model('category', categorySchema);

	_allCategories = function(success){
		_category.find({}, function(err, doc){
			if(err){
				throw err
			}else{
				success(doc);
			}
		}).populate('services');
	}

	_addCategory = function (req, res, success){

		var category = new _category({
			name: req.body.name,
			price: req.body.price,	      
			services: req.body.service
		})

		category.save(function(err, doc){
			if (err) {
				throw err
			}else{
				service.addCategory(req, res, doc, function(result){ 
					success(doc);
				})
			};
		});
	}

	_removeCategory = function(req, res, success){
		_category.findOneAndRemove({_id: req.params.id}, function(err, doc) {
			if (err) {
				throw err;
			}else{
				service.updateCategory(req, res, doc, function(result){
					success(doc);
				})
			}
		});
	}

	_find_oneCategory = function(req, res, success){
		_category.findOne({_id: req.params.id}, function(err, doc){
			if(err){
				throw err
			}else{
				success(doc);
			}
		}).populate('services');
	}

	_updateCategory = function(req, res, success){
		_category.findOneAndUpdate({_id: req.body.id},{$set:{
			name: req.body.name,
			price: req.body.price,
			services: req.body.service
		}}, function(err, doc){
			if(err){
				throw err;
			}else{
				service.updateCategory(req, res, doc, function(result){
					if (result) {
						service.addCategory(req, res, doc, function(result){   					
							success(doc);
						}) 
					}  
				})
			}
		})
	}

	_updateService = function(req, res, success){
		_category.update({services: req.params.id},{$pull:{ 
			services: req.params.id
		}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	return {
		allCat  		: _allCategories,
		addCat			: _addCategory,
		removeCat 	: _removeCategory,
		updateCat 	: _updateCategory, 
		findCat  		: _find_oneCategory,
		updateServ	: _updateService
	};

}();