$(document).ready(function(){
		
		var xhrTask = new XMLHttpRequest();
		xhrTask.open('post', 'travelTask', true);
		xhrTask.send();
		xhrTask.onreadystatechange = function(){

			if (xhrTask.readyState != 4) return;
			if (xhrTask.status != 200){

				console.log(xhrTask.status + ':' + xhrTask.statusText);

			}else{
				var controller = new Controller(xhrTask.responseText);	
			}
		};
});