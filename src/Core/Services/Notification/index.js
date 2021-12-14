import _ from "lodash"
import md5 from "blueimp-md5"

var Notification = function ($rootScope, $timeout) {
	this.notifications = []
	this.queue = []
	this.$rootScope = $rootScope
	this.$timeout = $timeout
}

Notification.prototype.notify = function (obj, wait) {
	obj.wait = _.defaultTo(wait, _.defaultTo(obj.wait, 5000))

	var hash = md5(JSON.stringify(obj))
	var duplicate = _.find(_.concat(this.notifications, this.queue), {
		hash: hash,
	})

	if (!duplicate) {
		if (this.notifications.length < 7) {
			obj.hash = hash
			obj.timeout = this.$timeout(
				_.bind(function () {
					this.deNotify(obj)
				}, this),
				obj.wait
			)
			this.notifications.push(obj)
		} else {
			this.queue.push(obj)
		}
	}
}

Notification.prototype.deNotify = function (obj) {
	if (this.notifications.length > 0) {
		this.$rootScope.$apply(
			_.bind(function () {
				if (_.get(obj, "hash")) {
					_.remove(this.notifications, { hash: obj.hash })
				} else {
					this.notifications.shift()
				}
			}, this)
		)
	}
	if (this.queue.length > 0) {
		this.notify(this.queue.shift())
	}
}

Notification.prototype.error = function (header, body, wait) {
	header = header || "Error!"
	var obj = {
		header: header,
		body: body,
		type: "error",
	}

	this.notify(obj, wait)
}

Notification.prototype.success = function (header, body, wait) {
	header = header || "Success!"
	var obj = {
		header: header,
		body: body,
		type: "success",
	}

	this.notify(obj, wait)
}

Notification.prototype.warn = function (header, body, wait) {
	var obj = {
		header: header,
		body: body,
		type: "warning",
	}

	this.notify(obj, wait)
}

Notification.prototype.clear = function (index) {
	this.notifications.splice(index, 1)

	if (this.queue.length > 0) {
		var obj = this.queue.shift()
		this.notify(obj)
	}
}

export const key = "$notification"
export const inject = ["$rootScope", "$timeout"]
export const fn = Notification
