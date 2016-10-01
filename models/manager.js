module.exports = function(){
    var mongoose    = require('mongoose');
        mongoose.Promise = require('bluebird');
	var bodyParser = require('body-parser');

    var Schema   = mongoose.Schema;
  
  	var contentGallerySchema = new mongoose.Schema({
	    imageUrl:     String,
	    category:     String,
	    createdAt:    Date,
	    visible:      String
	});

	var contentVideoSchema = new mongoose.Schema({
	    vidUrl:       String,
	    createdAt:    Date,
	    visible:      String
	});

	var _gal = mongoose.model('gallery', contentGallerySchema);
	var _vid = mongoose.model('videos', contentVideoSchema);


	_addMultipleImages = function (fileUrl, category, res){
		var gallery = new _gal({
		    imageUrl:     fileUrl,
		    category:     category,
		    createdAt:    new Date(),
		    visible:      'true'       
        	})
			// Save to Gallery
			gallery.save(function(err, doc){
				if (err) {
					throw err;
				}else{
  					console.log('Image Saved to Gallery');
				};	
  			});
	}

	_allGalleries = function(fail, success){
			_gal.find({visible:"true"}, function(err, doc){
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
		allGalleries  		: _allGalleries,
		addVideo  			: _addVideo,
		allVideos  			: _allVideos,
		addMultipleImages 	:_addMultipleImages
	};




}();







