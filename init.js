/**
 * Created by londreblocker on 10/16/16.
 */
/**
 * Created by londreblocker on 10/7/16.
 */

/**
 * Local variables
 */
var debug = true;
var secureTab = null;
var secureTabId = -1;
var oldTab = null;
var singleton = false;

/**
 * Window State Enum
 *
 * Controls how the window will be placed on the screen
 * @type {{normal: string, minimized: string, maximized: string, fullscreen: string, docked: string}}
 */
var WindowState = {
	normal: "normal",
	minimized: "minimized",
	maximized: "maximized",
	fullscreen: "fullscreen",
	docked: "docked"
};

/**
 * Template Type Enum
 *
 * Controlls the type of notification that will appear
 * @type {{basic: string, image: string, list: string, progress: string}}
 */
var TemplateType = {
	basic: "basic",
	image: "image",
	list: "list",
	progress: "progress"
};

/**
 * Resource Type Enum
 *
 * Filter type s
 * @type {{mainFrame: string, subFrame: string, stylesheet: string, script: string, image: string, font: string, object: string, xmlhttprequest: string, ping: string, other: string}}
 */
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

/**
 * Sends notification the the screen
 *
 * @param id: string
 * @param title: string
 * @param message: string
 */
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

/**
 * Updates a notifications by its notificationId and changes its values
 * based upon the options param passed into the function.
 *
 * @param notificationId: string
 */
function updateNotification(notificationId) {
	chrome.notifications.update(notificationId, options, function (wasUpdated) {
		
	});
}

/**
 * Dismisses a active notification by its notificationId
 *
 * @param notificationId: string
 */
function clearNotification(notificationId) {
	chrome.notifications.clear(notificationId, function (wasCleared) {
		
	});
}

/**
 * Sets the text of the badge that hows about the extension icon. To remove
 * the badge set the text to an empty sting.
 *
 * @param text: string
 */
function setBadge(text) {
	chrome.browserAction.setBadgeBackgroundColor({color: "#f00", tabId: secureTabId});
	chrome.browserAction.setBadgeText({text: text.toString(), tabId: secureTabId});
}

/**
 * Sends an email by opening a new tab and setting its url to a mailto location.
 * All parts of the object param have default values. Its recommended to always
 * set the value for body.
 *
 * @param mail: object {to: string, from:string, subject: string, body: string}
 */
function email(mail) {
	mail.to = (mail.to != null) ? mail.to : "londre.blocker@gmail.com";
	mail.from = (mail.from != null) ? mail.from : "no-reply@gmail.com";
	mail.subject = (mail.subject != null) ? mail.subject : "Email Logs";
	mail.body = (mail.body != null) ? mail.body : "";
	
	var url = "mailto:" + mail.to + "?subject=" + mail.subject + "&body=" + encodeURIComponent(mail.body);
	if (debug) console.log(url);
	console.clear();
	log.dump();
	
	chrome.tabs.create({active: false, url: url}, function (tab) {
		setTimeout(function () {
			destroy([tab.id]);
		}, 300)
	})
}

/**
 * Closes a tab or tabs.
 *
 * @param tabIds: [int]
 */
function destroy(tabIds) {
	chrome.tabs.remove(tabIds, function () {
		
	});
}

/**
 * Reloads tab by tabId
 *
 * @param tabId: int
 */
function reload(tabId) {
	chrome.tabs.reload(tabId, function () {
		
	});
}

/**
 * Selects a window by its windowId and brings it to the front.
 *
 * @param windowId: int
 */
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

/**
 * Produces a random true false value that can be used to
 * insert random errors in a testing enviornment
 *
 * @returns {boolean}
 */
function isError() {
	if (debug) return Math.random() < 0.3;
	return false;
}
