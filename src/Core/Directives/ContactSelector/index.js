import _ from "lodash"

export const key = "contactSelector"

export const inject = ["Person", "$q", "$popup", "$notification", "Tel"]

export const fn = (Person, $q, $popup, $notification, Tel) => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			contacts: "=contactSelector",
			collectCompany: "=",
			onNewContact: "=",
			type: "@",
		},
		link: function ($scope) {
			function init() {
				if (!_.isArray($scope.contacts)) {
					$scope.contacts = []
				}
				$scope.form = {
					person: null,
				}
				$scope.submit = submit

				if (
					$scope.type === "Contact" &&
					_.isFunction($scope.onNewContact)
				) {
					submit()
				}
			}

			function tryAgain() {
				$popup
					.decide("Do you want to add another " + $scope.type + "?")
					.then(submit)
			}

			// function inList (p) {
			// 	return !!_.find($scope.contacts, function (c) {
			// 		return c.phone instanceof Tel && p.phone instanceof Tel && c.phone.filter() === p.phone.filter();
			// 	});
			// }

			function submit() {
				if (
					(_.isString($scope.form.person) &&
						$scope.form.person.length > 0) ||
					$scope.form.person == null
				) {
					var p = new Person(null, null, null, $scope.form.person)

					getPersonFromPopup(p).then(function (resp) {
						if (_.isObject(resp) && resp.contacts) {
							resp = resp.contacts
						}

						if (!_.isArray(resp)) {
							resp = [resp]
						}

						_.forEach(resp, function (data) {
							if (
								_.isString(data.phone) &&
								data.phone.length > 0
							) {
								var p = new Person(
									null,
									null,
									null,
									$scope.form.person
								)
								p.first_name = data.first_name
								p.last_name = data.last_name
								p.email = data.email
								p.company = data.company
								p.phone = new Tel(data.phone)

								var promise
								if (_.isFunction($scope.onNewContact)) {
									promise = $scope.onNewContact(p)
								} else {
									promise = p
								}

								p.ready = false

								$scope.contacts.push(p)

								$q.when(promise).then(function () {
									p.ready = true
								})
							}
						})

						if ($scope.type !== "Customer") {
							tryAgain()
						}
					})
				} else {
					throw "Not implemented! I can only handle strings for now :-/"
				}

				$scope.form.person = null
			}

			function getPersonFromPopup(contact) {
				if (
					_.isString(contact.first_name) &&
					contact.first_name !== "" &&
					_.isString(contact.last_name) &&
					contact.last_name !== ""
				) {
					return $q.when({
						first_name: contact.first_name,
						last_name: contact.last_name,
					})
				} else {
					if ($scope.type === "Customer") {
						return $popup.contact(
							"contacts",
							null,
							"Select a Customer",
							null
						)
					} else {
						return $popup.form(
							getForm(contact),
							"Please add your " + $scope.type,
							$scope.type == "Contact"
						)
					}
				}
			}

			function getForm(contact) {
				var form = [
					{
						type: "input",
						subtype: "tel",
						label: "Mobile Number",
						key: "phone",
						value: contact.phone,
						required: true,
					},
					{
						type: "input",
						subtype: "text",
						label: "First Name",
						key: "first_name",
						value: contact.first_name,
						required: true,
					},
					{
						type: "input",
						subtype: "text",
						label: "Last Name",
						key: "last_name",
						value: contact.last_name,
						required: true,
					},
					{
						type: "input",
						subtype: "email",
						label: "Email (Optional)",
						key: "email",
						value: contact.email,
						required: false,
					},
				]

				if ($scope.collectCompany) {
					form.push({
						type: "input",
						subtype: "text",
						label: "Company (Optional)",
						key: "company",
						value: contact.company,
						required: false,
					})
				}

				return form
			}

			init()
		},
	}
}
