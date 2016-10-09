/**
 * Created by londreblocker on 10/7/16.
 */
$(function() {
	$("#name").keyup(function() {
		$("#greeting").text("Hi, " + $("#name").val() + "!");
	})
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	
});
