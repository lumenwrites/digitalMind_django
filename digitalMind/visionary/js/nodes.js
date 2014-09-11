var stage = new Kinetic.Stage({
    container: 'container',
    width: 1500,// $('#left').width()-28,
    height:1500,// $('#left').height(),
    id: "stage",
});
$("#left").scrollTop(500);$("#left").scrollLeft(500);

var layer = new Kinetic.Layer();
stage.add(layer);

var rectX = stage.getWidth() / 2 - 50;
var rectY = stage.getHeight() / 2 - 25;
var selectedNode;
var parentNode, childNode;
var isParentSelected = false;
var isChildSelected = false;
var links = new Array();

var nodeList = new Array(); //temporary

var mindmapData = new Array();
      
// CREATE NODE  
function createTextNode(posX, posY, title, content) {
	var currentNode = this;
	mindmapData.push(this);

	this.id = mindmapData.length-1;
	this.title = title;
	this.content = content;
	this.position = this.id;
	
	this.showTitle = true;	    
	this.showContent = true;
	
	this.posX = posX;
	this.posY = posY;

	this.parents= new Array();
	this.children= new Array();
	this.links = new Array();
	    

	
	var nodeGroup = new Kinetic.Group({
		draggable: true
	});
	this.group = nodeGroup;
	
	var box1 = new Kinetic.Rect({
		x: -50,
		y: -25,
		width: 100,
		height: 50,
		fill: 'rgba(28,33,38,1)',
		stroke: '#a3b8c3',
		strokeWidth: 0.5,
		//shadowColor: 'black',
		//shadowBlur: 10,
		//shadowOffset: [3, 3],
		//shadowOpacity: 0.2,
		cornerRadius: 5
	});
	      
	var hook = new Kinetic.Circle({
		y:8,
		radius:5,
		fill:'#a3b8c3',
		stroke:'black',
		strokeWidth:2,
	});
	this.hookPoint = hook;
	 
	var titleText = new Kinetic.Text({
		x: -50,
		y: -25,
		text: title,
		fontSize: 12,
		fontFamily: 'Calibri',
		fill: '#a3b8c3',
		width: 100,
		height: 50,
		padding: 10,
		align: 'center'
	});
	this.titleText = titleText;
	
	// add cursor styling
	box1.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	box1.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});
	      
	nodeGroup.setX(posX);
	nodeGroup.setY(posY);

	nodeGroup.add(box1);
	nodeGroup.add(titleText);
	nodeGroup.add(hook);
	layer.add(nodeGroup);
	    
	nodeGroup.on('click', function(){
		selectedNode = currentNode.id;
		showParameters();
		updateTreeNew();   
        layer.draw();
    });

	//Update node position
	nodeGroup.on('dragstart dragmove', function(){
		mindmapData[currentNode.id].posX=nodeGroup.getX();
		mindmapData[currentNode.id].posY=nodeGroup.getY();   
		updateLinks(); 
	});
		
		
	this.hookPoint.on('click', function(){
		selectedNode = currentNode.id;
		hookPress();
		layer.draw();
	})	      

	layer.draw();
	updateTreeNew();
	updateEditor();
	//editorAppendNode();//later - update editor! and when you click on "node" in editor - you also just create a node with given title! (?)
	
	return this.id;
}

function updateNode(id) {
	mindmapData[id].titleText.setText(mindmapData[id].title);
	//mindmapData[id].titleText.setText(content); If i'll want to add subtitle to node.
	layer.draw();
}

function updateNodes(){
	var	nodesToCreate = mindmapData;
	mindmapData = [];
	layer.removeChildren();
	for(var i = 0; i < nodesToCreate.length; i++){
		var toCreate = new createTextNode(nodesToCreate[i].posX,nodesToCreate[i].posY, nodesToCreate[i].title, nodesToCreate[i].content);
		console.log(toCreate); console.log(nodeList);
	};
}

function moveNode(move) {
	if (move=="up" && (mindmapData[selectedNode].position<mindmapData.length-1)){
		oldPosition = mindmapData[selectedNode].position;
		newPosition = oldPosition + 1;
		
		for (node in mindmapData){
			if (mindmapData[node].position == newPosition) {
				mindmapData[node].position = oldPosition;
				console.log("old node "+mindmapData[node].id+" was moved from " + mindmapData[node].position + " to " + oldPosition);
				break;
			}
		}
		
		mindmapData[selectedNode].position = newPosition;
		console.log("node "+selectedNode+" was moved from " + oldPosition + " to " + newPosition);

		for(var i = 0; i < mindmapData.length; i++) {console.log(mindmapData[i].id + " : " + mindmapData[i].position);}
	} else if (move=="down" && (mindmapData[selectedNode].position>0)) {
		oldPosition = mindmapData[selectedNode].position;
		newPosition = oldPosition - 1;
		
		for (node in mindmapData){
			if (mindmapData[node].position == newPosition) {
				mindmapData[node].position = oldPosition;
				console.log("old node "+mindmapData[node].id+" was moved from " + mindmapData[node].position + " to " + oldPosition);
				break;
			}
		}
		
		mindmapData[selectedNode].position = newPosition;
		console.log("node "+selectedNode+" was moved from " + oldPosition + " to " + newPosition);
  
		
		for(var i = 0; i < mindmapData.length; i++) {console.log(mindmapData[i].id + " : " + mindmapData[i].position);}
	}
	listNodesByPosition();
	console.log('node moved');
	updateTreeNew(); 	
	updateEditor();
}

