module.exports = function(app, passport, multer) {

  var manager = require('../models/manager');
  var email = require('../config/email');
  var employee = require('../models/employee');
  var service = require('../models/service');
  var category = require('../models/category');
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
    res.render('home', {page: 'home'});
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
    res.render('contact', {page: 'contact'});
  })

  app.get('/lookbook', function (req, res) {
    service.allServGal(function(result){
      var data = {data:{services: result}, page: 'gallery'};
      res.render('lookbook', data);
    })
  })

  app.get('/videos', function (req, res) {
    manager.allVideos(req, res, function(result){
      var data = {data:{videos: result}, page: 'gallery'};
      res.render('videos', data);
    })
  })

  app.get('/bookapt', function (req, res) {
    res.render('bookapt', {page: 'bookapt'});
  })

  app.get('/stylists', function (req, res) {
    employee.allEmp(function(result){
      var data = {employees: result, page: 'stylists'};
      res.render('stylists', data);
    })
  })

  app.get('/pricelist', function (req, res) {
    service.allServ(function(result){
      var data = {services: result, page: 'pricelist'};
      res.render('pricelist', data);
    })
  })

  app.get('/upload',loggedIn, function (req, res) {
    employee.allEmp(function(employees){
      category.allCat(function(categories){
        service.allServ(function(services){
          manager.missingGal(function(missing_galleries){
            var message =  req.flash('success_msg');
            var data    = {data:{ message: message, employees: employees, categories: categories, services: services, missing_galleries: missing_galleries }, page: 'manager'};
            res.render('upload', data);
          })
        })
      })
    })
  });

  app.get('/update-category/:id', function (req, res, next) {
    category.findCat(req, res, function(category){  
      service.allExcept(category, function(services){
        if (category && services) {
          message =  req.flash('success_msg');
          data = {data:{ message: message, category: category, services: services }};
          res.render('category', data);
        }
      })
    })
  })

  app.get('/update-service/:id', function (req, res, next) {
    service.findServ(req, res, function(service){
      category.allCat(function(categories){
        if (service && categories) {
          message =  req.flash('success_msg');
          data = {data:{ message: message, service: service, categories: categories }};
          res.render('service', data);
        }
      })
    })
  })

  app.get('/update-gallery/:id', function (req, res) {
    manager.findGal(req, res, function(gallery){  
      service.allServ(function(services){
        if (gallery && services) {
          message =  req.flash('success_msg');
          data = {data:{ message: message, gallery: gallery, services: services }};
          res.render('gallery', data);
        }
      })
    })
  })





  // ========================== ACTION =========================//

  app.post('/message', function(req, res){
    email.message(req, res);
    res.redirect('/contact');
  });

  app.post('/addVideo', function(req, res){
    var videourl = req.body.videourl;

    if (videourl) {
      manager.addVideo(req, res); 
      req.flash('success_msg', '☺ Video Upload Sucessfull!! View In Gallery Videos');
      res.redirect('/upload'); 
    }

  });

  app.post('/uploadImages', multipleupload, function(req, res, next) {
    var files = req.files;
    var count = 0
    if (files) {
      files.forEach(function(file){
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

        manager.addMultipleImages(fileUrl, req, res, function(result){
          count ++
          if (count == files.length) {
            setTimeout(function(){
              next()
            },count*800)
          }
        });
      })
      function next(){
        req.flash('success_msg', '☺ Image Upload Sucessfull!! View In Gallery Look Book');
        res.redirect('/upload');
      }
    }else{
      req.flash('error_msg', '☹ Sorry Image Upload Sucessfull!! Try Again');
      res.redirect('/upload');
    }

  });

  app.post('/employee-upload', employeeupload, function(req, res, next) {
    var empImg = req.file;
    if (empImg) {
      employee.addEmp(req, res);
      req.flash('success_msg', '☺ Employee Sucessfully Added!!');
      res.redirect('/upload');
    }else{
      req.flash('error_msg', '☹ Sorry there was a problem adding the new employee!!');
      res.redirect('/upload');
    }
  })

  app.post('/update-employee/:id', employeeupdate, function(req, res){
    employee.updateEmp(req, res, function(result){
      if (result) {
        req.flash('success_msg', '☺ Employee Sucessfully Updated!!');
        res.redirect('/upload');
      }else{
        req.flash('error_msg', '☹ Sorry faild to Update Employee!!');
        res.redirect('/upload');
      }
    })
  });

  app.delete('/delete-employee/:id', function (req, res) {
    if (req.params.id) {
      employee.removeEmp(req, res, function(result){
        //remove image file
        fs.unlinkSync(result.imageUrl);
        req.flash('success_msg', '☺ Employee Sucessfull Removed!!');
        res.redirect('/upload'); 
      }) 
    }else{
      req.flash('error_msg', '☹ Sorry Fail to remove Employee!!');
      res.redirect('/upload');  
    }
  })

  app.post('/new-service', function(req, res){
    if(req.body) {
      service.addServ(req, res, function(result){
        req.flash('success_msg', '☺ Service Sucessfully Added!!');
        res.redirect('/upload');
      });
    }else{
      req.flash('error_msg', '☹ Sorry there was a problem adding the new Service!!');
      res.redirect('/upload');
    }
  });

  app.post('/update-service', function(req, res){
    if (req.body.name) {
      service.updateServ(req, res, function(result){
        res.redirect(req.headers.referer);
        req.flash('success_msg', '☺ Service Sucessfully Updated!!');
      })
    }else{
      req.flash('error_msg', '☹ Sorry there was a problem updating your service!!');
      res.redirect(req.headers.referer);
    }
  });

  app.delete('/delete-service/:id', function(req, res){
    if (req.params.id) {
      service.removeServ(req, res, function(service){
        category.updateServ(req,res, function(categories){
          manager.updateServ(req,res, function(galleries){
            req.flash('success_msg', '☺ Service Sucessfully Deleted!!');
            res.redirect('/upload');
          })
        })
      })
    }else{
      req.flash('error_msg', '☹ Sorry there was a problem deleting this service');
      res.redirect('/upload');
    }
  })

  app.post('/new-category', function(req, res){
    if (req.body.name && req.body.price) {
      category.addCat(req, res, function(result){
        req.flash('success_msg', '☺ Category Sucessfully Added!!');
        res.redirect('/upload');
      })
    }else{
      req.flash('error_msg', '☹ Sorry there was a problem adding the new category!!');
      res.redirect('/upload');
    }
  });

  app.post('/update-category', function(req, res){
    if (req.body.name && req.body.price) {
      category.updateCat(req, res, function(result){
        req.flash('success_msg', '☺ Category Sucessfully Updated!!');
        res.redirect(req.headers.referer);
      })
    }else{
      req.flash('error_msg', '☹ Sorry there was a problem updating your category!!');
      res.redirect(req.headers.referer);
    }
  });

  app.delete('/delete-category/:id', function(req, res){
    if (req.params.id) {
      category.removeCat(req, res, function(result){
        req.flash('success_msg', '☺ Category Sucessfully Deleted!!');
        res.redirect('/upload');
      })
    }else{
      req.flash('error_msg', '☹ Sorry there was a problem deleting your category!!');
      res.redirect('/upload');
    }
  })

  app.delete('/delete-gallery/:id', function(req, res){
    if (req.params.id) {
      manager.removeGal(req, res, function(result){
        //remove image file
        fs.unlinkSync(result.imageUrl);
        req.flash('success_msg', '☺ Gallery Sucessfully Deleted!!');
        res.redirect('/upload');
      })
    }else{
      req.flash('error_msg', '☹ Sorry there was a problem deleting your gallery!!');
      res.redirect('/upload');
    }
  })

  app.post('/update-gallery', function(req, res){
    if (req.body.id) {
      manager.updateGal(req, res, function(result){
        req.flash('success_msg', '☺ Gallery Sucessfully Updated!!');
        res.redirect('/upload');
      })
    }else{
      req.flash('error_msg', '☹ Sorry there was a problem deleting your gallery!!');
      res.redirect(req.headers.referer);
    }
  })

  app.post('/login',passport.authenticate("local", {
    successRedirect : "/upload",
    failureRedirect : "/login",
    failureFlash: true
  }));


// ========================== ACTION =========================//
}