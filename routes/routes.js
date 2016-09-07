//866-416-5690
//1800-325-2424
module.exports = function(app, passport, multer, multerResizer) {

var booking = require('../models/booking.js');
var calendar = require('../models/calendar');
var manager = require('../models/manager.js');
var email = require('../config/email');
var helpers = require('../config/helpers');







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

app.get('/bookapt', function (req, res) {
  res.render('bookapt');
})


app.get('/dashboard',loggedIn, function (req, res, next) {
  booking.allBookings(res, function(result){

    helpers.dateformat(result[0].bookDate);

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
	booking.addBooking(req, res);
  calendar.addCalendar(req, res);
});


app.post('/deleteBooking',function(req, res){
  var id = req.body.bookingId;
  booking.deleteBooking(id, function(result){
  });
});


app.post('/message',function(req, res){
   //Send Email
   email.message(req, res);
   res.redirect('/#contact');
});


app.post('/uploadImage', upload, function(req, res, next) {
  manager.addImage(req, res);
  res.redirect('/lookbook');
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