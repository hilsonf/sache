
module.exports = function(app, passport, multer, multerResizer) {

var booking = require('../public/models/booking.js');
var manager = require('../public/models/manager.js');
var email = require('../config/email');



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
                width: 100,
                height: 100,
                interpolation: 'linear',
                format: 'png'
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



// ========================== ACTION =========================//



app.post('/addBooking',function(req, res){
	booking.addBooking(req, res);
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

  console.log(req.file);
  manager.addImage(req, res);
  res.redirect('/manager');

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