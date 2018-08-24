module.exports = function(){
	var mongoose    = require('mongoose');
	mongoose.Promise = require('bluebird');
	var bodyParser = require('body-parser');
	var service 			= require('../models/service');
	var Schema   = mongoose.Schema;

	var contentGallerySchema = new mongoose.Schema({
		imageUrl:     String,
		createdAt:    Date,
		visible:      String,
		services:      [{
			type: Schema.Types.ObjectId,
			ref: 'service'
		}]
	});

	var contentVideoSchema = new mongoose.Schema({
		vidUrl:       String,
		createdAt:    Date,
		visible:      String
	});

	var _gal = mongoose.model('gallery', contentGallerySchema);
	var _vid = mongoose.model('videos', contentVideoSchema);

	_addMultipleImages = function (fileUrl, req, res, success){
		var gallery = new _gal({
			imageUrl:     fileUrl,
			services:     req.body.service,
			createdAt:    new Date(),
			visible:      'true'       
		})
		gallery.save(function(err, doc){
			if (err) {
				throw err;
			}else{
				service.addGallery(req, res, doc, function(result){ 
					success(doc);
				})
			};	
		});
	}

	_addVideo = function (req, res){

		var str = req.body.videourl;
		var videoId = str.slice(17);
		var embed = 'https://www.youtube.com/embed/'+videoId
		var videos = new _vid({
			vidUrl: 	  embed,
			createdAt:    new Date(),
			visible:      'true'       
		})
	// Save to Database
	videos.save(function(err, doc){
		if (err) {
			throw err;
		}else{
			console.log('Video Saved to DB');
		};

	});
	}

	_allVideos = function(req, res, success){
		_vid.find({visible:"true"}, function(err, doc){
			if(err){
				throw err
			}else{
				success(doc);
			}
		}).sort({createdAt: -1});
	}

	_missingServiceGalleries = function(success){
		_gal.find({services: { $exists: false }}, function(err, doc) {
			if (err) {
				throw err;
			}else{
					success(doc);
			}
		}).populate('services');
	}

	_removeGallery = function(req, res, success){
		_gal.findOneAndRemove({_id: req.params.id}, function(err, doc) {
			if (err) {
				throw err;
			}else{
				service.updateGallery(req, res, doc, function(result){
					success(doc);
				})
			}
		});
	}

	_updateService = function(req, res, success){
		_gal.update({services: req.params.id}, {$unset: { 
			services: req.params.id
		}}, { multi : true }, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}


	return {
		addVideo  			    : _addVideo,
		allVideos  			    : _allVideos,
		missingGal  			: _missingServiceGalleries,
		addMultipleImages 	: _addMultipleImages,
		removeGal           : _removeGallery,
		updateServ          : _updateService
	};


}();
