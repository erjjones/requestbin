$("#btnGo").click(function (event) {
	event.preventDefault();
	var input = $('#txtBin');
	
	if(input.val().length > 0) {
		var text = $('#txtBin').val(); 		
		var lastIndex = text.lastIndexOf("/");		
		var id = text.substring(lastIndex + 1, text.length);
		
		if(id.length > 0) {
			document.location.href = "/list/" + id;
		}
	}	
});	