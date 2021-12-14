/* global angular:false, _:false */
export const key = "$messages"

export const inject = ["$rootScope", "$q", "$api", "$http", "$company"]

export const fn = ($rootScope, $q, $api, $http, $company) => {
	var contacts = null

	function init() {
		defineListeners()
	}

	function defineListeners() {
		$rootScope.$on("App\\Events\\SmsReceived", function (event, data) {
			$company.getId().then(function (companyId) {
				var message = data.message

				if (companyId === message.company_id) {
					var p = getContact(message.contact_id)
					p.then(function (contact) {
						contact.messages.push(message)
					})
					$rootScope.$apply()
				}
			})
		})
	}

	function loadContacts() {
		return $company.getId().then(function (companyId) {
			return $http
				.get("/api/v1/sms/conversations", {
					params: {
						company_id: companyId,
					},
				})
				.then(function (resp) {
					var newContacts = resp.data.data
					newContacts = _.differenceBy(newContacts, contacts, "id")
					newContacts = _.map(newContacts, onNewContact)
					contacts = _.isArray(contacts) ? contacts : []
					_.each(newContacts, function (contact) {
						contacts.push(contact)
					})
					return contacts
				})
		})
	}

	function loadMessages(contact_id) {
		return getContact(contact_id).then(function (contact) {
			return $api
				.show("contacts", contact.id)
				.index("messages")
				.exec()
				.then(function (response) {
					contact.messages = _.unionBy(
						contact.messages,
						response.data,
						"id"
					)
					return contact.messages
				})
		})
	}

	function getContacts() {
		return $q(function (resolve) {
			if (!contacts) {
				resolve(loadContacts())
			} else {
				resolve(contacts)
			}
		})
	}

	function getContact(contact_id) {
		return $q(function (resolve, reject) {
			var contact = _.find(contacts, function (c) {
				return c.id === contact_id
			})

			if (contact) {
				resolve(contact)
			} else {
				return $api
					.show("contacts", contact_id)
					.exec()
					.then(function (resp) {
						var contact = _.find(contacts, function (c) {
							return c.id === resp.data.id
						})
						if (!contact) {
							contact = resp.data
							contacts = _.isArray(contacts) ? contacts : []
							contacts.push(contact)
						}
						resolve(contact)
					}, reject)
			}
		}).then(onNewContact)
	}

	function onNewContact(contact) {
		if (!_.isArray(contact.messages)) {
			contact.messages = []
			loadMessages(contact.id)
		}
		return contact
	}

	function getTotalUnreadMessages(contact) {
		var unread = _.filter(contact.messages, function (message) {
			return !message.seen && message.inbound
		})
		return unread.length
	}

	function hasUnreadMessages(contact) {
		return getTotalUnreadMessages(contact) > 0
	}

	function hasAnyUnreadMessages() {
		return getTotalUnreadConversations() > 0
	}

	function getTotalUnreadConversations() {
		var j = 0
		for (var i = 0; i < (contacts ? contacts.length : 0); i++) {
			j += hasUnreadMessages(contacts[i]) ? 1 : 0
		}
		return j
	}

	function markMessagesAsRead(contact) {
		_.forEach(contact.messages, function (message) {
			if (!message.seen) {
				$http
					.put("/api/v1/messages/" + message.id + "/read")
					.then(function () {
						message.seen = true
					})
			}
		})
	}

	function clearContacts() {
		contacts = null
	}

	init()

	return {
		clearContacts: clearContacts,
		contacts: contacts,
		getContact: getContact,
		getContacts: getContacts,
		getTotalUnreadConversations: getTotalUnreadConversations,
		getTotalUnreadMessages: getTotalUnreadMessages,
		hasAnyUnreadMessages: _.throttle(hasAnyUnreadMessages, 1000),
		hasUnreadMessages: hasUnreadMessages,
		loadContacts: loadContacts,
		loadMessages: loadMessages,
		markMessagesAsRead: markMessagesAsRead,
	}
}
