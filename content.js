/**
 * Created by londreblocker on 10/7/16.
 */

/**
 * Sends messsage to background script alerting it that it needs
 * protection.
 */
chrome.runtime.sendMessage({tab: "OrderTicket"}, function (response) {
	// If response == protected show protection
	if (response.protected) shield();
});

/**
 * Adds protection visual to order ticket window
 */
function shield() {
	
}
