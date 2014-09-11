var stage = new Kinetic.Stage({
    container: 'container',
    width: 3000,// $('#left').width()-28,
    height:3000,// $('#left').height(),
    id: "stage",
});
$("#container").scrollTop(1200);$("#container").scrollLeft(1150);

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

var positionParent = 0;
var type=false;
var disableHotkeys = false;
var selectedLink;
var hookPressed = false;
var ghostLink;
var focusOnNodeInEditor = true;
      
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
	
	this.netbox = false;
	    

	
	var nodeGroup = new Kinetic.Group({
		draggable: true
	});
	this.group = nodeGroup;
	
	var box1 = new Kinetic.Rect({
		x: -50-10,
		y: -25-11,
		width: 120,
		height: 72,
		fill: 'rgba(28,33,38,1)',
		stroke: '#a3b8c3',
		strokeWidth: 0.5,
		//shadowColor: 'black',
		//shadowBlur: 10,
		//shadowOffset: [3, 3],
		//shadowOpacity: 0.2,
		cornerRadius: 0
	});
	this.frame = box1;
	
	var contentField = new Kinetic.Rect({
		x: -45-10,
		y: -7-11,
		width: 110,
		height: 50,
		fill: '#3a3f45',
		stroke: '#3a3f45',
		strokeWidth: 0.5,
		//shadowColor: 'black',
		//shadowBlur: 10,
		//shadowOffset: [3, 3],
		//shadowOpacity: 0.2,
		cornerRadius: 0
	});
	this.contentField = contentField;
	      
	var hook = new Kinetic.Rect({
		y:25,
		//radius:5,
		width: 8,
		height: 8,
		x: 12+20-10,
		y: -20-11,
		fill:'#f66303',
		//stroke:'black',
		//strokeWidth:2,
	});
	this.hookPoint = hook;
	
	var hook2 = new Kinetic.Rect({
		y:25,
		//radius:5,
		width: 8,
		height: 8,
		x: 24+20-10,
		y: -20-11,
		fill:'#f66303',
		//stroke:'black',
		//strokeWidth:2,
	});
	var hook3 = new Kinetic.Rect({
		y:25,
		//radius:5,
		width: 8,
		height: 8,
		x: 36+20-10,
		y: -20-11,
		fill:'#f66303',
		//stroke:'black',
		//strokeWidth:2,
	});
	 
	var titleText = new Kinetic.Text({
		x: -55-10,
		y: -32-11,
		text: title,
		fontSize: 12,
		fontFamily: 'Calibri',
		fill: '#a3b8c3',
		width: 100,
		height: 50,
		padding: 10,
		align: 'left'
	});
	this.titleText = titleText;
	
	var editLine = new Kinetic.Line({
        points: [-55, -21, 10, -21],
        stroke: '#a3b8c3',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
      });
    this.editLine = editLine;
    editLine.hide();

	
	var contentText = new Kinetic.Text({
		x: -45-10,
		y: -7-11,
		text: content,
		fontSize: 12,
		fontFamily: 'Calibri',
		fill: '#a3b8c3',
		width: 110,
		height: 50,
		padding: 0,
		align: 'left'
	});
	this.contentText = contentText;
	
	
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
	nodeGroup.add(editLine);
	nodeGroup.add(hook);
	nodeGroup.add(hook2);
	nodeGroup.add(hook3);
	nodeGroup.add(contentField);	
	nodeGroup.add(contentText);	
	layer.add(nodeGroup);
