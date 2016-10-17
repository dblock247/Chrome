/**
 * Created by londreblocker on 10/7/16.
 */


/**
 * Message Listener
 *
 * Listens for messages from the content script. If the message is from a OrderTicket
 * it records the id of the tab that will be protected.
 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.tab == "OrderTicket") {
		oldTab = secureTabId;
		if (sender.tab.id != oldTab && oldTab > -1 && singleton) destroy([oldTab]);
		secureTab = sender.tab;
		secureTabId = sender.tab.id;
		sendResponse({protected: true});
	}
});

/**
 * Request Listener
 *
 * Listens for outgoing requests. It acts as the requests gatekeeper. It allows
 * request that meet certain criteria and blocks all other requests.
 */
chrome.webRequest.onBeforeRequest.addListener(function (request) {
		//if (request.method == "GET") return {cancel: false};
		if (isError()) return {cancel: true};
		//if (debug) log.console(request);
		if (debug && request.method == "POST") console.log("[" + moment(request.timeStamp).format("LLL") + "]: body.raw - " + request.requestBody.raw);
		if (debug && request.method == "POST") console.log("[" + moment(request.timeStamp).format("LLL") + "]: body.formData - " + request.requestBody.formData);
		log.allow(request);
		if (debug) log.debug();
	},
	{tabId: secureTabId, urls: ["<all_urls>"], types: [ResourceType.xmlhttprequest]},
	["blocking", "requestBody"]
);

/**
 * Requests Completion Listener
 *
 * Listens for complete requests and logs the request info.
 */
chrome.webRequest.onCompleted.addListener(function (request) {
		log.complete(request);
		if (debug) log.debug();
	},
	{tabId: secureTabId, urls: ["<all_urls>"], types: [ResourceType.xmlhttprequest]},
	["responseHeaders"]
);

/**
 * Request Error Listener
 *
 * Listens for request error and manually blocked requests. When there is an error
 * or a blocked request a notification is sent to the user. The user can choose to
 * Ignore the error or send the error diagnotics log to the support email.
 */
chrome.webRequest.onErrorOccurred.addListener(function (request) {
		log.error(request);
		if (debug) log.dump();
		notify("email", "Send error log", "Click Yes to email your error logs to customer support");
	},
	{tabId: secureTabId, urls: ["<all_urls>"], types: [ResourceType.xmlhttprequest]}
);

/**
 * Tab Close Event Listener
 *
 * Listens for closed tabs. If the closed tabId == secureTabId the listener performs the clean
 * up of local variables.
 */
chrome.tabs.onRemoved.addListener(function (tabId, window) {
	if (debug) console.log("closed tab: " + tabId + " in window: " + window.windowId);
	if (tabId == secureTabId) {secureTabId = -1; oldTab = null; log.destroy();}
});

/**
 * Notification Button Click Listener
 *
 * Listens for button click action from the notification. It performs the correct actions
 * based upon the users actions.
 */
chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
	if (debug) console.log("notificationId: " + notificationId + " buttonIndex: " + buttonIndex);
	if (notificationId == "email" && buttonIndex == 0) log.send();
	clearNotification(notificationId);
});
