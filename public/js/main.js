//Get Current Location
var currentLocation = location.pathname;

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
}else if (currentLocation == '/upload') {
    $("nav ul li:nth-child(8)").addClass("active");
}

//error slide up
$('.error, .success').slideDown(2000).slideUp(6000);
//carousel triggers
$('.mycarousel').carousel({full_width: true});
$('.carousel').carousel({dist:0, padding: 1});
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

//show hide1
$('#hideshow1').click(function() {        
  $('#ext-content').toggle(1500);
});
//show hide2
$('#hideshow2').click(function() {        
  $('#bra-content').toggle(1500);
});
//show hide3
$('#hideshow3').click(function() {        
  $('#sew-content').toggle(1500);
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

$('#name,#subject,#email,#tell,#mymessage').on('change', checkForm);
function checkForm(){
    valid = document.getElementById("message").checkValidity();
    if (valid == true){
      $('form .btn').prop("disabled", false);
    }else{
      $('form .btn').prop("disabled", true);
    }
}

$('#category,#file').on('change', uploadImage);
function uploadImage(){

    var x = $('#category').val();
    if (x != '') {
      $('.select-dropdown').addClass("valid");
    }

    valid = document.getElementById("imageUpload").checkValidity();
    console.log(valid)
    if (valid == true){
      $('#imageUpload .btn-large').prop("disabled", false);
    }else{
      $('#imageUpload .btn-large').prop("disabled", true);
    }
}

$('#videourl').on('change', uploadVideo);
function uploadVideo(){
    valid = document.getElementById("video").checkValidity();
    console.log(valid)
    if (valid == true){
      $('#video .btn-large').prop("disabled", false);
    }else{
      $('#video .btn-large').prop("disabled", true);
    }
}
