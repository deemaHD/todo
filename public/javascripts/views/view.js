function View(travelTaskCollection){

//fiiling the TravelList
	fillingForm(travelTaskCollection);

//filter action
$('div.filter').click(function(event){
	var target = event.target;

	switch(target.classList[2]){

		case 'allTasks':
			$('div.body').empty();
			fillingForm(travelTaskCollection);
			break;

		case 'todo':
			$('div.body').empty();
			setZeroConditionCounter();
			for (var i = 0; i < travelTaskCollection.taskCollection.length; i++){
				if (travelTaskCollection.taskCollection[i].condition === "false"){
					addTask(travelTaskCollection.taskCollection[i]);
				} 
			}	
			break;

		case 'complete':
			$('div.body').empty();
			setZeroConditionCounter();
			for (var i = 0; i < travelTaskCollection.taskCollection.length; i++){
				if (travelTaskCollection.taskCollection[i].condition === "true"){
					addTask(travelTaskCollection.taskCollection[i]);
				}
			}	
			break;		
	}
});

//body action
	$('div.body').click(function(event){	

		var target = event.target;

		switch(target.tagName){

			case 'INPUT':
				var nextDiv = $(target).parent().next(),
					span = nextDiv.find('p span.task'),
					editButton = nextDiv.next().find('button.edit'); 
//Text-decoration change due to the input checkbox			
				if (target.checked){

					span.css('text-decoration','line-through');
					editButton.prop('disabled', true);
					travelTaskCollection.setCondition(span.text(), 'true');
					$('div.footer span#done').text(++travelTaskCollection.countCompleteTask);
				}else{					
					if (!target.classList.contains('edit')){
						$('div.footer span#done').text(--travelTaskCollection.countCompleteTask);					
						span.css('text-decoration','none');
						editButton.prop('disabled', false);
						travelTaskCollection.setCondition(span.text(), 'false');
					}
				}
				break;
// Event on delete or edit buttons				
			case 'SPAN':
				if (!$(target).parent().prop('disabled')){

					var previousDiv = $(target).parent().parent();
					if (target.classList.contains('glyphicon-trash')){	
							travelTaskCollection.deleteTask(previousDiv.prev().find('p span.task').text());	
							previousDiv.parent().remove();
							if (previousDiv.prev().prev().find('input[type="checkbox"]').prop('checked')){
								$('span#done').text(--travelTaskCollection.countCompleteTask);
							}
							$('span#allTasks').text(--travelTaskCollection.countTask);
					}
					if (target.classList.contains('glyphicon-pencil')){	
							var oldTask = previousDiv.prev().find('p span.task').text();
							previousDiv.prev().find('p').css('display', 'none');
							$('button.edit').prop('disabled', true);
							previousDiv.prev().append('<p><span class="tempInput"><input type="text" value="' + oldTask + '" class="edit"> <input type="button" class=" edit save" value="Save"></span></p>');

							$('input.save').click(function(){
								var newTask = previousDiv.prev().find('input[type="text"]').val();
								travelTaskCollection.getTask(oldTask).task = newTask;
								previousDiv.prev().find('p span.tempInput').remove();
								previousDiv.prev().find('p span.task').text(newTask);
								previousDiv.prev().find('p').css('display', 'block');
								$('button.edit').prop('disabled', false);
								travelTaskCollection.editTask(oldTask, newTask);
							});		
					}		 
				}							
		}
	});

// Event on button ADD task
	$('div.addTask button.add').click(function(){

		var inputTask = $('input.addTask'),
			newTask = inputTask.val();	

		if (newTask !== ''){
			travelTaskCollection.addTask(newTask, "false");	
			inputTask.val('');
			addTask(newTask);
			$('div.filter button.allTasks').trigger('click');		
		}else{
			alert('Input the task !');
		}
	});

	function fillingForm(travelTaskCollection){

		setZeroConditionCounter();
		for (var i = 0; i < travelTaskCollection.taskCollection.length; i++){
			addTask(travelTaskCollection.taskCollection[i], i);
		}	
	}

	function addTask(travelTask){

		if (travelTask.condition === "true"){
			$('div.body').append(
					'<div class="box">'+
						'<div class="col-sm-1">'+
						 	'<input type="checkbox" class="doneTask" checked>'+
						 '</div>'+
						 '<div class="col-sm-8 edit"><p><span class="task crossout">'+ travelTask.task	+ '</span></p></div>'+
						 '<div class="col-sm-3">'+
						 	'<button type="button" class="btn btn-primary edit" data-toggle="modal" data-target="#myModal" disabled><span class="glyphicon glyphicon-pencil" area-hidden="true"></span></button>'+
						 	'<button type="button" class="btn btn-primary delete"><span class="glyphicon glyphicon-trash" area-hidden="true"></span></button>'+
						 '</div>'+
					 '</div>'
			);	
			$('span#done').text(++travelTaskCollection.countCompleteTask);
			$('span#allTasks').text(++travelTaskCollection.countTask);
		}else{
			$('div.body').append(
					'<div class="box">'+
					'<div class="col-sm-1">'+
					 	'<input type="checkbox" class="doneTask">'+
					 '</div>'+
					 '<div class="col-sm-8 edit"><p><span class="task">'+ travelTask.task	+ '</span></p></div>'+
					 '<div class="col-sm-3">'+
					 	'<button type="button" class="btn btn-primary edit" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-pencil" area-hidden="true"></span></button>'+
					 	'<button type="button" class="btn btn-primary delete"><span class="glyphicon glyphicon-trash" area-hidden="true"></span></button>'+
					 '</div>'+
					 '</div>'
			);
			$('span#allTasks').text(++travelTaskCollection.countTask);
		}
	}
//Denie to edit while another task is being corrected
	function deniedEdit(){
		$('button.edit').prop('disabled', 'true');
	}	
//Zero condition of counters
	function setZeroConditionCounter(){
		travelTaskCollection.countCompleteTask = 0;
		travelTaskCollection.countTask = 0;
	}	
}