//	nodeGroup.moveUp();
	    
	nodeGroup.on('click', function(){
		selectedNode = currentNode.id;
		for (node in mindmapData){
			mindmapData[node].frame.setStrokeWidth(0.5);
		}
		for (l in links){
			links[l].setStrokeWidth(1);
		}
		mindmapData[selectedNode].frame.setStrokeWidth(2);
		showParameters();
		updateTreeNew(); 
		updateEditor();
        layer.draw();
		console.log('node # '+selectedNode+' is selected');
		hookPress();
    });

	//Update node position
	nodeGroup.on('dragstart dragmove', function(){
		mindmapData[currentNode.id].posX=nodeGroup.getX();
		mindmapData[currentNode.id].posY=nodeGroup.getY();   
		updateLinks(); 
		var pointx = currentNode.group.getAbsolutePosition().x;var pointy = currentNode.group.getAbsolutePosition().y;
		var onTopOfAnyParent = false;
		for (node in mindmapData){
			if (mindmapData[node].netbox){
				var objectx = mindmapData[node].frame.getAbsolutePosition().x;var objecty = mindmapData[node].frame.getAbsolutePosition().y;
				if(checkCollide(pointx, pointy, objectx, objecty, 800, 480)){
					addToParent(currentNode.id,node);
					onTopOfAnyParent = true;
				}	
			}
		}
		if (onTopOfAnyParent == false) {
			unparent(currentNode.id);
		}

	});
		
	titleText.on('click', function(){
		selectedNode = currentNode.id;
		type = true;
		
		currentNode.editLine.show();
		showParameters();
		updateTreeNew(); 
		updateEditor();  
        layer.draw();
		console.log('node # '+selectedNode+' is selected');	        
    });
    
	this.hookPoint.on('click', function(){
		selectedNode = currentNode.id;
		hookPressed = true;
		hookPress();
		layer.draw();
	})	      
	
	selectedNode = currentNode.id;

	layer.draw();
	updateTreeNew();
	updateEditor();
	updateNode(currentNode.id);
	//editorAppendNode();//later - update editor! and when you click on "node" in editor - you also just create a node with given title! (?)
	
	return this.id;
}

function createImageNode(posX, posY, title, content) {
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
	    
	this.netbox = true;
	
	var nodeGroup = new Kinetic.Group({
		draggable: true
	});
	this.group = nodeGroup;
	
	var imageObj = new Image();

	var image = new Kinetic.Image({
	  x: 200,
	  y: 50,
	  image: imageObj,
	  width: 800,
	  height: 480
	});

	this.frame = image;

	imageObj.src = '/static/visionary/img/bmc.png';
	
	// add cursor styling
	nodeGroup.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	nodeGroup.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});
	      
	nodeGroup.setX(posX);
	nodeGroup.setY(posY);

	nodeGroup.add(image);
	layer.add(nodeGroup);
	nodeGroup.moveToBottom();
	    
	nodeGroup.on('click', function(){
		//selectedNode = currentNode.id;
		//showParameters();
		//updateTreeNew(); 
		//updateEditor();  
        layer.draw();
    });
    
    nodeGroup.on('dragstart dragmove', function(){
		mindmapData[currentNode.id].posX=nodeGroup.getX();
		mindmapData[currentNode.id].posY=nodeGroup.getY(); 
		//for (node in mindmapData){
		//	mindmapData[node].posX=nodeGroup.getX();
		//}
		//updateLinks(); 
	});
	
	selectedNode = currentNode.id;

	layer.draw();
	//editorAppendNode();//later - update editor! and when you click on "node" in editor - you also just create a node with given title! (?)
	
	return this.id;
}


function updateNode(id) {
	mindmapData[id].titleText.setText(mindmapData[id].title);
	
	text = mindmapData[id].content.toString();
	text = text.replace("<p>","");
	text = text.replace(/<p><\/p>/g,"");	
	text = text.replace(/<br>/g,"\n");
	text = text.replace(/&nbsp;/g,"\n");
	text = text.replace(/<div>/g,"\n");
	text = text.replace(/<\/div>/g,"");
	text = text.replace(/<p>/g,"\n");
	text = text.replace(/<\/p>/g,"");
		
	mindmapData[id].contentText.setText(text);
	layer.draw();
}

