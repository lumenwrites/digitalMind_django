//login and singup form sliding
jQuery(document).ready(function(){
	$('html').click(function() {
	$('#loginForm').slideUp('fast');
	$('#signupForm').slideUp('fast');	//Hide the menus if visible
	});

	$("#login").click(function(event){
	var value = $("#login").attr('value');
	$('#loginForm').slideToggle('fast');
	event.stopPropagation();
	});
	
	$('#loginForm').click(function(event){
     event.stopPropagation();
     });
	
	$("#signup").click(function(event){
	$('#signupForm').slideToggle('fast');
	event.stopPropagation();
	});
	
	$('#signupForm').click(function(event){
     event.stopPropagation();
     });
	
});


jQuery(document).ready(function(){
	//appear/disappear text in submit fields
		var titleField = document.getElementById("title");
	if(titleField){
	titleField.onfocus = function() {
		if (titleField.value == "image title") {
			titleField.value = ""
		}
	}
	
	titleField.onblur = function() {
		if (titleField.value == "") {
			titleField.value = "image title"
		}
	}
	}
	
	var descriptionField = document.getElementById("description");
	if(descriptionField){
	descriptionField.onfocus = function() {
		if (descriptionField.value == "description of your image") {
			descriptionField.value = ""
		}
	}
	
	descriptionField.onblur = function() {
		if (descriptionField.value == "") {
			descriptionField.value = "description of your image"
		}
	}
	}

	//show error message if the title is empty
	if(document.getElementById("title")){
	if(document.getElementById("title").value=="image title"){
		document.getElementById("errorMessage").innerHTML = "Please enter a title";
		return false;
	} else {
		document.getElementById("errorMessage").innerHTML = "";
		return true;
	}
	}
	
	//show/hide comments
	$('.commentsSection').slideUp('fast');
	$(".commentsTitle").click(function(event){
	$(this).next('.commentsSection').slideToggle('fast');mam
	event.stopPropagation();
	});

});

//rate ip ajax 
//var request = new XMLHttpRequest();
var request;
if (window.XMLHttpRequest){
	request = new XMLHttpRequest();
} else {
	request = new ActiveXObject("Microsoft.XMLHTTP");
}
/*request.open('GET', "data.txt"); //method get/post, name of file, asynchronous true or false
request.onreadystatechange = function(){
	if ((request.readyState === 4) && (request.status === 200)){
		console.log(request);
		document.writeln(request.responseText);
	}
}
request.send();
*/

//highlight current page
$(document).ready(function(){
2
var str=location.href.toLowerCase();
3
$(".navigation li a").each(function() {
4
if (str.indexOf(this.href.toLowerCase()) > -1) {
5
 $("li.highlight").removeClass("highlight");
6
$(this).parent().addClass("highlight");
7
}
8
 });
9
 })
