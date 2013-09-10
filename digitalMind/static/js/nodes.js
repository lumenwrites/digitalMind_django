  var stage = new Kinetic.Stage({
    container: 'container',
    width: $('#left').width()-28,
    height: $('#left').height(),
  });
  
  var layer = new Kinetic.Layer();
  var rectX = stage.getWidth() / 2 - 50;
  var rectY = stage.getHeight() / 2 - 25;
  var selectedNode;
  var  id = 2;
  var parentNode, childNode;
  var isParentSelected = false;
  var nodeList = new Array();
      
// CREATE NODE  
function createTextNode(posX, posY, title, content) {
		this.nodeId = id;
		this.posX = posX;
		this.posY = posY;
		this.title = title;
		this.content = content;
	    var currentNode = this;
	    this.group = nodeGroup;
	    this.parent='';
	    this.child='';
	    this.nodeId = nodeList.push(currentNode)-1;//new length - 1 to findout id

		title = title+' '+this.nodeId;
		id++;
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
	        strokeWidth: 1,
	//        draggable: true,
	//        shadowColor: 'black',
	//        shadowBlur: 10,
	//        shadowOffset: [3, 3],
	//        shadowOpacity: 0.2,
	        cornerRadius: 5
	      });
	      
	      this.hookPoint = new Kinetic.Circle({
		      y:8,
		      radius:5,
		      fill:'#a3b8c3',
		      stroke:'black',
		      strokeWidth:2,
	      });
	      
	      this.titleText = new Kinetic.Text({
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
	      nodeGroup.add(this.titleText);
	      nodeGroup.add(this.hookPoint);
	      layer.add(nodeGroup);
	    

	      
	    nodeGroup.on('click', function(){
	        exportText();
	        $('#nodeTitle').show();
	        $('#content').show();	        
	        $('#nodeTitle').val(currentNode.titleText.getText());
	        $('#content').val(currentNode.content);

	        selectedNode = currentNode;
	        layer.draw();
	    
        })
        //save position
        nodeGroup.on('dragstart dragmove', function(){
        nodeList[currentNode.nodeId].posX=nodeGroup.getX();
        nodeList[currentNode.nodeId].posY=nodeGroup.getY();        
		});
		
		
        this.hookPoint.on('click', function(){
	        if (isParentSelected == false) {
		        parentNode = currentNode;
		        
	        } else {
		        childNode = currentNode;
		        
	        }
        	isParentSelected = !isParentSelected;

        	link(parentNode,childNode);
        	parentNode = ''; childNode = '';
        	isParentSelected = false;
        	
        	layer.draw();
        })	      

        layer.draw();
        
        var toplevel = $('#tree1').tree('getNodeById', 1000);
		$('#tree1').tree(
		    'appendNode',
		    {	
		        label: title,
		        id: this.nodeId,
		        content: this.content
		    },
		    toplevel
		);        
        
        
        

        return this.titleText + this.nodeId;
        //FINISH NODE CREATION 
}








$('#nodeTitle').hide();
$('#content').hide();

//EDIT NODE
function editNode(node, title, content) {
//Edit title
	node.titleText.setText(title);
	layer.draw();
	var treeNode = $('#tree1').tree('getNodeById', selectedNode.nodeId);
	$('#tree1').tree('updateNode', 
						treeNode,
						{
						label:title,
						content:selectedNode.content
							
						});
	nodeList[node.nodeId].title=title;
//Edit content						
	node.content = $('#content').val();
	nodeList[node.nodeId].content=content;	
}


$('#nodeTitle').on('input', function(){
	editNode(selectedNode, $('#nodeTitle').val(), $('#content').val());

});
$('#content').on('input', function(){
	editNode(selectedNode, $('#nodeTitle').val(), $('#content').val());
});
$('#nodeTitle').on('change',function(){
	exportText();
});
$('#content').on('change',function(){
	exportText();
});
//FINISH EDIT NODE



//LINK
function link(parentNode, childNode){
	//parentNode.child = childNode;
	//childNode.parent = parentNode;
	var line = new Kinetic.Line({ 
								x: 1, 
								y: 1,
								stroke: '#a3b8c3',
								strokeWidth: 1,
								lineCap: 'round',
								lineJoin: 'round'
								});

	line.setPoints([parentNode.group.getX(), parentNode.group.getY(), childNode.group.getX(), childNode.group.getY() ]);
	layer.add(line);
//	line.setPoints([1, 1, 500, 500 ]);
	parentNode.group.on('dragstart dragmove', function(){
		line.setPoints([ parentNode.group.getX(), parentNode.group.getY(), childNode.group.getX(), childNode.group.getY() ]);
	   layer.draw();  //redraw current layer
	});	
	childNode.group.on('dragstart dragmove', function(){
		line.setPoints([ parentNode.group.getX(), parentNode.group.getY(), childNode.group.getX(), childNode.group.getY() ]);

	   layer.draw();  //redraw current layer
	});	
	line.moveToBottom();
	layer.draw();
}


//FINISH LINK

//CREATING NODES
$(document).ready(function() {

	//var node1 = new createTextNode(rectX+50,rectY+80, "Node", "Node content");
	//var node2 = new createTextNode(rectX+100,rectY+160, "Node", "Node content");
	//console.log(node1); console.log(nodeList);
	toplevel = $('#tree1').tree('getNodeById', 1000);
	$('#tree1').tree('openNode',toplevel,true);
	//link(node1,node2);
	
});
//FINISH CRETING NODES

//MAKE NODE BUTTON
$("#createTextNode").on('click', function(){
	var toCreate = new createTextNode(rectX,rectY, "New Node", "Node content.");	
	exportText();
});
//FINISH MAKE NODE BUTTON


var textExport = '';
//EXPORT TEXT
function exportText() {
    var node = $('#tree1').tree('getNodeById', 1000);
	for (var i=0; i < node.children.length; i++) {
		var child = node.children[i];
		textExport = textExport + '<br/>' + child.name  + '<br/>' + child.content;	
	}	
	CKEDITOR.instances['editor1'].setData(textExport);
	textExport = '';
	return textExport;
    
};

var textExport = '';
//EDITING TREE
	$('#tree1').bind(
    'tree.click',
	function(event) {
        exportText();        
   });
	//FINISH EDITING TREE

//FINISH EXPORT TEXT

//SAVE/LOAD STATE
var treeData;
var toplevel;
function state(){
	
}
var stateToSave



function saveState(){

	//toplevel = $('#tree1').tree('getNodeById', 1);
	//treeData = toplevel.getData();
	//console.log(treeData);
	stateToSave = JSON.stringify(nodeList);
	$.post("/saveState/", 'state='+stateToSave);
	
	return 	stateToSave
}

$("#saveStateButton").on('click', function(){
	console.log(saveState());
});
//function loadState(){
//// $('#tree1').tree('loadData', treeData, toplevel);
//length = nodeList.length;
//nodesToCreate=nodeList;
//nodeList = [];
//for(var i = 0; i < length; i++){
//	createTextNode(nodesToCreate[i].posX,nodesToCreate[i].posY, nodesToCreate[i].title, nodesToCreate[i].content);
//};
 
//}
//FINISH SAVE/LOAD STATE
