var ModalSms = function () {
	this.open = false
	this.type = "name"
}

ModalSms.prototype.getNamePromise = function () {
	this.open = true
	this.type = "name"
}

export const key = "$modalSms"
export const inject = null
export const fn = ModalSms
