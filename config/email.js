
module.exports = function() {
  var nodemailer = require("nodemailer");
  
  var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "__",
          pass: "__"
      }
  });
  


_email = function(order, res){

  var mailList = '__,'+order.email;

  var mailOptions={
      to : mailList,
      subject : 'Order Confirmation',
      text : 'Order#: '+order._id+'\r\n'+'Product Name: '+order.productName+'\r\n'+'Product Description: '+order.productDes+'\r\n' +'Product Size: '+order.productSize+' '+order.quantity+'\r\n'+'Company Name: '+order.company+'\r\n'+'Email: '+order.email+'\r\n'+'Phone Number: '+order.tell+'\r\n' +'Billing Address: '+order.billingAddress+'\r\n' +'Shipping Address: '+order.shippingAddress+'\r\n' +'Ship By: '+order.shipDate+'\r\n'+'You can check the status of your order at http://caragolzaina.com/order/'+order._id
  }
  // console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response){
   if(error){
      res.end("error");
   }else{
      res.end("sent");
   }

  })
}

_email2 = function(order, res){

  
  var mailOptions={
      to : order.email,
      subject : 'Order Status',
      text : 'Order#: '+order._id+'\r\n'+'Your order is '+ order.orderStatus +'.'+'You can check the status of your order at http://caragolzaina.com/order/'+order._id
  }
  smtpTransport.sendMail(mailOptions, function(error, response){
   if(error){
      res.end("error");
   }else{
      res.end("sent");
   }

  })
}//end mail2


_message = function(req, res){

  var message = req.body;

  
  var mailOptions={
      to : '__',
      subject : message.subject,
      text : 'Senders Name: '+message.name+'\r\n'+'Email: '+message.email+'\r\n'+'Phone: '+message.tell+'\r\n'+message.message
  // console.log(mailOptions);
  }
  smtpTransport.sendMail(mailOptions, function(error, response){
   if(error){
      res.end("error");
   }else{
      res.end("Message Sent");
   }

  })
}//message

return{
  sendMail: _email,
  sendMail2: _email2,
  message: _message
}


}();