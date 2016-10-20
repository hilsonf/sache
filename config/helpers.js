"use strict";
var helpers = module.exports;

helpers.is = function(a, b, options) {
  if (arguments.length === 2) {
    options = b;
    b = options.hash.compare;
  }
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
};


helpers.sort = function(data, value, heading) {
	var str = '<div class="row">'+
	'<div class="container headings">'+
	  '<h2 class="center">'+heading+'</h2>'+
	  '<hr>'+
	'</div>'+
	'<div class="swap"><i class="material-icons">swap_horiz</i></div>'+
	'<div class="carousel">';
	data.forEach(function(gal){
	if (gal.category === value) {
 	 str += '<a class="carousel-item" href="#!"><img src="'+gal.imageUrl+'" alt="sache_gallery_images"></a>';

	}
	})
	str += '</div>'+
			'</div>'+
			'</div>'+
			'<div class="row"></div>'+
			'<div class="row"></div>';
	return str;
};



