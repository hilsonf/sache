
module.exports = function(app, passport, multer, multerResizer) {

var booking = require('../models/booking.js');
var calendar = require('../models/calendar');
var manager = require('../models/manager.js');
var email = require('../config/email');
var helpers = require('../config/helpers');
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

var upload = resizer.single('file');

function deleteImg(req){
  var oldImg = './'+req.path ; 
  fs.unlinkSync(oldImg);
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
  res.render('home');
})

app.get('/login', function (req, res) {
  var error = req.flash();
  res.render('login', error);
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
  manager.allImages(res, function(result){
  var data = {data:{uploads: result}};
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
  res.render('stylists');
})

app.get('/pricelist', function (req, res) {
  res.render('pricelist');
})

app.get('/update/:id', loggedIn, function (req, res) {
  booking.userBooking(id, function(result){ 
    var id = req.params.id;
    var user = req.user;
    var dt = {};
    dt.date = moment(result.bookDate).format('MMMM DD, YYYY'); 
    dt.time = moment(result.bookDate).format('h:mm');
    var data = {data:{booking: result,dateTime: dt, users: user}};
    res.render('updateapt', data);
  });

})


app.get('/dashboard',loggedIn, function (req, res, next) {
  booking.allBookings(res, function(result){
    if(result.length > 0){
      helpers.dateformat(result[0].bookDate);
    }
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
});

app.post('/message',function(req, res){
  email.message(req, res);
  res.redirect('/contact');
});

app.post('/addVideo',function(req, res){
  manager.addVideo(req, res);
  res.redirect('/videos');
});


app.post('/uploadImage', upload, function(req, res, next) {
  manager.addImage(req, res);
  deleteImg(req.file);
  res.redirect('/lookbook');
});

app.post('/updateapt/:id', function(req, res, next) {
  booking.updateBooking(req, res, function(result){
  }); 
  var id = req.params.id;
  booking.userBooking(id, function(b){
    calendar.updateCalendar(req, b, res);
    res.redirect('/calendar');
  })     
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