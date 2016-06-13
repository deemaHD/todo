function TravelTaskCollection(){

	this.taskCollection = [];
	this.countTask = 0;
	this.countCompleteTask = 0;
	
// Find the necessery task from collection
	this.getTask = function(task){
		for (var i = 0; i < this.taskCollection.length; i++){
			if (this.taskCollection[i].task === task) {
				return this.taskCollection[i];
			}
		}
	};

//Delete the task in back-end and front-end
	this.deleteTask = function(task){
		
		var xhrCondition = new XMLHttpRequest(),
			params = 'task=' + encodeURIComponent(task);

		for (var i = 0; i < this.taskCollection.length; i++){
			if (this.taskCollection[i].task === task) {
				this.taskCollection.splice(i,1);
			}
		}

		xhrCondition.open('GET','/deleteTask?' + params, true);
		xhrCondition.send();	
	}

//Set condition of task 'to do' or 'completed'
	this.setCondition = function(task, condition){

		var xhrCondition = new XMLHttpRequest(),
			params = 'task=' + encodeURIComponent(task) + '&condition=' + encodeURIComponent(condition);

		for (var i = 0; i < this.taskCollection.length; i++){
			if (this.taskCollection[i].task === task) {
				this.taskCollection[i].condition = condition;
			}
		}

		xhrCondition.open('GET','/taskCondition?' + params, true);
		xhrCondition.send();
	};

//Add new task
	this.addTask = function(task, condition){
		
		var xhrAddTask = new XMLHttpRequest(),
			newTask = new TravelTask(task,"false"),
			params = 'task=' + encodeURIComponent(newTask.task) + '&condition=' + encodeURIComponent(newTask.condition);
		
		this.taskCollection.push(newTask);

		xhrAddTask.open('GET', '/addTask?' + params, true);
		xhrAddTask.send();
	};

//Edit task
	this.editTask = function(oldTask, newTask){
		
		var xhrEditTask = new XMLHttpRequest(),
			params = 'oldTask=' + encodeURIComponent(oldTask) + '&newTask=' + encodeURIComponent(newTask);
	
		for (var i = 0; i < this.taskCollection.length; i++){
			if (this.taskCollection[i].task === oldTask) {
				this.taskCollection[i].task = newTask;
			}
		}

		xhrEditTask.open('GET', '/editTask?' + params, true); 
		xhrEditTask.send();
	};

}