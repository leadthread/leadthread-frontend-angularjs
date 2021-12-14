import _ from "lodash"

/*=============================
	=            Proxy            =
	=============================*/

/**
 * This is a proxy class for outdated browsers (Just in case)
 * AND browsers that disable cookies/storage
 *
 * HTML 5 Local Storage is supported by these versions
 * API         | Chrome | IE  | FF  | Safari | Opera
 * Web Storage | 4.0    | 8.0 | 3.5 | 4.0    | 11.5
 *
 * @return void
 */
var StorageBase = function () {
	this.data = {}
}

/**
 * Returns all the items
 * @return {object} All the items
 */
StorageBase.prototype.getItems = function () {
	return this.data
}

/**
 * Returns a value from storage object
 * @param  {string} key The key to pull
 * @return {mixed}      The value of the key
 */
StorageBase.prototype.getItem = function (key) {
	return this.data[key]
}

/**
 * Set a value on the storage object by key
 * @param {string} key   The key to store as
 * @param {mixed}  value The value to store
 */
StorageBase.prototype.setItem = function (key, value) {
	this.data[key] = value
}

/**
 * Removes a key from the storage object
 * @param  {key} key The key to remove
 * @return {void}
 */
StorageBase.prototype.removeItem = function (key) {
	delete this.data[key]
}

/**
 * Clears everything
 * @return {void}
 */
StorageBase.prototype.clear = function () {
	this.data = {}
}

/*===============================
	=            Service            =
	===============================*/

/**
 * A Storage service for HTML5's local storage
 */
var StorageService = function (type) {
	this.driver = this.getDriver(type)
}

/**
 * Tests if there is enough space available
 * @param  {Storage} driver The Storage Driver to test
 * @param  {integer} size   Amount of KB to test
 * @return {Boolean}        Successful or not
 */
StorageService.prototype.testAvailableSpace = function (driver, size) {
	size = size || 1024

	var repeat = function (str, x) {
		return new Array(x + 1).join(str)
	}

	try {
		driver.setItem("test-available-space", repeat("x", (size * 1024) / 2)) // each JS character is 2 bytes
	} catch (e) {
		return false
	}

	driver.removeItem("test-available-space")
	return true
}

/**
 * Returns the storage driver to use just in case this is an unsupported browser
 * @return {object} The storage driver
 */
StorageService.prototype.getDriver = function (type) {
	var proxy = function () {
		console.warn(
			type +
				" is not supported or doesnt have enough space available! Using StorageBase."
		)
		return new StorageBase()
	}

	var test = _.bind(function (storage) {
		var success = true
		try {
			typeof storage
		} catch (e) {
			success = false
		}
		success = success && this.testAvailableSpace(storage, 1024)
		return success ? storage : proxy()
	}, this)

	if (type === "proxyStorage") {
		return new StorageBase()
	}

	if (typeof Storage !== "undefined") {
		if (type === "localStorage") {
			return test(localStorage)
		} else if (type === "sessionStorage") {
			return test(sessionStorage)
		}
	}

	return proxy()
}

/**
 * Stores a value in storage
 * @param {string} key   The key to store as
 * @param {mixed}  value The value to store
 */
StorageService.prototype.set = function (key, value) {
	this.driver.setItem(key, JSON.stringify(value))
}

/**
 * Retrieves a value from storage
 * @param  {string} key The key to fetch
 * @return {mixed}      The value associated with the key
 */
StorageService.prototype.get = function (key) {
	var data = this.driver.getItem(key)

	if (data === undefined || data === null) {
		return null
	}

	try {
		return JSON.parse(data)
	} catch (e) {
		return data
	}
}

/**
 * Retrieves a value from storage
 * @param  {string} key The key to fetch
 * @return {mixed}      The value associated with the key
 */
StorageService.prototype.getAllStoredItems = function () {
	try {
		return this.driver.getItems()
	} catch (e) {
		return this.driver
	}
}

/**
 * Checks if item exists
 * @param  {string} key The key to check
 * @return {boolean}
 */
StorageService.prototype.has = function (key) {
	return !!this.get(key)
}

/**
 * Removes a single key from storage
 * @param  {string} key The key to remove
 * @return {void}
 */
StorageService.prototype.remove = function (key) {
	this.driver.removeItem(key)
}

/**
 * Removes all items from storage that contain the key
 * @param  {string} key The key to search for
 * @return {void}
 */
StorageService.prototype.removeWhere = function (key) {
	for (var i in this.getAllStoredItems()) {
		if (i.includes(key)) {
			this.remove(i)
		}
	}
}

/**
 * Clears the entire storage
 * @return {void}
 */
StorageService.prototype.clear = function () {
	this.driver.clear()
}

export const StorageLocal = {
	key: "$localStorage",
	inject: [],
	fn: () => {
		return new StorageService("localStorage")
	},
}
export const StorageSession = {
	key: "$sessionStorage",
	inject: [],
	fn: () => {
		return new StorageService("sessionStorage")
	},
}
export const StorageProxy = {
	key: "$proxyStorage",
	inject: [],
	fn: () => {
		return new StorageService("proxyStorage")
	},
}