//edit node title on canvas
$(document).keydown(function(e){
    var keyPressed = String.fromCharCode(e.which);
    if (selectedNode){
	    var text = mindmapData[selectedNode].titleText;//canvas.getActiveObject();
    }
    if (text&&type)
    {
        var newText = '';
        var stillTyping = true;
        if (e.which == 27) //esc
        {
            if (!text.originalText) return; //if there is no original text, there is nothing to undo
            newText = text.originalText;
            stillTyping = false;
        }
        //if the user wants to make a correction
        else
        {
            //Store the original text before beginning to type
            if (!text.originalText)
            {
                text.originalText = text.getText();
            }
            //if the user wants to remove all text, or the element entirely
            if (e.which == 46) //delete
            {
				//activeObject.element.remove(true);
				newText='';
                return;
            }
            else if (e.which == 16) { //shift
                newText = text.getText();
            }
            else if (e.which == 8) //backspace
            {
                e.preventDefault();
                newText = text.getText().substr(0, text.getText().length - 1);
            }
            else if (e.which == 13) //enter
            {
                //canvas clear selection
                //canvas.discardActiveObject();
                //canvas.renderAll();
                //canvasBeforeSelectionCleared({ memo: { target: text} });
                mindmapData[selectedNode].editLine.hide();
                newText = text.getText();
                stillTyping = false;
                type = false;
                updateEditor();
                updateParameters(selectedNode);
                //updating editor and all comes here. Function starts when I click on title and ends here.
                //setup some switch? When I click on title it works, when I click enter it doesn't?
            }
            //if the user is typing alphanumeric characters
            else if (
                (e.which > 64 && e.which < 91) || //A-Z
                (e.which > 47 && e.which < 58) || //0-9
                (e.which == 32) || //Space
                (keyPressed.match(/[!&()"'?-]/)) //Accepted special characters
            )
            {	
            	if (e.which == 32){
            		e.preventDefault();
            		}
            		
                if (text.getText() == text.originalText) text.text = '';
                if (keyPressed.match(/[A-Z]/) && !e.shiftKey)
                    keyPressed = keyPressed.toLowerCase();
                newText = text.getText() + keyPressed;
            }
        }
        mindmapData[selectedNode].title = newText; //Change the text//if this works - replace it with saving text to data and updating node.
        updateNode(selectedNode);
        layer.draw(); //Update the canvas

        if (!stillTyping)
        {
            text.originalText = null;
        }
    }
});

function updateNodes(){
	var	nodesToCreate = mindmapData;
	layer.remove();layer = new Kinetic.Layer();stage.add(layer);
	mindmapData = [];
	links = [];
	//layer.removeChildren();
	for(var i = 0; i < nodesToCreate.length; i++){
		var toCreate = new createTextNode(nodesToCreate[i].posX,nodesToCreate[i].posY, nodesToCreate[i].title, nodesToCreate[i].content);
		//console.log(toCreate); console.log(nodeList);
	};
	
	for(node in nodesToCreate){
		for (l in nodesToCreate[node].children) {
			//console.log('add link between ' + nodesToCreate[node].id + ' and '+ nodesToCreate[node].children[l]);		
			addLink(nodesToCreate[node].id, nodesToCreate[node].children[l]);	
		}
	}	
	layer.draw();
}

function moveNode(move) {
	if (move=="up" && (mindmapData[selectedNode].position<mindmapData.length-1)){
		oldPosition = mindmapData[selectedNode].position;
		newPosition = oldPosition + 1;
		
		for (node in mindmapData){
			if (mindmapData[node].position == newPosition) {
				mindmapData[node].position = oldPosition;
				//console.log("old node "+mindmapData[node].id+" was moved from " + mindmapData[node].position + " to " + oldPosition);
				break;
			}
		}
		
		mindmapData[selectedNode].position = newPosition;
		//console.log("node "+selectedNode+" was moved from " + oldPosition + " to " + newPosition);

		//for(var i = 0; i < mindmapData.length; i++) {console.log(mindmapData[i].id + " : " + mindmapData[i].position);}
	} else if (move=="down" && (mindmapData[selectedNode].position>0)) {
		oldPosition = mindmapData[selectedNode].position;
		newPosition = oldPosition - 1;
		
		for (node in mindmapData){
			if (mindmapData[node].position == newPosition) {
				mindmapData[node].position = oldPosition;
				//console.log("old node "+mindmapData[node].id+" was moved from " + mindmapData[node].position + " to " + oldPosition);
				break;
			}
		}
		
		mindmapData[selectedNode].position = newPosition;
		//console.log("node "+selectedNode+" was moved from " + oldPosition + " to " + newPosition);
  
		
		//for(var i = 0; i < mindmapData.length; i++) {console.log(mindmapData[i].id + " : " + mindmapData[i].position);}
	}
	listNodesByPosition();
	//console.log('node moved');
	updateTreeNew(); 	
	updateEditor();
}

//move node down. 37 - left 38 - up 39 - right 40 - down
$(document).keydown(function(e){
	if (e.keyCode == 38) { 
		moveNode("down");
		return false;
	}
});

//move node up. 37 - left 38 - up 39 - right 40 - down
$(document).keydown(function(e){
	if (e.keyCode == 40) { 
		moveNode("up");
		return false;
	}
});

//stage.on('click', function(){
//	selectedNode = -1;
//	updateEditor();  
//	layer.draw();
//});

function listNodesByPosition(){
	var orderedIds = new Array();
	for	(var i = 0; i < mindmapData.length; i++){
		for (node in mindmapData){
			if (mindmapData[node].position == i) {orderedIds.push(node);}
		}
	}
	//console.log(orderedIds);
	return orderedIds;
}

//Create default nodes
function createDefaultNodes() {
	var node0 = new createTextNode(rectX+50,rectY+40, "Node0", "Node0 content");
	var node1 = new createTextNode(rectX+50,rectY+160, "Node1", "Node1 content");
	var node2 = new createTextNode(rectX+150,rectY+280, "Node2", "Node2 content");
	var node3 = new createTextNode(rectX-50,rectY+280, "Node3", "Node3 content");
	var node4 = new createTextNode(rectX+250,rectY+40, "Node4", "Node4 content");
	var node5 = new createTextNode(rectX+250,rectY+160, "Node5", "Node5 content");
	addLink(0, 1);
	addLink(1, 2);
	addLink(1, 3);
}

function createDefaultNodes2() {
	var node0 = new createTextNode(rectX+50,rectY+40, "Path.", "Path.Purpose.Goal.");
	var node1 = new createTextNode(rectX+50,rectY+160, "Flow", "High Consciousness\nBurning");
	var node2 = new createTextNode(rectX+150,rectY+280, "Mastery.", "Mind. Mastery. Will. Extreme. Virtues.");
	var node3 = new createTextNode(rectX-50,rectY+280, "Identity.", "Transformation.\nResult of walking the path.");
	addLink(0, 1);
	addLink(1, 2);
	addLink(1, 3);
}

function createDefaultNodes3() {
	deleteAll();
	var node0 = new createTextNode(rectX+50,rectY+40, "Node#1", "Node#1 content");
	var node1 = new createTextNode(rectX+50,rectY+160, "Central node", "Central node content");
	var node2 = new createTextNode(rectX+150,rectY+280, "Node#3", "Node#3 content");
	var node3 = new createTextNode(rectX-50,rectY+280, "Node#2", "Node#2 content");
	var node4 = new createTextNode(rectX+250,rectY+40, "Node#4", "Node#4 content");
	addLink(0, 1);
	addLink(1, 2);
	addLink(1, 3);
}

function createBMC() {
	deleteAll();
	var imageObj = new Image();
	imageObj.src = '/static/visionary/img/bmc.png';
	imageObj.onload = function() {	
		createImageNode(rectX-400,rectY-220, "BMC", "BMC");	
		var node0 = new createTextNode(rectX-120,rectY-100, "Partner#1", "Partner description.");
		var node0 = new createTextNode(rectX-120,rectY-10, "Partner#2", "Partner description.");
		var node0 = new createTextNode(rectX-120,rectY+80, "Partner#3", "Partner description.");
		mindmapData[0].group.add(mindmapData[1].group);
		mindmapData[0].group.add(mindmapData[2].group);
		mindmapData[0].group.add(mindmapData[3].group);
		mindmapData[1].group.setPosition(280,120);
		mindmapData[2].group.setPosition(280,200);
		mindmapData[3].group.setPosition(280,280);
		var node0 = new createTextNode(rectX-120,rectY-100, "Value#1", "Value description.");
		var node0 = new createTextNode(rectX-120,rectY-10, "Value#2", "Value description.");
		var node0 = new createTextNode(rectX-120,rectY+80, "Value#3", "Value description.");
		mindmapData[0].group.add(mindmapData[4].group);
		mindmapData[0].group.add(mindmapData[5].group);
		mindmapData[0].group.add(mindmapData[6].group);
		mindmapData[4].group.setPosition(600,120);
		mindmapData[5].group.setPosition(600,200);
		mindmapData[6].group.setPosition(600,280);	
		var node0 = new createTextNode(rectX-120,rectY-100, "Customer#1", "Customer description.");
		var node0 = new createTextNode(rectX-120,rectY-10, "Customer#2", "Customer description.");
		var node0 = new createTextNode(rectX-120,rectY+80, "Customer#3", "Customer description.");
		mindmapData[0].group.add(mindmapData[7].group);
		mindmapData[0].group.add(mindmapData[8].group);
		mindmapData[0].group.add(mindmapData[9].group);
		mindmapData[7].group.setPosition(920,120);
		mindmapData[8].group.setPosition(920,200);
		mindmapData[9].group.setPosition(920,280);		
		var node0 = new createTextNode(rectX-120,rectY-100, "Activity#1", "Activity description.");
		var node0 = new createTextNode(rectX-120,rectY+80, "Resource#1", "Partner description.");
		mindmapData[0].group.add(mindmapData[10].group);
		mindmapData[0].group.add(mindmapData[11].group);
		mindmapData[10].group.setPosition(440,120);
		mindmapData[11].group.setPosition(440,280);
		var node0 = new createTextNode(rectX-120,rectY-100, "Relationship#1", "Relationship description.");
		var node0 = new createTextNode(rectX-120,rectY+80, "Channel#1", "Channel description.");
		mindmapData[0].group.add(mindmapData[12].group);
		mindmapData[0].group.add(mindmapData[13].group);
		mindmapData[12].group.setPosition(760,120);
		mindmapData[13].group.setPosition(760,280);
		var node0 = new createTextNode(rectX-120,rectY-100, "Cost#1", "Cost description.");
		var node0 = new createTextNode(rectX-120,rectY+80, "Cost#2", "Cost description.");
		mindmapData[0].group.add(mindmapData[14].group);
		mindmapData[0].group.add(mindmapData[15].group);
		mindmapData[14].group.setPosition(280,470);
		mindmapData[15].group.setPosition(440,470);
		var node0 = new createTextNode(rectX-120,rectY-100, "Cost#1", "Cost description.");
		var node0 = new createTextNode(rectX-120,rectY+80, "Cost#2", "Cost description.");
		mindmapData[0].group.add(mindmapData[16].group);
		mindmapData[0].group.add(mindmapData[17].group);
		mindmapData[16].group.setPosition(680,470);
		mindmapData[17].group.setPosition(840,470);

				
		
		layer.draw();
	};
}

function setParent() {
	positionParent=selectedNode;
}

function addToParent(child,parent) {
	var p = mindmapData[child].group.getAbsolutePosition();
	mindmapData[parent].group.add(mindmapData[child].group);
	mindmapData[child].group.setAbsolutePosition(p.x,p.y);layer.draw();
}

function unparent(id) {
	var p = mindmapData[id].group.getAbsolutePosition();
	layer.add(mindmapData[id].group);
	mindmapData[id].group.setPosition(p.x,p.y);layer.draw();
	//console.log(id+' unparented');
}

function theyAreColliding(rect1, rect2) {
  return !(rect2.getX() > rect1.getX()+rect1.getWidth() || 
           rect2.getX()+rect2.getWidth() < rect1.getX() || 
           rect2.getY() > rect1.getY()+rect1.getHeight() ||
           rect2.getY()+rect2.getHeight() < rect1.getY());
}
function checkCollide(pointX, pointY, objectx, objecty, objectw, objecth) { // pointX, pointY belong to one rectangle, while the object variables belong to another rectangle
      var oTop = objecty;
      var oLeft = objectx; 
      var oRight = objectx+objectw;
      var oBottom = objecty+objecth; 

      if(pointX > oLeft && pointX < oRight){
           if(pointY > oTop && pointY < oBottom ){
                return 1;
           }
      }
      else
           return 0;
 };

var mainLayout = '';
$(document).ready(function() {
	//Load data:
	if(doLoadNodes="true"){
		viewMap();
	}
	
	//create default nodes
	if (is_authenticated==0 && thisMapSlug == "") {createDefaultNodes3();}

	//Setup interface.
	$('body').layout({ applyDefaultStyles: true,
	inset:{
		top:19
	},
	default : {
    },
    north : {
       resizable : false,
       initClosed : true
    } });
	$('#east').layout({ applyDefaultStyles: true });
	$('#south').layout({ applyDefaultStyles: true });
	mainLayout = $('body').layout();
	mainLayout.sizePane("east", "50%");
	var rightLayout = $('#east').layout();
	rightLayout.sizePane("south", "50%");
	var bottomRightLayout = $('#south').layout();
	bottomRightLayout.sizePane("west", "50%");
	
//	mainLayout.sizePane("north", 50); //wtf for some reason this line messes with sign up widget. Like waat??
	var northIsOpen = false;
	$("#mindmapsButton").on('click', function(){
		mainLayout.sizePane("north", 50);
		if (!northIsOpen){
			mainLayout.open("north");
			northIsOpen = true;
		} else {
			//mainLayout.sizePane("north", 22);
			mainLayout.close("north");
			northIsOpen = false;
		}
	});
	
	mailingListPopup();
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



$(document).keydown(function(e) {
        switch (e.keyCode) {
            case 8:  // Backspace
            	if(!type && !disableHotkeys){
	            	e.preventDefault();
	            	mindmapData.splice(selectedNode,1);
	            	updateNodes();
	            	//console.log('backspace');
                }
            case 9:  // Tab
            case 13: // Enter
            case 37: // Left
            case 38: // Up
            case 39: // Right
            case 40: // Down
            break;
        }

    });

//Delete all.
$("#deleteAll").on('click', function(){
	deleteAll();
});

//Set parent node button.
$("#setParentNode").on('click', function(){
	setParent();
});

//Parent node button.
$("#parentNode").on('click', function(){
	addToParent();
});

//Unparent node button.
$("#unparentNode").on('click', function(){
	unparent();
});

//Create BMC
$("#createBMC").on('click', function(){
//	var imageObj = new Image();
//	imageObj.src = '/static/visionary/img/bmc.png';
//	imageObj.onload = function() {	
//		createImageNode(rectX+120,rectY-220, "BMC", "BMC");
//		layer.draw();
//	}
	createBMC();
});

//Create defaultNodes
$("#createDefaultNodes").on('click', function(){
		createDefaultNodes3();
});

//Focus on node
$("#focusOnNode").on('click', function(){
		focusOnNodeInEditor = !focusOnNodeInEditor;
		updateEditor();
		if (focusOnNodeInEditor) {
			$("#focusOnNode").css('background-color', '#f66303');
		} else {
			$("#focusOnNode").css('background-color', '');
		}
		
});

function deleteAll() {
	mindmapData=[];
	updateNodes();
}
//Link nodes.
function hookPress(){
	//if parent is not selected - select it, if it is - select child
	if (isParentSelected == false && hookPressed == true) {
		parentNode = selectedNode;
		isParentSelected = true;
		linkGhost(parentNode);
		hookPressed = false;
		console.log('parent selected');
	} else if (isParentSelected == true) {
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
	var handle = new Kinetic.Circle({
		radius:3,
		fill:'#a3b8c3',
		//stroke:'black',
		//strokeWidth:2,
	});
	link.handle = handle;							
	link.id = links.length;
	handle.on('click', function(){
		selectedLink = link.id;
		for (node in mindmapData){
			mindmapData[node].frame.setStrokeWidth(0.5);
		}
		for (l in links){
			links[l].setStrokeWidth(1);
		}
		link.setStrokeWidth(2);
		console.log('link ' + selectedLink + ' is selected');
		layer.draw();
	});
	link.setPoints([0,0,1,1]);
	link.parentNode = parentNode;
	link.childNode = childNode;
	
//	mindmapData[parentNode].links.push(link);	
//	mindmapData[childNode].links.push(link);
	links.push(link);
	layer.add(link);
	layer.add(handle);
	link.moveToBottom();
	handle.moveToBottom();
	
	if (ghostLink) {ghostLink.remove();}
	ghostLink='';
//	link.moveUp();
	updateLinks();

//	canvas.removeEventListener('mousemove', );
}


var pointer;
function linkGhost(parentNode) {
	//create Link
	var link = new Kinetic.Line({ 
							x: 1, 
							y: 1,
							stroke: '#a3b8c3',
							strokeWidth: 1,
							lineCap: 'round',
							lineJoin: 'round',
							dashArray: [2, 2]
							});
	link.parentNode = parentNode;
	link.setPoints([0,0,1,1]);
	ghostLink = link;
	console.log(ghostLink);
	layer.add(link);
//	link.moveToBottom();

	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}
	var canvas = document.getElementsByTagName('canvas')[0];;
	var context = canvas.getContext('2d');
	
	canvas.addEventListener('mousemove', function(evt) {
		if (hookPressed == true){
			pointer = getMousePos(canvas, evt);
			linkParent = link.parentNode;
			parent = mindmapData[linkParent];
			ghostLink.setPoints([parent.posX, parent.posY, pointer.x-1, pointer.y-1]);
			layer.draw();
		}
	}, false);
}


function updateLinks(parentNode, childNode){
	parent = mindmapData[parentNode];
	child = mindmapData[childNode];

	for(l in links){//could probably do for link in links.
		linkParent = links[l].parentNode;
		linkChild = links[l].childNode;		
		parent = mindmapData[linkParent];
		child = mindmapData[linkChild];
		shiftY = 0;
		links[l].setPoints([parent.posX, parent.posY+shiftY, child.posX, child.posY+shiftY]);
//		links[l].setPoints([parent.posX, parent.posY+shiftY, pointer.x, pointer.y]);
		links[l].handle.setAbsolutePosition((parent.posX+child.posX)/2+1, (parent.posY + child.posY)/2+1);
	}

	layer.draw();
}

//function redrawLinks(){
//	for (l in links){
//		linkParent = links[l].parentNode;
//		linkChild = links[l].childNode;
//		addLink(linkParent, linkChild);
//	}
//}


//Delete link button.
$("#deleteLink").on('click', function(){
	links[selectedLink].remove();
	links[selectedLink].handle.remove();
	parentNodeId = links[selectedLink].parentNode;
	parentNode = mindmapData[parentNodeId];
	console.log('need to delete '+links[selectedLink].childNode);
	for (c in parentNode.children)
	{
		if (parentNode.children[c] == links[selectedLink].childNode)
		{
			console.log('children before '+parentNode.children);
			console.log('want to delete the element with value '+parentNode.children[c]+' which is at position '+c);
			parentNode.children.splice(c,1);
			console.log('children after '+parentNode.children);			
		}
	}
	links.splice(selectedLink,1);
	
	//node = mindmapData[selectedNode];
	//delete node from mindmapData and update nodes.
//	for (l in node.links) {
//		link = node.links[l];
//		console.log(link);
//		links[link].remove();
//		links.splice(link,1);//links global variable, don't confuse with the object attrebute "mindmapData[selectedNode].links"
//	}
//	updateLinks();
	layer.draw();
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