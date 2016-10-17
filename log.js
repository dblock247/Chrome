/**
 * Created by londreblocker on 10/16/16.
 */
/**
 * Logger Object
 *
 * @type {{logs: [string], action: {allow: string, deny: string, complete: string, error: string}, allow: log.allow, deny: log.deny, complete: log.complete, error: log.error, format: log.format, print: log.print, debug: log.debug, dump: log.dump, last: log.last, first: log.first, send: log.send, console: log.console, destroy: log.destroy}}
 */
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
		if (this.logs.length > 0) {
			email({body: this.print()});
		}
	},
	
	console: function (object) {
		console.log(object);
	},
	
	destroy: function () {
		this.logs = [];
	}
};
