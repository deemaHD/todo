function Controller(tasks){

	var travelTaskCollection = new TravelTaskCollection(),
		taskCollection = JSON.parse(tasks); 
	for (var i = 0; i < taskCollection.length; i++){
		travelTaskCollection.taskCollection.push(new TravelTask(taskCollection[i].task, taskCollection[i].condition));
	}
	var view = new View(travelTaskCollection);
}