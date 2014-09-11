function nodeFromText(){
	//save selection
	var range = window.getSelection().getRangeAt(0);
	var selectionContents = range.extractContents();

	createTextNode(rectX+50,rectY+80, selectionContents.textContent, "content");
}


function textToData() {
	$("#editor").children().each(function(){
		id=$(this).attr('id');
		title = $(this).find(".title").html();
		content = $(this).find(".content").html();
		mindmapData[id].title = title;
		mindmapData[id].content = content;
		updateNode(id);
		updateParameters(selectedNode);
	});
}


//fire text to data each time there's a keyup in text editor.
var previous = $("#editor").text();
$check = function() {
	if ($("#editor").text() != previous){
		textToData();
	}
	previous = $("#mydiv").text();        
}
$("#editor").keyup($check);
    
    
function updateEditor(){
	$("#editor").html("");
	
	var orderedIds=listNodesByPosition();
	for(node in orderedIds){
		id = orderedIds[node];
		var div = document.createElement("div");
		div.id = mindmapData[id].id;//redundant, I could just say "i", but that way its more clear.
		$("#editor").append(div);    
		$("#"+mindmapData[id].id).html(
			"<h4 class='title'>"+mindmapData[id].title+"</h4>"+
			"<div class='content'><p>"+mindmapData[id].content+"</p></div>"
		);
	}
	//fold on click.
	//$("#editor").find(".title").on('click', function(){
	//	$(this).parent().find(".content").slideToggle('fast');
	//});
}

function updateEditorNew(){//trying to loop through tree data to preserve their order.
	$("#editor").html("");
	for(var i = 0; i < data.length; i++){
		console.log(data[i].id);
//		var div = document.createElement("div");
//		div.id = mindmapData[i].id;//redundant, I could just say "i", but that way its more clear.
//		$("#editor").append(div);    
//		$("#"+mindmapData[i].id).html(
//			"<h4 class='title'>"+mindmapData[i].title+"</h4>"+
//			"<p class='content'>"+mindmapData[i].content+"</p>"
//		);
	}
}

//fold on checkbox press
$("#showNodeContent").on('click', function(){
	$("#editor").find("#"+selectedNode).find(".content").slideToggle('fast');
});


$(document).ready(function(){
	$("#addNodeDiv").on('click', function(){
		nodeFromText();
	});
});