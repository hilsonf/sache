
// nav trigger  
$(".button-collapse").sideNav({
  menuWidth: 300, // Default is 240
  edge: 'right', // Choose the horizontal origin
  closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
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
// select 
$('select').material_select();
// material boxed 
// $('.materialboxed').materialbox();
//tooltip
$('.tooltipped').tooltip({delay: 50});
// date picker 
$('.datepicker').pickadate({
selectMonths: true, // Creates a dropdown to control month
selectYears: 15, // Creates a dropdown of 15 years to control year
onSet: function (day) {
  if(day.select){
    this.close();
  }
}
});


//get date
var getDate = function(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var hhhh = today.getHours(); 
  var mmmm = today.getMinutes();
  var s = today.getSeconds();
  if(dd<10) {
     dd='0'+dd
  } 
  if(mm<10) {
     mm='0'+mm
   } 
  if(mmmm<10) {
     mmmm='0'+mmmm
   } 
   today = yyyy+'-'+mm+'-'+dd+'T'+hhhh+':'+mmmm+':'+s;
   return today;
}
//form submit
function submitOrder() {

  if (validation()){

    var productName = document.getElementById("productName").value;
    var productDes = document.getElementById("productDes").value;
    var productSize = document.getElementById("productSize").value;
    var quantity = document.getElementById("quantity").value;
    var company = document.getElementById("company").value;
    var email = document.getElementById("email").value;
    var tell = document.getElementById("tell").value;
    var billingAddress = document.getElementById("billingAddress").value;
    var shippingAddress = document.getElementById("shippingAddress").value;
    var shipDate = document.getElementById("shipDate").value;

    var data = {};
    var order =[];
    data.productName = productName;
    data.productDes = productDes;
    data.productSize = productSize;
    data.quantity = quantity;
    data.company = company;
    data.email = email; 
    data.tell = tell;
    data.billingAddress = billingAddress;
    data.shippingAddress = shippingAddress;
    data.shipDate = shipDate;
    data.createdAt = getDate();

    order.push(data);

    var newOrder = JSON.stringify(data);
    console.log(newOrder);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/order');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(newOrder);

    //open modal
    $('#modal1').openModal();
    //resets form
    document.forms['order'].reset();

}//end if
}//end submit

//validation
function validation() {
  var productName = document.getElementById("productName").value;
  var productDes = document.getElementById("productDes").value;
  var productSize = document.getElementById("productSize").value;
  var quantity = document.getElementById("quantity").value;
  var company = document.getElementById("company").value;
  var email = document.getElementById("email").value;
  var tell = document.getElementById("tell").value;
  var billingAddress = document.getElementById("billingAddress").value;
  var shippingAddress = document.getElementById("shippingAddress").value;
  var shipDate = document.getElementById("shipDate").value;

  if (productName === '' || productDes === ''|| productSize === ''|| quantity === ''|| company === ''|| email === ''|| tell === ''|| billingAddress === ''|| shippingAddress === ''|| shipDate === '') {
    $('#formError').openModal();
    return false;
  }else {
    return true;
  }
}

//delete order
function deleteOrder(orderId){
  $('#delete').openModal();
  var yes = document.getElementById("yes");
  
  //yes delete order
  yes.onclick = function(){
      console.log(orderId);
      var order_Id = JSON.stringify({orderId});
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/deleteOrder');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(order_Id);
  }

}


function updateOrder(orderId, email){
  $('#update').openModal();
  var transit = document.getElementById("transit");
  var complete = document.getElementById("complete");
  
  //order in transit order
  transit.onclick = function(){
      var status = 'In Transit';
      var order = {};
      order._id = orderId;
      order.orderStatus = status;
      order.email = email;
     
      var data = JSON.stringify({order});
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/updateOrder');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data);
  }
  
  //order complete
  complete.onclick = function(){
      var status = 'Complete';
      var order = {};
      order._id = orderId;
      order.orderStatus = status;
      order.email = email;
     
      var data = JSON.stringify({order});
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/updateOrder');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data);
  }

}

