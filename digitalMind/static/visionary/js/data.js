var mindmapData= new Array()
var mindmapDataSaved;

function addMap(){
	
}

function renameMap(){
	
}


function deleteMap(){
	//$.post("/deletemap/", {mapName : mindmapDataSaved});
}


function saveMap(){
	
}


function viewMap(){
$(document).ready(function() {
	if (mindmapDataSaved != "empty"){
		length = mindmapDataSaved.length;
		mindmapData = [];
		nodesToCreate=mindmapDataSaved;
		for(var i = 0; i < length; i++){
			var toCreate = new createTextNode(nodesToCreate[i].posX,nodesToCreate[i].posY, nodesToCreate[i].title, nodesToCreate[i].content);
			//console.log(toCreate); console.log(nodeList);
		};
		
		for(node in nodesToCreate){
			for (l in nodesToCreate[node].children) {
				//console.log('add link between ' + nodesToCreate[node].id + ' and '+ nodesToCreate[node].children[l]);		
				addLink(nodesToCreate[node].id, nodesToCreate[node].children[l]);	
			}
		}
		
		for(node in nodesToCreate){
			mindmapData[node].position = nodesToCreate[node].position;
		}
		
		updateTreeNew();
		updateEditor();
	}
});
}







function saveState(){
	mindmapDataSaved = JSON.stringify(mindmapData);
	$.post("/savemap/"+thisMapSlug, {mindmapDataSaved : mindmapDataSaved});
	console.log(mindmapDataSaved);
}

function loadState(parse){
	length = parse.length;
	mindmapData = [];
	nodesToCreate=parse;
	for(var i = 0; i < length; i++){
		var toCreate = new createTextNode(nodesToCreate[i].posX,nodesToCreate[i].posY, nodesToCreate[i].title, nodesToCreate[i].content);
		//console.log(toCreate); console.log(nodeList);
	};
	
	for(node in nodesToCreate){
		for (l in nodesToCreate[node].children) {
			//console.log('add link between ' + nodesToCreate[node].id + ' and '+ nodesToCreate[node].children[l]);		
			addLink(nodesToCreate[node].id, nodesToCreate[node].children[l]);	
		}
	}
	
	for(node in nodesToCreate){
		mindmapData[node].position = nodesToCreate[node].position;
	}
	
	updateTreeNew();
	updateEditor();
}

$("#saveData").on('click', function(){
	console.log(saveState());
});



var canvas = document.getElementsByTagName('canvas')[0];
var thumbnail = '';
function saveThumbnail() {
	canvas = document.getElementsByTagName('canvas')[0];
	thumbnail = Canvas2Image.saveAsPNG(canvas, false, 3000, 3000);
//	thumbnail = Canvas2Image.saveAsPNG(canvas, true);
	console.log('saved');
}
$("#saveImage").on('click', function(){
	saveThumbnail();
});

$(function() {
	$("#mindmaps").find("div").each(function(){ 
		$(this).find("#confirm").find("a").on("click", function(e) {
		    var link = this;
		
		    e.preventDefault();
		
		    $("<div style='z-index:10000;'>Are you sure you want to delete this mindmap?</div>").dialog({
		        buttons: {
		            "Ok": function() {
		                window.location = link.href;
		            },
		            "Cancel": function() {
		                $(this).dialog("close");
		            }
		        }
		    });
		    $(".ui-dialog").find(".ui-dialog-titlebar").remove();
		});
	});
});

$(function() {
	if ((numberOfUserMaps >= 3)&&(subscription == "none")) {	 
	    $("#addMap").on("click", function(e) {
	        var link = this;
		        e.preventDefault();       
		        $("#subscribeDialog").dialog({
		            buttons: {
		                "Cancel": function() {
		                    $(this).dialog("close");
		                }
		            }
		        });
		        $(".ui-dialog").find(".ui-dialog-titlebar").remove();
	        
	    });
	}
});


//Mailing list popup
function mailingListPopup(){
	if (is_authenticated==0) {
		if ($.cookie('sawPopup') != '1') {
			$("#mailingListDialogue").dialog({
			    buttons: {
			        "Cancel": function() {
			            $(this).dialog("close");
			        }
			    }
			});
			$(".ui-dialog").find(".ui-dialog-titlebar").remove();
		}
		$.cookie('sawPopup', '1', { expires: 30 });
	}	
}

$("#joinNewsletterButton").on('click', function(){
	$("#mailingListDialogue").dialog({
			    buttons: {
			        "Cancel": function() {
			            $(this).dialog("close");
			        }
			    }
			});
	$(".ui-dialog").find(".ui-dialog-titlebar").remove();
});

