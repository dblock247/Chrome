/**
 * Created by londreblocker on 10/18/16.
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
	Normal: "normal",
	Minimized: "minimized",
	Maximized: "maximized",
	Fullscreen: "fullscreen",
	Docked: "docked"
};

/**
 * Template Type Enum
 *
 * Controlls the type of notification that will appear
 * @type {{basic: string, image: string, list: string, progress: string}}
 */
var TemplateType = {
	Basic: "basic",
	Image: "image",
	List: "list",
	Progress: "progress"
};

/**
 * Resource Type Enum
 *
 * Filter type s
 * @type {{mainFrame: string, subFrame: string, stylesheet: string, script: string, image: string, font: string, object: string, xmlhttprequest: string, ping: string, other: string}}
 */
var ResourceType = {
	MainFrame: "main_frame",
	SubFrame: "sub_frame",
	Stylesheet: "stylesheet",
	Script: "script",
	Image: "image",
	Font: "font",
	Object: "object",
	XmlHttpRequest: "xmlhttprequest",
	Ping: "ping",
	Other: "other"
};
