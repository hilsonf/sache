
module.exports = function(app, passport) {

var order = require('../public/models/order.js');
var products = require('../data/products.json');
var email = require('../config/email');


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

app.get('/products', function (req, res) {
  res.render('products', products);
})

app.get('/recipes', function (req, res) {
  res.render('recipes');
})

app.get('/order', function (req, res) {
  res.render('order');
})

app.get('/contact', function (req, res) {
  res.render('contact');
})

app.get('/sizes', function (req, res) {
  var backId = req.headers.referer; 
  res.render('sizes', {back: backId});
})

app.get('/order/:id', function (req, res) {
  var id = req.params.id;
  order.userOrder(id, function(result){
    res.render('customerorder', {order: result});
  });
})

app.get('/products/:id', function (req, res) {
  var id = req.params.id;
  if (id == 1) {
    res.render('products/anchovies', products);
  }else if (id == 2) {
    res.render('products/olives', products);
  }else if (id == 3) {
    res.render('products/mushrooms', products);
  }else if (id == 4) {
    res.render('products/oliveoil', products);
  }else if (id == 5) {
    res.render('products/pesto', products);
  }else if (id == 6) {
    res.render('products/peppers', products);
  }else if (id == 7) {
    res.render('products/brazilnuts', products);
  }else if (id == 8) {
    res.render('products/quinoa', products);
  }else if (id == 9) {
    res.render('products/heartofpalms', products);
  }else if (id == 10) {
    res.render('products/sardines', products);
  }else if (id == 11) {
    res.render('products/atichokes', products);
  }else if (id == 12) {
    res.render('products/lemons', products);
  }else if (id == 13) {
    res.render('products/capers', products);
  }else if (id == 14) {
    res.render('products/caperberries', products);
  }else if (id == 15) {
    res.render('products/cornichons', products);
  }
  
})

app.get('/dashboard',loggedIn, function (req, res, next) {
	order.allOrders(res, function(result){
	  var user = req.user;
	  var data = {data:{orders: result, users: user}};
	  res.render('dashboard', data);
	});
});



// ========================== ACTION =========================//



app.post('/order',function(req, res){
	order.addOrder(req, res);
});


app.post('/deleteOrder',function(req, res){
  var id = req.body.orderId;
  order.deleteOrder(id, function(result){
  });
});


app.post('/updateOrder',function(req, res){
  order.updateOrder(req, res, function(result){
  });
});

app.post('/message',function(req, res){
   //Send Email
   email.message(req, res);
   res.redirect('/#contact');
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