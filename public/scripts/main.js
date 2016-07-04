//starting component to render task list
var ToDoItemsList = React.createClass({
		
	getInitialState: function() {
		return {data: []};
	},
	
	//method to fetch taskList from server
	fetchTaskListFromServer : function(){
		
		$.ajax({
			type : "GET",
			url : this.props.url,
			dataType : 'json',
			cache : 'false',
			success : function(data){
				this.setState({data : data});
			}.bind(this),
			error : function(xhr, status, err){
				console.error(this.props.url, status, err.toString());
				
			}.bind(this)
		});
	},
	
	componentDidMount: function() {
		this.fetchTaskListFromServer();
	},
	
	//method to add task to the server's data file
	handleSubmit : function(task){
		$.ajax({
		  url: this.props.url,
		  dataType: 'json',
		  type: 'POST',
		  data: task,
		  success: function(data) {
			this.setState({data: data});
		  }.bind(this),
		  error: function(xhr, status, err) {
			console.error(this.props.url, status, err.toString());
		  }.bind(this)
		});
	},
	
	//method to remove task from the server's data file using taskId
	handleRemove : function(task){
		$.ajax({
		  url: this.props.url,
		  dataType: 'json',
		  type: 'delete',
		  data: task,
		  success: function(data) {
			this.setState({data: data});
		  }.bind(this),
		  error: function(xhr, status, err) {
			console.error(this.props.url, status, err.toString());
		  }.bind(this)
		});
	},
	
	//method to change flag of a task from from "not started" to "started" in the server's data file
	handleStart : function(taskId){
		$.ajax({
		  url: "api/taskStart",
		  dataType: 'json',
		  type: 'POST',
		  data: taskId,
		  success: function(data) {
			this.setState({data: data});
		  }.bind(this),
		  error: function(xhr, status, err) {
			console.error("api/taskStart", status, err.toString());
		  }.bind(this)
		});
	},
	
	render : function(){
		var todoListItems = this.state.data.map(function(todoitem){
			if(todoitem!=null){
				return (
					
					<ToDoItem key = {todoitem.id} id = {todoitem.id} isStarted = {todoitem.isStarted} onStart = {this.handleStart.bind(this)} onRemoveTask = {this.handleRemove}> {todoitem.task} </ToDoItem>
					
				);
			}
		},this);
		
		return (
			<div>
			<table className = "table no-border">
			<tbody>
				{todoListItems}
			</tbody>	
			</table>
			<ToDoForm onSubmitForm = {this.handleSubmit}></ToDoForm>
			</div>
		);
	}
});

//component to render a task
var ToDoItem = React.createClass({
	 
	removeTask : function(){
		var buttonId = this.props.id;
		this.props.onRemoveTask({buttonId : buttonId});
		
	},
	
	startClicked : function(){
		this.props.onStart({buttonId : this.props.id});
	},
	
	render : function(){
		return (
			<tr>
			<td className = "col-md-8"> 
				{this.props.children}	
			</td>
			<td className = "col-md-2">
				<ToDoLabel isStarted = {this.props.isStarted}></ToDoLabel>
			</td>
			<td className = "col-md-1">	
				<ToDoStartTask isStarted = {this.props.isStarted} onStart = {this.startClicked.bind(this)}> </ToDoStartTask>
			</td>
			<td className = "col-md-1">	
				<button type = "button" id = {this.props.id} className = "btn btn-default btn-sm remove-btn" onClick = {this.removeTask.bind(this)}>
					<span className="glyphicon glyphicon-remove"></span>
				</button>
			</td>	
			</tr>
		);
	}
});

//component to render "start" button
var ToDoStartTask = React.createClass({
		
	getStarted : function(){
		this.props.onStart();
	},
	
	render : function(){
		var toShow = "show btn btn-xs btn-primary";
		if(this.props.isStarted){
			toShow = "hide btn btn-xs btn-primary";
		}
		return (
			<button type = "button" className = {toShow} onClick = {this.getStarted.bind(this)}>
				Start
			</button>
		);
	}
});

//component to render task status "stated" or "not started"
var ToDoLabel = React.createClass({
	render : function(){
		var whichLabelToshow = "";
		var labelName = "";
		if(this.props.isStarted){
			whichLabelToshow = "label label-success";
			labelName = "Started";
		}
		else{
			whichLabelToshow = "label label-danger";
			labelName = "Not Started";
		}
		return (
			<span className={whichLabelToshow}>{labelName}</span>
		
		);
	}
});

//component to render add task
var ToDoForm = React.createClass({
	
	getInitialState: function(){
		return {task : ""};
	},
	
	handleTaskChange : function(e){
		this.setState({task : e.target.value});
	},
	
	addTaskSubmit:function(){
		var task = this.state.task.trim();
		this.setState({task : ""});
		this.props.onSubmitForm({task : task, isStarted : false});
	},
	
	render : function(){
		return (
			<div className = "input-group add">
				<input type = "text"  className = "form-control" onChange = {this.handleTaskChange} value = {this.state.task}/>
				<span className="input-group-btn">
					<button className="btn btn-secondary" type="button" onClick = {this.addTaskSubmit} ><strong>Add</strong></button>
				</span>
			</div>
		);
	}
});

ReactDOM.render(<ToDoItemsList url = "/api/ToDoList"/>, document.getElementById("content"));