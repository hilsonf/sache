module.exports = function(app, passport, multer) {

var manager = require('../models/manager');
var email = require('../config/email');
var employee = require('../models/employee');
var moment = require('moment');
var fs = require('fs');
var tinify = require("tinify");
tinify.key = "x89sve_Thw1Qaw5fmpC8FHyb6SgjcFii";

var upload = multer({storage: multer.diskStorage({
  destination: './uploads',
  filename: function (request, file, callback) {
    callback(null, Date.now()+'-'+file.originalname)
  }})})

var multipleupload = upload.array('file');

var employeeupload = upload.single('empImg');

var employeeupdate = upload.single('updateempImg');

function loggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}


// =========== ROUTES ============//


app.get('/', function (req, res) {
  res.render('home');
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
  res.render('contact');
})

app.get('/lookbook', function (req, res) {
    manager.allGalleries(function(fail){}, function(gal){
       var data = {data:{gallery: gal}};
       res.render('lookbook', data);
    })
})

app.get('/videos', function (req, res) {
  manager.allVideos(res, function(result){
  var data = {data:{videos: result}};
  res.render('videos', data);
  })
})

app.get('/bookapt', function (req, res) {
  res.render('bookapt');
})

app.get('/stylists', function (req, res) {
  employee.allEmp(function(result){
    var data = {employees: result};
    res.render('stylists', data);
   })
})

app.get('/pricelist', function (req, res) {
  res.render('pricelist');
})

app.get('/deleteEmployee/:id', function (req, res) {
  var id = req.params.id;
  if (id) {
    employee.removeEmp(id)
    req.flash('uploadMessage', '☺ Employee Sucessfull Removed!!');
    res.redirect('/upload');  
  }else{
    req.flash('uploadMessage', '☹ Sorry Fail to remove Employee!!');
    res.redirect('/upload');  
  }
})

app.get('/upload',loggedIn, function (req, res) {
   employee.allEmp(function(result){

    var message =  req.flash('uploadMessage');
    var data    = {data:{message: message, employees: result}};
    res.render('upload', data);

   })
  
});




// ========================== ACTION =========================//

app.post('/message', function(req, res){
  email.message(req, res);
  res.redirect('/contact');
});

app.post('/addVideo', function(req, res){
  var videourl = req.body.videourl;
  
  if (videourl) {
    manager.addVideo(req, res); 
    req.flash('uploadMessage', '☺ Video Upload Sucessfull!! View In Gallery Videos');
    res.redirect('/upload'); 
  }
  
});

app.post('/uploadImages', multipleupload, function(req, res, next) {
  var files = req.files;

  if (files) {
  files.forEach(function(file){
    var category = req.body.category;
    var str = file.path; 
    var res = str.slice(0,str.indexOf('.'));
    var fileUrl = res + "_optimized.jpg";


    var source = tinify.fromFile(file.path);
    var resized = source.resize({
      method: "fit",
      width: 800,
      height: 800
    });
    resized.toFile(fileUrl);

       
    var oldImg = file.path
    fs.unlinkSync(oldImg);

    manager.addMultipleImages(fileUrl, category, res);
  })
    req.flash('uploadMessage', '☺ Image Upload Sucessfull!! View In Gallery Look Book');
    res.redirect('/upload');
  }else{
    req.flash('uploadMessage', '☹ Sorry Image Upload Sucessfull!! Try Again');
    res.redirect('/upload');
  }
  
});

app.post('/employeeupload', employeeupload, function(req, res, next) {
 var empImg = req.file;
 if (empImg) {
   employee.addEmp(req, res);
   req.flash('uploadMessage', '☺ Employee Sucessfully Added!!');
   res.redirect('/upload');
 }else{
   req.flash('uploadMessage', '☹ Sorry there was a problem adding the new employee!!');
   res.redirect('/upload');
 }
})

app.post('/updateEmployee/:id', employeeupdate, function(req, res){
   employee.updateEmp(req, res, function(result){
    if (result) {
      req.flash('uploadMessage', '☺ Employee Sucessfully Updated!!');
      res.redirect('/upload');
    }else{
      req.flash('uploadMessage', '☹ Sorry faild to Update Employee!!');
      res.redirect('/upload');
    }
   })
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