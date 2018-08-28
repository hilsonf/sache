module.exports = function(){
    var mongoose    = require('mongoose');
        mongoose.Promise = require('bluebird');
	var bodyParser = require('body-parser');

    var Schema   = mongoose.Schema;
  
  	var employeeSchema = new mongoose.Schema({
	    name:     	  String,
	    position:     String,
	    bio:     	  String,
	    tell:     	  Number,
	    email:     	  String,
	    imageUrl:     String
	});


	var _emp = mongoose.model('employee', employeeSchema);

	_allEmployees = function(success){
			_emp.find({}, function(err, doc){
				if(err){
					fail(err);
				}else{
					success(doc);
				}
			});
		}


	_addEmployee = function (req, res){

		var empImg = req.file.path;

		var employee = new _emp({
			name: req.body.name,
			position: req.body.position,
			bio: req.body.bio,
			tell: req.body.tell,
			email: req.body.email,
			imageUrl: empImg
			      
        	})
			// Save to Database
			employee.save(function(err, doc){
				if (err) {
					throw err;
				}else{
  					console.log('Employee Saved to DB');
				};
    			
  			});
	}

	_removeEmployee = function(req, res, success){
		_emp.findOneAndRemove({_id: req.params.id},function(err, doc) {
			if (err) {
				throw err;
			}else{
				success(doc);
			}
		});
	}

	_updateEmployee = function(req, res, success){
		var id = req.params.id;

		  var empImg = '';
		  if (!req.file) {
		    empImg = req.body.oldempImg
		  }else{
		    empImg = req.file.path
		  }

		_emp.update({_id: id},{$set:{
			name: req.body.updatename,
			position: req.body.updateposition,
			bio: req.body.updatebio,
			tell: req.body.updatetell,
			email: req.body.updateemail,
			imageUrl: empImg
		}}, function(err, doc){
			if(err){
				throw err;
			}else{
				success(doc);
			}
		})
	}



	return {
		allEmp  	: _allEmployees,
		addEmp		: _addEmployee,
		removeEmp  	: _removeEmployee,
		updateEmp  	: _updateEmployee 
	};




}();







