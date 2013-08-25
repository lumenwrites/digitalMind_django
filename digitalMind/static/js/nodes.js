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
      
// CREATE NODE  
function createTextNode(posX, posY, title, content) {
		this.nodeId = id;
		title = title+' '+this.nodeId;
		id++;
	      var nodeGroup = new Kinetic.Group({
	        draggable: true
	      });
	      this.test = 'test node attribute';
	      this.content = content;
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
	    
	    var currentNode = this;
	    this.group = nodeGroup;
	      
	    nodeGroup.on('click', function(){
	        exportText();
	        $('#nodeTitle').show();
	        $('#content').show();	        
	        $('#nodeTitle').val(currentNode.titleText.getText());
	        $('#content').val(currentNode.content);

	        selectedNode = currentNode;
	        layer.draw();

        })	      
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
        
        var toplevel = $('#tree1').tree('getNodeById', 1);
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




//MAKE NODE BUTTON
$("#createTextNode").on('click', function(){
	createTextNode(rectX,rectY, "New Node", "Node content.");
	exportText();
});
//FINISH MAKE NODE BUTTON



$('#nodeTitle').hide();
$('#content').hide();

//EDIT NODE
function editNode(node, title, content) {
	node.titleText.setText(title);
	layer.draw();
	var treeNode = $('#tree1').tree('getNodeById', selectedNode.nodeId);
	$('#tree1').tree('updateNode', 
						treeNode,
						{
						label:title,
						content:selectedNode.content
							
						});
	node.content = $('#content').val();
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
	var line = new Kinetic.Line({ 
								x: 1, 
								y: 1,
								stroke: '#a3b8c3',
								strokeWidth: 1,
								lineCap: 'round',
								lineJoin: 'round'
								});

	line.setPoints([ parentNode.group.getX(), parentNode.group.getY(), childNode.group.getX(), childNode.group.getY() ]);
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

	var node1 = new createTextNode(rectX+50,rectY+80, "Node", "Node content");
	var node2 = new createTextNode(rectX+100,rectY+160, "Node", "Node content");

	toplevel = $('#tree1').tree('getNodeById', 1);
	$('#tree1').tree('openNode',toplevel,true);
	//link(node1,node2);
	
});
//FINISH CRETING NODES


var textExport = '';
//EXPORT TEXT
function exportText() {
    var node = $('#tree1').tree('getNodeById', 1);
	for (var i=0; i < node.children.length; i++) {
		var child = node.children[i];
		textExport = textExport + '<br/>' + child.name  + '<br/>' + child.content;	
	}	
	CKEDITOR.instances['editor1'].setData(textExport);
	textExport = '';
    
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
