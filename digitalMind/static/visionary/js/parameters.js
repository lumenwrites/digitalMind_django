function showParameters() {
	$('#nodeTitle').show();
	$('#showNodeContent').show();	        
	$('#element').show();	        
	$('#content').show();
	updateParameters(selectedNode);
}

$("#nodeTitle").focusin(function() {
  disableHotkeys = true;
});
$("#nodeTitle").focusout(function() {
  disableHotkeys = false;
});

function updateParameters(id) {
	$('#nodeTitle').val(mindmapData[id].title);
	//$('#content').val(mindmapData[id].content);
}

//Rename node
$('#nodeTitle').on('input', function(){
	mindmapData[selectedNode].title = $('#nodeTitle').val();
	updateNode(selectedNode);
	updateTree();
	updateEditor();
});

//Edit content
$('#content').on('input', function(){
	mindmapData[selectedNode].content = $('#content').val();
	updateEditor();	
});

//Fold/undold. Maybe temporary.
//$('#showNodeContent').change(function(){
$('#parameters').find(':checkbox').change(function(){
	mindmapData[selectedNode].showContent=!mindmapData[selectedNode].showContent;
});