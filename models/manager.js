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

	var contentVideoSchema = new mongoose.Schema({
	    vidUrl:       String,
	    createdAt:    String,
	    visible:      String
	});

	var _model = mongoose.model('images', contentImageSchema);
	var _vid = mongoose.model('videos', contentVideoSchema);

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

	_allVideos = function(fail, success){
			_vid.find({visible:"true"}, function(err, doc){
				if(err){
					fail(err);
				}else{
					success(doc);
				}
			}).sort({createdAt: -1});
		}


	return {
		schema     : contentImageSchema,
		addImage   : _addImage,
		allImages  : _allImages,
		addVideo  : _addVideo,
		allVideos  : _allVideos
	};




}();







