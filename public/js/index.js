var bins = '';
var bins_list = [];

function makeid()
{
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 7; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

$("#btnMakeId").click(function (event) {
	event.preventDefault();  
	var id = makeid();
		
	var reverse = document.getElementById('output');
	var li = reverse.getElementsByTagName('li');
	
	if(li.length < 10) {	
		var url = "/list/" + id;		
		var html = '<a href="' + url + '">http://localhost:3000/' + id + '</a>'				
		bins_list.push(html);
	} else {
		$('#btnMakeId').attr('disabled', 'disabled');
	}			
	
	localStorage.setItem("bins", JSON.stringify( bins_list ));
	var savedBins = JSON.parse(localStorage.getItem("bins"));	

	document.location.href = "/list/" + id;
}); 

$("#btnReset").click(function (event) {
	event.preventDefault();			
	$('#output').empty();
	$('#btnMakeId').removeAttr('disabled'); 
	bins_list = [];
	localStorage.clear();	
});	

if (localStorage.getItem("bins") === null) {
	console.log('bins are empty');	
} else {
	
	var reverse = document.getElementById('output');
	var li = reverse.getElementsByTagName('li');

	if(li.length < 10) {	
		
		var savedBins = JSON.parse(localStorage.getItem("bins"));
		var cntr = 0;
		$.each(savedBins, function(i,item){
		   $('#output').append($('<li>', {html: item}));	
		   bins_list.push(item);
		   cntr++;
		});			

		if(cntr > 9) { $('#btnMakeId').attr('disabled', 'disabled'); }
		
	} else {
		$('#btnMakeId').attr('disabled', 'disabled');
	}		
}

