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

//collapsable
$('.collapsible').collapsible({
  accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
});

//select
$('select').material_select();

//tabs
$('ul.tabs').tabs();

//load file when selected
function loadFile(event)  {
    var output = document.getElementById('pics');
    output.src = URL.createObjectURL(event.target.files[0]);
};

//load file when selected
function loadFile2(event)  {
    var output = document.getElementById('empPic');
    output.src = URL.createObjectURL(event.target.files[0]);
};

$('#senderName,#subject,#senderEmail,#senderTell,#senderMessage').on('change', function(){
  form_validate('message');
});

$('#empImg,#name,#position,#bio,#tell,#email').on('change', function(){
  form_validate('employee');
});

$('#imageUpload #service, #imageUpload #file').on('change', function(){
var x = $('#category').val();
    if (x != '') {
      $('#imageUpload .select-dropdown').addClass("valid");
    }
    form_validate('imageUpload');
});

$('#videourl').on('change',function(){
  form_validate('video');
});

$('#new-service').on('change',function(){
  form_validate('new-service');
});

$('#update-service').on('change',function(){
  form_validate('update-service');
});

$('#new-category').on('change',function(){
  var x = $('#new-category #service').val();
    if (x != '') {
      $('#new-category .select-dropdown').addClass("valid");
    }
    form_validate('new-category');
});

$('#update-category').change(function(){
  var x = $('#update-category #service').val();
    if (x != '') {
      $('#update-category .select-dropdown').addClass("valid");
    }
  form_validate('update-category');
});

$('#update-gallery').change(function(){
  var x = $('#update-gallery #service').val();
    if (x != '') {
      $('#update-gallery .select-dropdown').addClass("valid");
    }
  form_validate('update-gallery');
});


function form_validate(id){
    valid = document.getElementById(id).checkValidity();
    if (valid == true){
      $('#'+id+' .btn-large').prop("disabled", false);
    }else{
      $('#'+id+' .btn-large').prop("disabled", true);
    }
}

// ===== Scroll to Top ==== 
$(window).scroll(function() {
    if ($(this).scrollTop() > 100) {         
        $('#back-to-top').addClass('show').fadeIn(500);
    } else {
        $('#back-to-top').removeClass('show').fadeOut(500);
    }
});

$('#back-to-top').click(function() {       
    $('body,html').animate({
        scrollTop : 0                      
    }, 500);
});

// ===== Notice Modal ==== 
var executed = localStorage.getItem("executed");

if (!executed) {
  localStorage.setItem("executed", true);
  $("#notice").openModal();
}else{
  $("#notice").closeModal();
}


