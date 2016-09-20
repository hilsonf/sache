
module.exports = function(app, passport, multer, multerResizer, tinify) {

var booking = require('../models/booking.js');
var calendar = require('../models/calendar');
var manager = require('../models/manager.js');
var email = require('../config/email');
var moment = require('moment');
var fs = require('fs');


const resizer = new multerResizer({
  multer: multer({storage: multer.diskStorage({
  destination: './uploads',
  filename: function (request, file, callback) {
    callback(null, file.originalname)
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

app.get('/update/:id', loggedIn, function (req, res) {
    var id = req.params.id;
    var user = req.user;
    booking.findBooking(id, function(result){ 
    var dt = {};
    dt.date = moment(result.bookDate).format('MMMM DD, YYYY'); 
    dt.time = moment(result.bookDate).format('h:mm');
    var data = {data:{booking: result,dateTime: dt, users: user}};
    res.render('updateapt', data);
  });

})

app.get('/dashboard',loggedIn, function (req, res, next) {
  booking.allBookings(res, function(result){
    var user = req.user;
    var data = {data:{bookings: result, users: user}};
    res.render('dashboard', data);
  });
});

app.get('/upload',loggedIn, function (req, res, next) {
  var user = req.user;
  var data = {data:{users: user}};
  res.render('upload', data);
});

app.get('/calendar',loggedIn, function (req, res, next) {
  var user = req.user;
  var data = {data:{users: user}};
  res.render('calendar', data);
});

app.get('/calendar-data', function(req, res){
  calendar.allCalendar(res, function(cal){
    res.send(cal);
  });
});



// ========================== ACTION =========================//



app.post('/addBooking',function(req, res){
  calendar.addCalendar(req, res, function(cal){
  booking.addBooking(req, cal, res);
  });
});

app.post('/deleteBooking',function(req, res){
  var id = req.body.bookingId;
  booking.deleteBooking(id, function(result){
  });

  booking.findBooking(id, function(b){
    var calId = b.calendarId
    calendar.findOneAndDelete(calId, function(result){
    })
    res.redirect('/calendar');
  })  
});

app.post('/message',function(req, res){
  email.message(req, res);
  res.redirect('/contact');
});

app.post('/addVideo',function(req, res){
  manager.addVideo(req, res);
  res.redirect('/videos');
});

app.post('/uploadImages', multipleupload, function(req, res, next) {
  manager.addMultipleImages(req, res);
  deleteMultipleImg(req);
  res.redirect('/lookbook');
});

app.post('/updateapt/:id', function(req, res, next) {
  booking.updateBooking(req, res, function(result){
  }); 
  var id = req.params.id;
  booking.findBooking(id, function(b){
    calendar.updateCalendar(req, b, res);
    res.redirect('/calendar');
  })     
});

app.post('/calendar-data', function(req, res){
  var mode = req.body["!nativeeditor_status"];

  if (mode == 'inserted') {
      calendar.manuallyAddCalendar(req, function(result){
        res.send();      
        res.redirect('back');
      });        
  }

  if (mode == 'updated') {
    calendar.findOneAndUpdate(req, function(result){
      res.send();
      res.redirect('back');
    })
  }

  if (mode == 'deleted') {
    var id = req.body.calendarId
    calendar.findOneAndDelete(id, function(result){
      res.send();
      res.redirect('back');
    })
  }
});

app.post('/login',
  passport.authenticate("local", {
    successRedirect : "/dashboard",
    failureRedirect : "/login",
    failureFlash: true
  })
);


// ========================== ACTION =========================//

}