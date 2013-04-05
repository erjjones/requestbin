var express = require('express'),
	fs = require('fs'),
	hbs = require('hbs'),
	http = require('http'),
	path = require('path');

var mongo = {"hostname":"localhost","port":27017,"username":"", "password":"","name":"","db":"requestbin"}

var locals = { 
	title: "RequestBin"
	, url: "http://localhost:3000"	
};

var databaseUrl = generate_mongo_url(mongo),
	collections = ["entries"];

function generate_mongo_url(obj){
	obj.hostname = (obj.hostname || 'localhost');
	obj.port = (obj.port || 27017);
	obj.db = (obj.db || 'requestbin');

	if(obj.username && obj.password){
		return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
	}
	else{
		return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
	}
}

var db = require("mongojs").connect(databaseUrl, collections);
var app = express.createServer();

app.configure( function() {	
	app.set('port', process.env.PORT || 3000);	
	app.set('views', __dirname + '/views');
	app.set('view engine', 'hbs');  
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
	res.render("index", locals);
});

app.get('/bin', function(req, res) {

	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 7; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	var data = { 				
			"id": text
		};	

	var json = JSON.stringify(data);	
	res.statusCode = 200	
	res.setHeader('Content-Type', 'application/json');
	res.end(json);	
});

app.get('/list/:id', function(req, res) {
	var xid = req.params.id;

	if(typeof xid != 'undefined') {		
		db.entries.find( { id: xid } ).limit(50).sort([['_id', -1]], function(err, entries) {			
					
			for(var i = 0; i < entries.length; i++) {
				var id = entries[i];			
				var timestamp = id._id.toString().substring(0,8);
				var date = new Date( parseInt( timestamp, 16 ) * 1000 );
				date = date.toISOString();					
				entries[i]['timestamp'] = date;
			}	
		
			var json = { 
				"posts": entries,
				"id": xid,
				"url": locals["url"]
			};			
			
			res.render("list", json);
		});
	}
});

app.get('/:id', function(req, res) {
	var xid = req.params.id;

	if(typeof xid != 'undefined') {		
		db.entries.find( { id: xid } ).limit(50).sort([['_id', -1]], function(err, entries) {			
					
			for(var i = 0; i < entries.length; i++) {
				var id = entries[i];			
				var timestamp = id._id.toString().substring(0,8);
				var date = new Date( parseInt( timestamp, 16 ) * 1000 );
				date = date.toISOString();					
				entries[i]['timestamp'] = date;
			}	
		
			var data = { 
				"posts": entries,
				"id": xid
			};			
			
			var json = JSON.stringify(data);	
			res.statusCode = 200	
			res.setHeader('Content-Type', 'application/json');
			res.end(json);
		});
	}
});

app.post('/:id', function(req, res) {
		
	var body = req.body;
	var id = req.params.id;	
	
	if(typeof id != 'undefined') {	
		try
		{	
			var data = {
					"id": id,			
					"payload": JSON.stringify(body)
				}	
					
			savePost(data, function(wordSaved) {				
				outputSuccessJson(res, id, body);
			});		
		}
		catch(err)
		{			
			var error = "Must provide an id to post";		
			outputErrorJson(res, error, 500);
		}		
	}
	else {
		var error = "Must provide an id to post";		
		outputErrorJson(res, error, 400);
	}
});

function outputResponse(res,data) {
	res.render("index", data);
}

function outputErrorJson(res, error, statusCode) {
	var json = JSON.stringify({ error: error });
    res.statusCode = statusCode
	res.setHeader('Content-Type', 'application/json');
	res.end(json);
}

function outputSuccessJson(res, id, payload) {	
	var json = JSON.stringify({ id: id, payload: payload });	
    res.statusCode = 200	
	res.setHeader('Content-Type', 'application/json');
	res.end(json);	
}

function savePost(data, callback) {	

	db.entries.save({id: data.id, payload: data.payload}, function(err, saved) {
		var isSaved = false;
		if( err || !saved ) {
			console.log("post not saved");
			console.log(err);
			isSaved = false;
		}
		else {
			console.log("post saved");
			isSaved = true;
		}
		
		callback(isSaved);
	});
}

app.listen(process.env.PORT || 3000);