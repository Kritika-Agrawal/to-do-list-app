var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var TODOLIST_FILE = path.join(__dirname, 'ToDoList.json');
var fs = require("fs");
var stats = fs.statSync(TODOLIST_FILE);
var fileSizeInBytes = stats["size"];
var port = process.env.PORT || 3000 ;
if(fileSizeInBytes == 0){
	fs.writeFile(TODOLIST_FILE, "[]", function(err){
		if (err){
			console.error(err);
			process.exit(1);
		}
 	});
}
 
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('', function (req, res){
   res.sendFile(__dirname + "/public/" + "index.htm");
});

app.get('/api/ToDoList', function (req, res){
    fs.readFile(TODOLIST_FILE, function(err, data){
    if (err){
      console.error(err);
      process.exit(1);
    }
	res.json(JSON.parse(data));
	});
});

app.delete('/api/ToDoList', function(req, res){
	fs.readFile(TODOLIST_FILE, function(err, data){
		if (err){
		  console.error(err);
		  process.exit(1);
		}
		var data = JSON.parse(data);
		var toDelete = req.body.buttonId; // contains the id of the task to delete
		for(var i = 0 ; i < data.length ; i++){
			if(data[i] != null && data[i].id == toDelete){
				data.splice(i,1);
				break;
			}
		}	
		fs.writeFile(TODOLIST_FILE, JSON.stringify(data), function(err){
		  if (err){
			console.error(err);
			process.exit(1);
		  }
		  res.json(data);
		});
	});
});

app.post('/api/ToDoList',function(req,res){
	fs.readFile(TODOLIST_FILE, function(err, data){
		if (err){
			console.error(err);
			process.exit(1);
		}
		var taskList = JSON.parse(data);
		var newTask = {
			id: Date.now(),
			task: req.body.task
		};
		taskList.push(newTask);
		fs.writeFile(TODOLIST_FILE, JSON.stringify(taskList), function(err){
			if (err){
				console.error(err);
				process.exit(1);
			}
			res.json(taskList);
		});
  });
});

//to change the flag of a task from "notstarted" to "started"
app.post('/api/taskStart', function(req,res){

	fs.readFile(TODOLIST_FILE, function(err, data){
		if (err){
		  console.error(err);
		  process.exit(1);
		}
		var taskList = JSON.parse(data);
		var toStart = req.body.buttonId; //contains the id of the task whose flag needs to get changed 
		for(var i = 0 ; i < taskList.length ; i++){
			if(taskList[i]!=null && taskList[i].id == toStart){
				taskList[i].isStarted = true;
				break;
			}
		}
		fs.writeFile(TODOLIST_FILE, JSON.stringify(taskList), function(err){
			if (err){
				console.error(err);
				process.exit(1);
			}
			res.json(taskList);
		});
	});
});

var server = app.listen(port, function (){

 
  console.log("ToDoList app listening at http://localhost:",port);

});
