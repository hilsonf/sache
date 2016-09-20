//Get Current Location
var currentLocation = location.pathname;
//Get Calendar Info
if (currentLocation == '/calendar') {
  scheduler.init('scheduler_here',new Date(),"month");
  scheduler.templates.xml_date = function(value){return new Date(value); };
  scheduler.load("/calendar-data", "json");

  scheduler.config.xml_date="%Y-%m-%d %H:%i";
  var dp = new dataProcessor("/calendar-data");
  dp.init(scheduler);
  dp.setTransactionMode("POST", false);
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
}else if (currentLocation == '/dashboard' || currentLocation == '/calendar' || currentLocation == '/upload') {
    $("nav ul li:nth-child(8)").addClass("active");
}

//error slide up
$('.error').slideDown(2000).slideUp(6000);
//carousel triggers
$('.mycarousel').carousel({full_width: true});
$('.carousel').carousel();
// nav trigger  
$(".button-collapse").sideNav({
  menuWidth: 300, // Default is 240
  edge: 'right' // Choose the horizontal origin
});
// prev image  
function prev(){
  $('.mycarousel').carousel('next');
}
// next image  
function next(){
  $('.mycarousel').carousel('prev');
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
    $(".datepicker").addClass("valid");
  }
}
});
//timepicker
$('.timepicker').pickatime({
  default: 'now',
  twelvehour: false, // change to 12 hour AM/PM clock from 24 hour
  donetext: 'Done',
  autoclose: true,
  vibrate: true // vibrate the device when dragging clock hand
});

//show hide1
$('#hideshow1').click(function() {        
  $('#ext-content').toggle('fast');
});
//show hide2
$('#hideshow2').click(function() {        
  $('#bra-content').toggle('fast');
});
//show hide3
$('#hideshow3').click(function() {        
  $('#sew-content').toggle('fast');
});
//collapsable
$('.collapsible').collapsible({
  accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
});
//select
$('select').material_select();

//load file when selected
function loadFile(event)  {
    var output = document.getElementById('pics');
    output.src = URL.createObjectURL(event.target.files[0]);
};


$('#firstName,#lastName,#tell,#bookDate,#bookTime').on('change', checkForm);

function checkForm(){
    var validation = document.getElementById("booking").checkValidity();
    if (validation == true){
      $('form .btn').prop("disabled", false);
    }else{
      $('form .btn').prop("disabled", true);
    }
}

//Submit Reservation
function submitBooking() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var tell = document.getElementById("tell").value;
    var bookDate = document.getElementById("bookDate").value;
    var bookTime = document.getElementById("bookTime").value;

    var d = new Date(bookDate+' '+bookTime+':00');
    var calId = createEvent(d)
    var data = {};
    var booking =[];
    data.firstName = firstName;
    data.lastName = lastName;
    data.tell = tell;
    data.bookDate = d;
    data.calendarId = calId;
   
    booking.push(data);

    var newApt = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/addBooking');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(newApt);

    //open modal
    $('#modal1').openModal();
    //resets form
    document.forms['booking'].reset();
}//end submit

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
  

function createEvent(date){
  var eventId = scheduler.addEvent({
    start_date: date,
    end_date:   date,
    text:   "Event"
  });

  var eventObj = scheduler.getEvent(eventId);
  return eventObj.id
}





