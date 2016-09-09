
module.exports = function() {
  var nodemailer = require("nodemailer");
  
  var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "sachebeautystudio@gmail.com",
          pass: "__"
      }
  });
  


_email = function(order, res){

  var mailList = 'sachebeautystudio@gmail.com';

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

_message = function(req, res){

  var message = req.body;

  var mailOptions={
      from: message.email,
      to : 'sachebeautystudio@gmail.com',
      subject : message.subject,
      text : 'Senders Name: '+message.name+'\r\n'+'Email: '+message.email+'\r\n'+'Phone: '+message.tell+'\r\n'+message.message
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
  message: _message
}


}();