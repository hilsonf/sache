
module.exports = function() {
  var nodemailer = require("nodemailer");
  
  var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "sachebeautystudio@gmail.com",
          pass: "__"
      }
  });
  


_message = function(req, res){

  var message = req.body;

  var mailOptions={
      from: message.email,
      to : 'sachebeautystudio@gmail.com',
      subject : message.subject,
      text : 'Senders Name: '+message.name+'\r\n'+'Email: '+message.email+'\r\n'+'Phone: '+message.tell+'\r\n'+message.mymessage
  }
  smtpTransport.sendMail(mailOptions, function(error, response){
   if(error){
      res.end("error");
   }else{
      res.end("Message Sent");
   }

  })
}

return{
  message: _message
}


}();