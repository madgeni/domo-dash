//use for controlling Groups in Domoticz
//requires domoticz-api & node-dash-button


var Domoticz = require('./node_modules/domoticz-api/api/domoticz');
var dash_button = require('node-dash-button');

var api = new Domoticz({
	protocol: "http",
	host: "127.0.0.1",
	port: 8080,
	username: "",
	password: ""
});
//put Dash Mac Addresses here - to find them, use node-dash-button's info: https://github.com/hortinstein/node-dash-button
var dash = dash_button(["ac:63:be:89:c9:b6", "ac:63:be:13:c2:b8", "ac:63:be:02:f7:0b", "50:f5:da:5a:a1:ae"]);
var on = false;
var idx;

//as there's no way to toggle Groups - check's current state first

function changeScene(idx, sceneState) {
	// console.log("state = ", sceneState, " for idx - ", idx);
	
	if(sceneState == 'Off'){
		sceneState = 'On';
	} else if(sceneState == 'On'){
		sceneState = 'Off';
	}
	// console.log("what's the scene state? ", sceneState);
	api.changeSceneState({
		idx: idx,
		state: sceneState
	}, function(params, callback) {
		return(callback);
	});
}

function getScene(idx) {
	api.getScenesGroups(function(error, scene) {

		if (error) {
			console.log("uhoh - ", error);
		}
		var sceneArray = scene.results;
		for (var i = 0; i < sceneArray.length; i++) {
			var element = sceneArray[i];
			if (element.idx == idx) {
				var sceneState = element.status;
		//		console.log("scene state is : ", sceneState);
				changeScene(idx,sceneState);
			}
		}
	});
}

function callDashButton(dash_id, callback) {
	var dict = {
		"ac:63:be:89:c9:b6": 5,
		"50:f5:da:5a:a1:ae": 4,
		"ac:63:be:02:f7:0b": 1
	};
	console.log("Dash button" + dash_id + " was clicked!");
	var IDX;
	for (var key in dict) {
		IDX = dict[dash_id];
	//	console.log(IDX)
	}
	getScene(IDX, callback);
}

dash.on("detected", callDashButton);

