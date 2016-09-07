module.exports = function(){
    var moment = require('moment');

    _dateformat = function (date) { return moment(date).format('MMMM Do, YYYY h:mm a') }

    return{
    	dateformat: _dateformat
    }

}();