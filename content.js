/**
 * Created by londreblocker on 10/7/16.
 */
chrome.runtime.sendMessage({sender: "OrderTicket"}, function() {
	console.log("Message Sent");
	// Store tab info
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.sender == "email") {
		window.location.href = request.location;
	}
});
