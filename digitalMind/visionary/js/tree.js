var data = [
//	{    
//		id: 1000,
//		label: 'toplevel',
//		name: 'toplevel',
//        children: [	
//        	]
//    }
];

$(function() {
    $('#tree1').tree({
        data: data,
        autoOpen: true,
        dragAndDrop: false,
        keyboardSupport: false,
    });
});

//Select node
$('#tree1').bind('tree.click', function(event) {//tree.select?
		if (event.node) {
    		selectedNode = event.node.id;
    		console.log('selected from tree '+selectedNode);
    	}
    });

	
function updateTree() {
	//empty tree
	data = [];
	$('#tree1').tree('loadData',data);
	
	//recreateNodes
	for(var i = 0; i < mindmapData.length; i++){
		$('#tree1').tree(
			'appendNode',
			{	
				id: mindmapData[i].id,
				label: mindmapData[i].title,
			}
		);
	}
	//Arrange nodes.
	//for(var i = 0; i < mindmapData.length; i++){
	//	var node = $tree.tree('getNodeBydId', 1);
	//	var target_node = $tree.tree('getNodeBydId', 2);
	//	$("#tree1").tree('moveNode', node, target_node, 'after');
	//}
}

function updateTreeNew() {
	//empty tree
	data = [];
	$('#tree1').tree('loadData',data);
	
	var orderedIds=listNodesByPosition();
	//recreateNodes
	for(node in orderedIds){
		id = orderedIds[node];
		$('#tree1').tree(
			'appendNode',
			{	
				id: mindmapData[id].id,
				label: mindmapData[id].title,
			}
		);
	}
	if (selectedNode){
		var node = $('#tree1').tree('getNodeById', selectedNode);
		$('#tree1').tree('selectNode', node);
		console.log(node.id+' node selected');
	}
	console.log('tree updated');
}

//move node
$('#tree1').bind(
    'tree.move',
    function(event) {
        console.log('moved_node', event.move_info.moved_node.id);
        console.log('target_node', event.move_info.target_node);
        console.log('position', event.move_info.position);
        
        //Attempt to set position by number. If I want to finish - gotta move all the previous nodes up, and all the post nodes down.
        //var shift=0;
        //if (event.move_info.position = "after") { shift = 1; } else { shift = -1;}
        //mindmapData[event.move_info.moved_node.id].position=mindmapData[event.move_info.target_node.id].position+shift;
        
        console.log('node with id '+event.move_info.moved_node.id + ' moved to a position ' + mindmapData[event.move_info.moved_node.id].position);
    }
);