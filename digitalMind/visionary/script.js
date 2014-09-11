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