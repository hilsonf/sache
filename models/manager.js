
module.exports = function(){
	var db      = require('../config/db.js');
        mongoose    = require('mongoose');
        mongoose.Promise = require('bluebird');
	    bodyParser = require('body-parser');

    var Schema   = mongoose.Schema;
       
    var contentImageSchema = new mongoose.Schema({
	    imageName: 	  String,
	    imageUrl:     String,
	    imageDes:     String,
	    createdAt:    String,
	    visible:      String
	});

	var _model = mongoose.model('images', contentImageSchema);

	_addImage = function (req, res){

		var images = new _model({
			imageName: 	  req.file.filename,
		    imageUrl:     req.file.resizedPath,
		    imageDes: 	  req.body.imageDes,
		    createdAt:    new Date(),
		    visible:      'true'       
        	})
			// Save to Database
			images.save(function(err, doc){
				if (err) {
					throw err;
				}else{
  					console.log('Image Saved to DB');
				};
    			
  			});
	}

	_allImages = function(fail, success){
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
		schema     : contentImageSchema,
		addImage   : _addImage,
		allImages  : _allImages,
		deleteImage: _remove,
		userBooking  : _findOne
	};




}();