//move node up. 37 - left 38 - up 39 - right 40 - down
$(document).keydown(function(e){
	if (e.keyCode == 38) { 
		moveNode("up");
		return false;
	}
});

//move node down. 37 - left 38 - up 39 - right 40 - down
$(document).keydown(function(e){
	if (e.keyCode == 40) { 
		moveNode("down");
		return false;
	}
});

function listNodesByPosition(){
	var orderedIds = new Array();
	for	(var i = 0; i < mindmapData.length; i++){
		for (node in mindmapData){
			if (mindmapData[node].position == i) {orderedIds.push(node);}
		}
	}
	console.log(orderedIds);
	return orderedIds;
}

//Create default nodes
function createDefaultNodes() {
	var node0 = new createTextNode(rectX+50,rectY+40, "Node0", "Node0 content");
	var node1 = new createTextNode(rectX+50,rectY+160, "Node1", "Node1 content");
	var node2 = new createTextNode(rectX+150,rectY+280, "Node2", "Node2 content");
	var node3 = new createTextNode(rectX-50,rectY+280, "Node3", "Node3 content");
	var node4 = new createTextNode(rectX+250,rectY+40, "Node4", "Node4 content");
	var node4 = new createTextNode(rectX+250,rectY+160, "Node5", "Node5 content");
	addLink(0, 1);
	addLink(1, 2);
	addLink(1, 3);
}

$(document).ready(function() {
	if (toParse=='empty') {createDefaultNodes();}
});


//Make node button
$("#createTextNode").on('click', function(){
	var toCreate = new createTextNode(rectX,rectY, "New Node", "Node content.");	
});


//Delete node button.
$("#deleteTextNode").on('click', function(){
	//delete node from mindmapData and update nodes.
	mindmapData.splice(selectedNode,1);
	updateNodes();
});


//Link nodes.
function hookPress(){
	//if parent is not selected - select it, if it is - select child
	if (isParentSelected == false) {
		parentNode = selectedNode;
		isParentSelected = true;
	} else {
		childNode = selectedNode;
		isChildSelected = true;
	}

	
	if (isParentSelected && isChildSelected && (parentNode != childNode)){
		addLink(parentNode, childNode);
		//TODO: check so that you couldn't connect the same nodes twice.
		
		//Reset
		parentNode = ''; childNode = '';
		isParentSelected = false;
		isChildSelected = false;
	};
}

function addLink(parentNode, childNode){
	//Add parameters. parent node to child, child to parent.
	mindmapData[parentNode].children.push(childNode);
	mindmapData[childNode].parents.push(parentNode);
	mindmapData[parentNode].links.push(links.length);	
	mindmapData[childNode].links.push(links.length);		
	//console.log("connect node "+parentNode+" to "+childNode);
	
	//create Link
	var link = new Kinetic.Line({ 
							x: 1, 
							y: 1,
							stroke: '#a3b8c3',
							strokeWidth: 1,
							lineCap: 'round',
							lineJoin: 'round'
							});
	link.setPoints([0,0,1,1]);
	link.parentNode = parentNode;
	link.childNode = childNode;
	
	links.push(link);
	layer.add(link);
	link.moveToBottom();
	
	updateLinks();
}

function updateLinks(parentNode, childNode){
	parent = mindmapData[parentNode];
	child = mindmapData[childNode];

	for(l in links){//could probably do for link in links.
		linkParent = links[l].parentNode;
		linkChild = links[l].childNode;		
		parent = mindmapData[linkParent];
		child = mindmapData[linkChild];
		links[l].setPoints([parent.posX, parent.posY, child.posX, child.posY]);
	}

	layer.draw();
}

//Delete link button.
$("#deleteLink").on('click', function(){
	//delete node from mindmapData and update nodes.
	for (l in mindmapData[selectedNode].links) {
		link = mindmapData[selectedNode].links[l];
		console.log(link);
		links[link].remove();
		links.splice(link,1);//links global variable, don't confuse with the object attrebute "mindmapData[selectedNode].links"
	}
	updateLinks();
});


//Ugly zoom
$("#zoomOut").on('click', function(){
layer.setScale(layer.getScaleX()-0.2);layer.setPosition(layer.getPosition().x+160); layer.draw();
});
$("#zoomIn").on('click', function(){
layer.setScale(layer.getScaleX()+0.2);layer.setPosition(layer.getPosition().x-160); layer.draw();
});
$("#zoomNone").on('click', function(){
layer.setScale(1);layer.setPosition(0);layer.draw();
});