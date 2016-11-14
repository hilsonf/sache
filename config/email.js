
module.exports = function() {
  var nodemailer = require("nodemailer");
  
  var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "sachebeautystudio@gmail.com",
          pass: "Smiling123"
      }
  });
  


_message = function(req, res){

  var message = req.body;

  var mailOptions={
      from : message.senderName+" <"+message.senderEmail+">",
      to : 'sachebeautystudio@gmail.com',
      subject : message.subject,
      text : 'Senders Name: '+message.senderName+'\r\n'+'Email: '+message.senderEmail+'\r\n'+'Phone: '+message.senderTell+'\r\n'+message.senderMessage
  }
  smtpTransport.sendMail(mailOptions, function(error, response){
   if(error){
      console.log(error);
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