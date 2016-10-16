/**
 * Created by londreblocker on 10/7/16.
 */
var debug = true;
var secureTab = null;
var secureTabId = -1;
var oldTab = null;

/**
 * Enums
 */

var WindowState = {
	normal: "normal",
	minimized: "minimized",
	maximized: "maximized",
	fullscreen: "fullscreen",
	docked: "docked"
};

var TemplateType = {
	basic: "basic",
	image: "image",
	list: "list",
	progress: "progress"
};

var ResourceType = {
	mainFrame: "main_frame",
	subFrame: "sub_frame",
	stylesheet: "stylesheet",
	script: "script",
	image: "image",
	font: "font",
	object: "object",
	xmlhttprequest: "xmlhttprequest",
	ping: "ping",
	other: "other"
};

var OnBeforeRequestOptions = {
	blocking: "blocking",
	requestBody: "requestBody"
};


if (debug) console.log("background.js");

// Listen for message from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.sender == "OrderTicket") {
		oldTab = secureTabId;
		//if (sender.tab.id != oldTab && oldTab > -1) destroy([oldTab]);
		secureTab = sender.tab;
		secureTabId = sender.tab.id;
	}
});

// Request Event Listener
chrome.webRequest.onBeforeRequest.addListener(function (request) {
		if (request.method == "GET") return {cancel: false};
		//if (debug) log.console(request);
		if (debug && request.method == "POST") console.log("[" + moment(request.timeStamp).format("LLL") + "]: body.raw - " + request.requestBody.raw);
		if (debug && request.method == "POST") console.log("[" + moment(request.timeStamp).format("LLL") + "]: body.formData - " + request.requestBody.formData);
		log.allow(request);
		if (debug) log.debug();
	},
	{tabId: secureTabId, urls: ["<all_urls>"], types: [ResourceType.xmlhttprequest]},
	["blocking", "requestBody"]
);

chrome.webRequest.onCompleted.addListener(function (request) {
		log.complete(request);
		if (debug) log.debug();
	},
	{tabId: secureTabId, urls: ["<all_urls>"], types: [ResourceType.xmlhttprequest]},
	["responseHeaders"]
);

chrome.webRequest.onErrorOccurred.addListener(function (request) {
		log.error(request);
		if (debug) log.dump();
	},
	{tabId: secureTabId, urls: ["<all_urls>"], types: [ResourceType.xmlhttprequest]}
);

// Fires when the active tab in a window changes
chrome.tabs.onActivated.addListener(function (activeInfo) {
	if (debug) console.log("windowId: " + activeInfo.windowId + " tabId: " + activeInfo.tabId);
});

// Fired when a tab is closed.
chrome.tabs.onRemoved.addListener(function (tabId, window) {
	if (debug) console.log("closed tab: " + tabId + " in window: " + window.windowId);
	if (tabId == secureTabId) {secureTabId = -1; oldTab = null; log.logs = [];}
});

/**
 * Notifications
 */

chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
	if (debug) console.log("notificationId: " + notificationId + " buttonIndex: " + buttonIndex);
	clearNotification(notificationId);
	setBadge("");
});

function notify(id, title, message) {
	
	var options = {
		type: TemplateType.basic,
		title: title,
		message: message,
		priority: 2,
		iconUrl: "icon.png",
		buttons: [
			{title: "Send"},
			{title: "Cancel"}
		]
	};
	
	chrome.notifications.create(id, options, function (notificationId) { });
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
function email(mail) {
	mail.to = (mail.to != null) ? mail.to : "londre.blocker@gmail.com";
	mail.from = (mail.from != null) ? mail.from : "no-reply@gmail.com";
	mail.subject = (mail.subject != null) ? mail.subject : "Email Logs";
	mail.body = (mail.body != null) ? mail.body : "";
	
	var link = "mailto:" + mail.to + "?subject=" + mail.subject + "&body=" + mail.body;
	if (debug) console.log(link);
	
	chrome.tabs.sendMessage(secureTabId, {sender: "email", location: link}, function (response) { });
	
	
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
	
	var updateInfo = {
		focused: true,
		drawAttention: true,
		state: WindowState.normal
	};
	
	chrome.windows.update(windowId, updateInfo, function (window) {
		if (debug) console.log(window);
	})
}

var log =  {
	logs: [],
	action: {
		allow: "ALLOW",
		deny: "DENY",
		complete: "COMPLETE",
		error: "ERROR"
	},
	allow: function (request) {
		this.logs.push(this.format(request, this.action.allow));
	},
	deny: function (request) {
		this.logs.push(this.format(request, this.action.deny));
	},
	complete: function (request) {
		this.logs.push(this.format(request, this.action.complete));
	},
	error: function(request) {
		this.logs.push(this.format(request, this.action.error));
	},
	format: function (request, action) {
		return "[" + moment(request.timeStamp)
				.format("YYYY-MM-DD hh:mm:ss A") + "]: [" + action + "] [" + request.method + "] " + request.url;
	},
	print: function () {
		return this.logs.join("\n");
	},
	debug: function () {
		console.log(this.last());
	},
	dump: function () {
		console.log(this.print());
	},
	last: function () {
		if (this.logs.length > 0) return this.logs[this.logs.length - 1];
	},
	first: function () {
		if (this.logs.length > 0) return this.logs[0];
	},
	send: function () {
		email(this.logs.join("\n"));
	},
	console: function (object) {
		console.log(object);
	}
};
