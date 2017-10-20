//in jQuery mobile, we're not using doc.ready, but we'll use the 'pageinit', but we just need
//to call it once, so we use the .one()
$(document).one('pageinit', function(){

	//display runs
	showRuns();

	// Add Handler
	$('#submitAdd').on('tap', addRun);

	// Edit Handler
	$('#submitEdit').on('tap', editRun);

	// set current Handler
	$('#stats').on('tap', '#editLink', setCurrent);

	// delete  Handler
	$('#stats').on('tap', '#deleteLink', deleteRun);


	// delete ALL (clear) Handler
	$('#clearRuns').on('tap', clearRun);

	// show all runs on homepage
	function showRuns(){
		//get runs object
		var runs2 = getRunsObject();

		//check if not empty
		if(runs2 != '' && runs2 != null){
			for(var i = 0; i < runs2.length; i++){
				$('#stats').append('<li class="ui-body-inherit ui-li-static"><strong>Date: </strong>'+runs2[i]["date"]+
					'<br><strong>Distance: </strong>'+runs2[i]["miles"]+'m<div class="controls">'+
					'<a href="#edit" id="editLink" data-miles="'+runs2[i]["miles"]+'" data-date="'+runs2[i]["date"]+'">Edit</a> | <a href="#delete" id="deleteLink" data-miles="'+runs2[i]["miles"]+'" data-date="'+runs2[i]["date"]+'" onclick="return deleteRun()">Delete</a></div</li>');
			}
			$('#home').bind('pageinit', function(){
				$('#stats').listview('refresh');
			});
		}else{
			$('#stats').html('<p>You have no logged run </p>');
		}
	}

	//edit a run
	function editRun(){
		//get current data
		currentMiles = localStorage.getItem('currentMiles');
		currentDate = localStorage.getItem('currentDate');
		
		var runs = getRunsObject();

		//loop thru all runs
		for(var i = 0; i < runs.length; i++){
			if(runs[i].miles == currentMiles && runs[i].date == currentDate){
				runs.splice(i, 1);
			}

			localStorage.setItem('runs', JSON.stringify(runs));
		}

		

		//get form values
		var miles = $('#editMiles').val();
		var date = $('#editDate').val();

		//create 'run' object
		var update_run = {
			date: date,
			miles: parseFloat(miles)
		};

		//Add runs to RunArray
		runs.push(update_run);
		alert('Run Updated');

		//Set stringified object to localStorage
		localStorage.setItem('runs', JSON.stringify(runs));

		//redirect
		window.location.href="index.html";
		return false; //so the form is not really submitted
	}

	//delete  a run
	function deleteRun(){

		var confDel = confirm("Are you sure want to delete this run ?");
		if (confDel == true) {
			//set ls items
			localStorage.setItem('currentMiles', $(this).data('miles'));
			localStorage.setItem('currentDate', $(this).data('date'));

			//get current data
			currentMiles = localStorage.getItem('currentMiles');
			currentDate = localStorage.getItem('currentDate');
			
			var runs = getRunsObject();

			//loop thru all runs
			for(var i = 0; i < runs.length; i++){
				if(runs[i].miles == currentMiles && runs[i].date == currentDate){
					runs.splice(i, 1);
				}

				localStorage.setItem('runs', JSON.stringify(runs));
			}
			
			alert('Run Deleted');

			//redirect
			window.location.href="index.html";
			return false; //so the form is not really submitted
		}
	}
	//clear all run
	function clearRun(){
		var conf = confirm("Are you sure want to clear localStorage ?");
		if (conf == true) {
			localStorage.removeItem('runs');
			localStorage.removeItem('currentDate');
			localStorage.removeItem('currentMiles');
			$('#stats').html('<p>You have no logged run </p>');
		}
	}
	// Add a run
	function addRun(){
		//get form values
		var miles = $('#addMiles').val();
		var date = $('#addDate').val();

		//create 'run' object
		var run = {
			date: date,
			miles: parseFloat(miles)
		};

		var runs = getRunsObject();

		//Add runs to RunArray
		runs.push(run);
		alert('Run Added');

		//Set stringified object to localStorage
		localStorage.setItem('runs', JSON.stringify(runs));

		//redirect
		window.location.href="index.html";
		return false; //so the form is not really submitted

	}

	//get the run object
	function getRunsObject(){
		//set runs array
		var runs1 = new Array();

		//Get current runs from localStorage
		var currentRun = localStorage.getItem('runs');

		// check local  Storage
		if(currentRun != null){
			//set to runs and parse it to JSON
			var runs1 = JSON.parse(currentRun);
		}

		//return runs object and sort it
		return runs1.sort(function(a,b){ return new Date(b.date) - new Date(a.date)});
	}

	//set the current miles and date
	function setCurrent(){
		//set ls items
		localStorage.setItem('currentMiles', $(this).data('miles'));
		localStorage.setItem('currentDate', $(this).data('date'));

		//insert into the edit form
		$('#editMiles').val(localStorage.getItem('currentMiles'));
		$('#editDate').val(localStorage.getItem('currentDate'));
	}

});