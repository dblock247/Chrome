/**
 * Created by londreblocker on 10/7/16.
 */
var debug = true;
var tab = null;
var secureTabId = -1;
var oldTab = null;
var logs = [];

if (debug) console.log("background.js");

// Listen for message from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.sender == "OrderTicket") {
		oldTab = secureTabId;
		if (sender.tab.id != oldTab && oldTab > -1) destroy([oldTab]);
		tab = sender.tab;
		secureTabId = tab.id;
	}
});

// Request Event Listener
chrome.webRequest.onBeforeRequest.addListener(function (request) {
		//if (debug) console.log(request);
		//if (debug) console.log("[" + moment(request.timeStamp).format("LLL") + "]: " + request.url);
		//if (debug && request.method == "POST") console.log("[" + moment(request.timeStamp).format("LLL") + "]: body.raw - " + request.requestBody.raw);
		//if (debug && request.method == "POST") console.log("[" + moment(request.timeStamp).format("LLL") + "]: body.formData - " + request.requestBody.formData);
		logs.push("[" + moment(request.timeStamp).format("LLL") + "]: " + request.url)
	},
	{tabId: secureTabId, urls: ["<all_urls>"]},
	["blocking"]
);

// Fires when the active tab in a window changes
chrome.tabs.onActivated.addListener(function (activeInfo) {
	if (debug) console.log("windowId: " + activeInfo.windowId + " tabId: " + activeInfo.tabId)
	sendMail(logs.join("\n"));
	if (activeInfo.tabId == secureTabId) console.log(logs.join("\n"));
});

// Fired when a tab is closed.
chrome.tabs.onRemoved.addListener(function (tabId, window) {
	if (debug) console.log("closed tab: " + tabId + " in window: " + window.windowId);
	
	if (tabId == secureTabId) secureTabId = -1;
});

/**
 * Notifications
 */

chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
	
	console.log("notificationId: " + notificationId + " buttonIndex: " + buttonIndex);
	clearNotification(notificationId);
	setBadge("");
});

function notify(title, message) {
	var type = {
		basic: "basic",
		image: "image",
		list: "list",
		progress: "progress"
	};
	
	var options = {
		type: type.basic,
		title: title,
		message: message,
		priority: 2,
		iconUrl: "icon.png",
		buttons: [
			{title: "Send"},
			{title: "Cancel"}
		]
	};
	
	chrome.notifications.create(options, function (notificationId) { });
}

function updateNotification(notificationId) {
	chrome.notifications.update(notificationId, options, function (wasUpdated) {
		
	});
}

function clearNotification(notificationId) {
	chrome.notifications.clear(notificationId, function (wasCleared) {
		
	});
}

function setBadge(text) {
	chrome.browserAction.setBadgeBackgroundColor({color: "#f00", tabId: secureTabId});
	chrome.browserAction.setBadgeText({text: text.toString(), tabId: secureTabId});
	
}
/**
 * Utility Functions
 */

// Send email
function sendMail(body) {
	var mail = {
		to: "londre.blocker@gmail.com",
		from: "no-reply@gmail.com",
		subject: "Error",
		body: body
	};
	
	var link = "mailto:" + mail.to + "?subject=" + mail.subject + "&body=" + mail.body;
	if (debug) console.log(link);
	
	chrome.tabs.sendMessage(secureTabId, {sender: "email", location: encodeURI(link)}, function (response) { })
}

// Closes one or more tabs. [tabIds]
function destroy(tabIds) {
	chrome.tabs.remove(tabIds, function () {
		
	});
}

// Reload a tab.
function reload(tabId) {
	chrome.tabs.reload(tabId, function () {
		
	});
}

// Select a window
function selectWindow(windowId) {
	
	var state = {
		normal: "normal",
		minimized: "minimized",
		maximized: "maximized",
		fullscreen: "fullscreen",
		docked: "docked"
	};
	
	var updateInfo = {
		focused: true,
		drawAttention: true,
		state: state.normal
	};
	
	chrome.windows.update(windowId, updateInfo, function (window) {
		if (debug) console.log(window);
	})
}
