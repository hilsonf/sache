
// nav trigger  
$(".button-collapse").sideNav({
  menuWidth: 300, // Default is 240
  edge: 'right', // Choose the horizontal origin
  //closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
});
// caroucel trigger  
$('.carousel').carousel({full_width: true});
// prev image  
function prev(){
  $('.carousel').carousel('next');
}
// next image  
function next(){
  $('.carousel').carousel('prev');
}
// Tooltip 
$('.tooltipped').tooltip({delay: 50});

// date picker 
$('.datepicker').pickadate({
selectMonths: true, // Creates a dropdown to control month
selectYears: 15, // Creates a dropdown of 15 years to control year
format: 'mmmm dd, yyyy',
onSet: function (day) {
  if(day.select){
    this.close();
  }
}
});

$('.timepicker').pickatime({
  default: 'now',
  twelvehour: false, // change to 12 hour AM/PM clock from 24 hour
  donetext: 'OK',
  autoclose: false,
  vibrate: true // vibrate the device when dragging clock hand
});

$('#hideshow1').click(function() {        
  $('#ext-content').toggle('fast');
});

$('#hideshow2').click(function() {        
  $('#bra-content').toggle('fast');
});

$('#hideshow3').click(function() {        
  $('#sew-content').toggle('fast');
});


$('.collapsible').collapsible({
  accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
});

//Get Current Location
var currentLocation = location.pathname;
console.log(currentLocation);

//Get Calendar Info
if (currentLocation == '/calendar') {
  scheduler.init('scheduler_here',new Date(),"month");
  scheduler.templates.xml_date = function(value){ return new Date(value); };
  scheduler.load("/calendar-data", "json");
}

//Add Active Class on Tab
if (location.hash) {
    $("nav ul li:nth-child(2)").addClass("active");
}else if (currentLocation == '/') {
    $("nav ul li:nth-child(1)").addClass("active");
}else if (currentLocation == '/contact') {
    $("nav ul li:nth-child(3)").addClass("active");
}else if (currentLocation == '/stylists') {
    $("nav ul li:nth-child(4)").addClass("active");
}else if (currentLocation == '/pricelist') {
    $("nav ul li:nth-child(5)").addClass("active");
}else if (currentLocation == '/lookbook' || currentLocation == '/videos') {
   $("nav ul li:nth-child(6)").addClass("active");
}else if (currentLocation == '/bookapt') {
    $("nav ul li:nth-child(7)").addClass("active");
}
 
//Submit Reservation
function submitBooking() {

  if (validation()){

    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var tell = document.getElementById("tell").value;
    var bookDate = document.getElementById("bookDate").value;
    var bookTime = document.getElementById("bookTime").value;

    var d = new Date(bookDate+' '+bookTime+':00');
    var data = {};
    var booking =[];
    data.firstName = firstName;
    data.lastName = lastName;
    data.tell = tell;
    data.bookDate = d;
   

    booking.push(data);

    var newApt = JSON.stringify(data);
    console.log(newApt);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/addBooking');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(newApt);

    //open modal
    $('#modal1').openModal();
    // //resets form
    document.forms['booking'].reset();

}//end if
}//end submit

//Reservation Validation
function validation() {
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var tell = document.getElementById("tell").value;
  var bookDate = document.getElementById("bookDate").value;
  var bookTime = document.getElementById("bookTime").value;

  if (firstName === '' || lastName === ''|| tell === ''|| bookDate === ''|| bookTime === '') {
    $('#formError').openModal();
    return false;
  }else {
    return true;
  }
}

//Delete Reservation
function deleteBooking(bookingId){
  $('#delete').openModal();
  var yes = document.getElementById("yes");
  //yes delete order
  yes.onclick = function(){
      var booking_Id = JSON.stringify({bookingId});
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/deleteBooking');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(booking_Id);
  }
}
  







