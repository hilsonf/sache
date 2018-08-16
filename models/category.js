module.exports = function(){
    var mongoose    = require('mongoose');
        mongoose.Promise = require('bluebird');
	var bodyParser = require('body-parser');

    var Schema   = mongoose.Schema;
  
  	var categorySchema = new mongoose.Schema({
	    name:     	  String,
	    price:     	  Number
	});

	var _category = mongoose.model('category', categorySchema);

	_allCategories = function(success){
			_category.find({}, function(err, doc){
				if(err){
					fail(err);
				}else{
					success(doc);
				}
			});
		}

	_addCategory = function (req, res){

		var category = new _category({
			name: req.body.name,
			price: req.body.price	      
        	})
			// Save to Database
			category.save(function(err, doc){
				if (err) {
					throw err;
				}else{
  					console.log('Category Saved to DB');
				};
    			
  			});
	}

	_removeCategory = function(id){

		_category.remove({_id: id}, function(err, doc) {
	  	if (err) {
	  		throw err;
	  	}else{
	  		console.log('Category Deleted');
	  	}

		});
	}

	_find_oneCategory = function(req, res, success){
		var id = req.params.id;
		_category.findOne({_id: id}, function(err, doc){
			if(err){
				fail(err);
			}else{
				success(doc);
			}
		});
	}

	_updateCategory = function(req, res, success){
		_category.update({_id: req.body.id},{$set:{
			name: req.body.name,
			price: req.body.price
		}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}

	return {
		allCat  	: _allCategories,
		addCat		: _addCategory,
		removeCat  	: _removeCategory,
		updateCat  	: _updateCategory, 
		findCat  	: _find_oneCategory 
	};

}();