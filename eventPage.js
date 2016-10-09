/**
 * Created by londreblocker on 10/7/16.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action == "show") {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			console.log(tabs[0]);
			chrome.pageAction.show(tabs[0].id);
		});
	}
});
