
module.exports = function(app, passport, multer, multerResizer) {

var manager = require('../models/manager.js');
var email = require('../config/email');
var moment = require('moment');
var fs = require('fs');


const resizer = new multerResizer({
  multer: multer({storage: multer.diskStorage({
  destination: './uploads',
  filename: function (request, file, callback) {
    callback(null, Date.now()+'-'+file.originalname)
  }
})}),
   tasks: [
        {
            resize: {
                width: 800,
                height: 800,
                interpolation: 'linear',
                format: 'jpg'
            }
        }
    ]

})


var multipleupload = resizer.array('file');

function deleteMultipleImg(req){
  var files = req.files
  for (var i = 0; i < files.length; i++) {
      var oldImg = files[i].path
      fs.unlinkSync(oldImg);
    }
}

function loggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}


// =========== ROUTES ============//


app.get('/', function (req, res) {
  var user = req.user;
  var data = {data:{users: user}};
  res.render('home', data);
})

app.get('/login', function (req, res) {
  var error = req.flash('error');
  res.render('login', {error:error});
})

app.get('/logout', function (req, res, next) {
  req.session.destroy(function(err){
  	req.logout();
    res.redirect('/login');
  })  
})

app.get('/contact', function (req, res) {
  var user = req.user;
  var data = {data:{users: user}};
  res.render('contact', data);
})

app.get('/lookbook', function (req, res) {
    manager.allGalleries(function(fail){}, function(gal){
       var user = req.user;
       var data = {data:{gallery: gal, users: user}};
       res.render('lookbook', data);
    })
})

app.get('/videos', function (req, res) {
  manager.allVideos(res, function(result){
  var user = req.user;
  var data = {data:{videos: result, users: user}};
  res.render('videos', data);
  })
})

app.get('/bookapt', function (req, res) {
  var user = req.user;
  var data = {data:{users: user}};
  res.render('bookapt',data);
})

app.get('/stylists', function (req, res) {
  var user = req.user;
  var data = {data:{users: user}};
  res.render('stylists', data);
})

app.get('/pricelist', function (req, res) {
  var user = req.user;
  var data = {data:{users: user}};
  res.render('pricelist', data);
})

app.get('/upload',loggedIn, function (req, res) {
  var user = req.user;
  var data = {data:{users: user}};
  res.render('upload', data);
});




// ========================== ACTION =========================//

app.post('/message', function(req, res){
  email.message(req, res);
  res.redirect('/contact');
});

app.post('/addVideo', function(req, res){
  manager.addVideo(req, res);
  res.redirect('/videos');
});

app.post('/uploadImages', multipleupload, function(req, res, next) {
  manager.addMultipleImages(req, res);
  deleteMultipleImg(req);
  res.redirect('/lookbook');
});

app.post('/login',
  passport.authenticate("local", {
    successRedirect : "/upload",
    failureRedirect : "/login",
    failureFlash: true
  })
);


// ========================== ACTION =========================//
}