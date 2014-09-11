var mindmapData= new Array()
var links= new Array()

var mindmapDataSaved;
function saveState(){
	mindmapDataSaved = JSON.stringify(mindmapData);
	linksSaved = JSON.stringify(links);	
	$.post("/saveState/", {mindmapDataSaved : mindmapDataSaved, linksSaved : linksSaved});
	
	console.log('mindmapDataSaved: '+ mindmapDataSaved + ' linksSaved ' + linksSaved);
}

function loadState(parse){
	length = parse.length;
	mindmapData = [];
	nodesToCreate=parse;
	for(var i = 0; i < length; i++){
		var toCreate = new createTextNode(nodesToCreate[i].posX,nodesToCreate[i].posY, nodesToCreate[i].title, nodesToCreate[i].content);
		console.log(toCreate); console.log(nodeList);
	};
	
	for(node in nodesToCreate){
		for (l in nodesToCreate[node].children) {
			console.log('add link between ' + nodesToCreate[node].id + ' and '+ nodesToCreate[node].children[l]);		
			addLink(nodesToCreate[node].id, nodesToCreate[node].children[l]);	
		}
	}
	
	for(node in nodesToCreate){
		mindmapData[node].position = nodesToCreate[node].position;
	}
	
	updateTreeNew();
	updateEditor();
}

$("#saveStateButton").on('click', function(){
	console.log(saveState());
});


$("#loadStateButton").on('click', function(){
	console.log(loadState(parse));
});
