import _ from "lodash"
import { PersonClass as Person } from "../../Classes"

export const key = "contactManager"

export const inject = [
	"$api",
	"$cache",
	"$q",
	"$company",
	"$http",
	"$popup",
	"$notification",
	"FileUploader",
	"$stateParams",
	"$location",
	"$state",
	"$timeout",
	"$device",
	"$job",
	"ContactService",
]

export const fn = (
	$api,
	$cache,
	$q,
	$company,
	$http,
	$popup,
	$notification,
	FileUploader,
	$stateParams,
	$location,
	$state,
	$timeout,
	$device,
	$job,
	ContactService
) => {
	return {
		restrict: "E",
		template: require("./index.html"),
		scope: {
			userId: "=",
			selectedContacts: "=",
			perPage: "@?",
			simple: "=?",
		},
		link: function ($scope, $el) {
			var contactsAll = null
			var uploader = new FileUploader({
				url: "/api/v1/contacts/upload",
				headers: {
					"X-Requested-With": "XMLHttpRequest", // For proper json errors from the backend
					"X-CSRF-TOKEN": window.$CSRF,
				},
			})

			//constants
			var ALL_LIST = {
				id: 0,
				name: "All",
				company_id: null,
				user_id: null,
			}

			function init() {
				$company.getId().then(function (companyId) {
					$scope.companyId = companyId
					defineScope()
					defineListeners()
					defineUploaderListeners()
				})
			}

			function defineScope() {
				$scope.loading = {
					contacts: true,
					lists: true,
				}
				$scope.activeList = null
				$scope.lists = []
				$scope.contacts = []
				$scope.uploader = uploader
				$scope.csvErrors = []
				$scope.maxCsvErrors = 5
				$scope.progress = 0
				$scope.isMobile = $device.isMobile()
				$scope.simple = !!$scope.simple

				// Pagination
				$scope.pagination = {
					lists: {
						perPage: _.defaultTo($scope.perPage, 8),
						maxSize: 7,
					},
					contacts: {
						perPage: $scope.isMobile
							? 10
							: _.defaultTo($scope.perPage, 8),
						maxSize: $scope.isMobile ? 5 : 9,
					},
				}

				// Functions
				$scope.listNew = listNew
				$scope.listEdit = listEdit
				$scope.listRemove = listRemove
				$scope.listView = listView
				$scope.contactNew = contactNew
				$scope.contactEdit = contactEdit
				$scope.contactRemove = contactRemove
				$scope.listAddSelectedContacts = listAddSelectedContacts
				$scope.listRemoveSelectedContacts = listRemoveSelectedContacts
				$scope.contactsGetSelected = contactsGetSelected
				$scope.csvUploadToList = csvUploadToList
				$scope.csvOpenHelpDialog = csvOpenHelpDialog
				$scope.clickOnCSVFileInput = clickOnCSVFileInput
				$scope.contactSelectToggle = contactSelectToggle
				$scope.listSelectToggle = listSelectToggle
				$scope.contactsGetSelectedForActiveList =
					contactsGetSelectedForActiveList
				$scope.listAddContactsFromAllPopup = listAddContactsFromAllPopup
				$scope.contactMoreInfo = contactMoreInfo
			}

			function defineListeners() {
				$scope.$watch("userId", loadLists)

				$scope.$watch(
					function () {
						return contactsGetSelected().length
					},
					function () {
						$scope.selectedContacts = contactsGetSelected()

						// Select lists
						_.forEach($scope.lists, function (list) {
							listLoadContacts(list.id).then(function (contacts) {
								list.selected = false
								if (
									$scope.selectedContacts.length >=
									contacts.length
								) {
									var c = _.intersectionWith(
										contacts,
										$scope.selectedContacts,
										function (contact, selected) {
											return contact.id === selected.id
										}
									)
									list.selected =
										c.length === contacts.length &&
										contacts.length > 0
								}
							})
						})
					}
				)
			}

			function convertResponseToArray(resp) {
				return _.isArray(resp) ? resp : [resp]
			}

			/*================================
				=            CONTACTS            =
				================================*/

			function contactsDeselect(contacts) {
				_.forEach(contacts, contactDeselect)
				return contacts
			}

			function contactsSelect(contacts) {
				_.forEach(contacts, contactSelect)
				return contacts
			}

			function contactMoreInfo(event, contact) {
				event.stopPropagation()
				$state.go("root.company.contact", {
					companyId: $scope.companyId,
					contactId: contact.id,
				})
			}

			function contactSelectToggle(contact) {
				contact.selected = !contact.selected
				return contact
			}

			function contactDeselect(contact) {
				contact.selected = false
				return contact
			}

			function contactSelect(contact) {
				contact.selected = true
				return contact
			}

			function contactsGetSelected() {
				return _.filter(contactsAll, function (c) {
					return c.selected
				})
			}

			function getContactsCacheKey(listId) {
				return [
					"contacts",
					$scope.companyId,
					$scope.userId,
					listId,
				].join("|")
			}

			function clearContactsCacheForAllLists() {
				$scope.lists.forEach(function (list) {
					clearContactsCacheForList(list.id)
				})
			}

			function clearContactsCacheForList(listId) {
				$cache.forget(getContactsCacheKey(listId))
			}

			function contactsMerge(resp) {
				contactsAll = _.unionBy(
					contactsAll,
					contactsConvertToPersonPrototypes(resp),
					"id"
				)
				return contactsAll
			}

			function contactsConvertToPersonPrototypes(contacts) {
				return _.map(contacts, function (c) {
					return new Person(c)
				})
			}

			function contactsGetAll() {
				var contacts = contactsAll
				if (!contactsAll) {
					contacts = contactsLoadAll()
				}
				return $q.when(contacts).then(contactsMerge)
			}

			function contactsLoadAll() {
				return $cache.remember(getContactsCacheKey(0), 5, function () {
					if ($scope.userId) {
						return ContactService.indexFor("users", $scope.userId)
					} else {
						return ContactService.index()
					}
				})
			}

			function contactRemove(event, contact) {
				event.stopPropagation()
				if (confirm("Are you sure you want to delete this contact?")) {
					return ContactService.destroyFor(
						"users",
						$scope.userId,
						contact.id
					).then(function () {
						_.remove($scope.contacts, { id: contact.id })
						clearContactsCacheForAllLists() //Clear this list
					})
				}
			}

			function contactEdit(event, listId, contact) {
				event.stopPropagation()
				return contactForm(listId, contact)
					.then(convertResponseToArray)
					.then(contactsMerge)
			}

			function contactNew(event, listId) {
				let contact_id = null
				return contactForm(listId).then(function (contact) {
					contact_id = contact.id
					return $q
						.when(contact)
						.then(convertResponseToArray)
						.then(function (contacts) {
							if (listId > 0) {
								listAddContacts(contacts, listId)
							} else {
								clearContactsCacheForList(0)
								listLoad(listId)
							}
							return contacts
						})
						.then(contactsMerge)
						.then(function (contacts) {
							var x = _.find(contacts, { id: contact_id })
							contactSelect(x)
							return contacts
						})
				})
			}

			function contactForm(listId, contact = null) {
				var form = [
					{
						type: "input",
						subtype: "tel",
						label: "Mobile Number",
						key: "phone",
						value: _.get(contact, "phone"),
						required: true,
					},
					{
						type: "input",
						subtype: "text",
						label: "First Name",
						key: "first_name",
						value: _.get(contact, "first_name"),
						required: true,
					},
					{
						type: "input",
						subtype: "text",
						label: "Last Name",
						key: "last_name",
						value: _.get(contact, "last_name"),
						required: true,
					},
					{
						type: "input",
						subtype: "email",
						label: "Email (Optional)",
						key: "email",
						value: _.get(contact, "email"),
						required: false,
					},
					{
						type: "input",
						subtype: "text",
						label: "Company (Optional)",
						key: "company",
						value: _.get(contact, "company"),
						required: false,
					},
				]

				var formPromise = $popup.form(
					form,
					contact ? "Edit Contact" : "New Contact",
					false
				)

				return formPromise.then(function (y) {
					// Prepare
					let x = contact || y

					for (var key in y) {
						x[key] = y[key]
					}

					x.user_id = $scope.userId

					// Save
					return ContactService.save(
						ContactService.create(x).valueOf()
					)
				})
			}

			/*=====  End of CONTACTS  ======*/

			/*=====================================
				=            CONTACT LISTS            =
				=====================================*/

			function listSelectToggle(list) {
				if (list.selected) {
					listDeselect(list)
				} else {
					listSelect(list)
				}
			}

			function listDeselect(list) {
				listLoadContacts(list.id).then(contactsDeselect)
			}

			function listSelect(list) {
				listLoadContacts(list.id).then(contactsSelect)
			}

			function loadLists() {
				if (!$scope.userId) {
					return $q.reject("userId must be set")
				} else {
					$scope.loading.lists = true
					var promise = $cache.remember(
						getListsCacheKey(),
						5,
						function () {
							return $api
								.index("contact-lists", {
									company_id: $scope.companyId,
									user_id: $scope.userId,
								})
								.exec()
								.then((x) => {
									return x.data
								})
						}
					)

					return promise.then(assignLists).then(function (lists) {
						listViewFirst()
						$scope.loading.lists = false
						return lists
					})
				}
			}

			function listsGetSelected() {
				return _.filter($scope.lists, function (c) {
					return c.selected
				})
			}

			function contactsGetSelectedForActiveList() {
				return _.filter($scope.contacts, { selected: true })
			}

			function listLoadContacts(listId) {
				if (!_.isInteger(listId)) {
					return $q.reject("List id is required")
				} else {
					return getListByIdOrCreate(listId).then((list) => {
						var x = contactsGetAll().then((contacts) => {
							if (list.id === 0) {
								return contacts
							} else {
								return $cache
									.remember(
										getContactsCacheKey(list.id),
										5,
										() => {
											return $http
												.get(
													"/api/v1/contact-lists/" +
														list.id +
														"/contact_ids?user_id=" +
														$scope.userId
												)
												.then((x) => {
													return x.data.data
												})
										}
									)
									.then(function (ids) {
										return _.intersectionWith(
											contacts,
											ids,
											function (contact, id) {
												return contact.id === id
											}
										)
									})
							}
						})
						return x.then((contacts) => {
							list.count = contacts.length
							return contacts
						})
					})
				}
			}

			function listLoad(listId) {
				$scope.loading.contacts = true
				return listLoadContacts(listId).then(function (contacts) {
					if ($scope.activeList.id === listId) {
						$scope.contacts = contacts
						$scope.loading.contacts = false
					}
				})
			}

			function listRemoveSelectedContacts(listId) {
				if (listId > 0) {
					var contacts = _.filter($scope.contacts, {
						selected: true,
					})
					var contactIds = _.map(contacts, "id")
					var promise = $http
						.post("api/v1/contact-lists/" + listId + "/detach", {
							contact_ids: contactIds,
							user_id: $scope.userId,
						})
						.then(function () {
							if (listId === $scope.activeList.id) {
								_.forEach(contactIds, function (id) {
									_.remove($scope.contacts, { id: id })
								})
							}

							clearContactsCacheForList(listId) //Clear this list
							clearContactsCacheForList(0) //Clear the 'all' list
							contactsDeselect(contactsAll)
							$notification.success()
						})

					return promise
				} else {
					return $q.reject("List id must be greater than 0")
				}
			}

			function listAddContacts(contacts, listId) {
				return getListByIdOrCreate(listId).then(function (list) {
					if (list.id > 0) {
						var contactIds = _.map(contacts, "id")
						return $http
							.post(
								"api/v1/contact-lists/" + list.id + "/attach",
								{
									contact_ids: contactIds,
									user_id: $scope.userId,
								}
							)
							.then(function () {
								listClearCache(list)
								contactsDeselect(contacts)
								$notification.success()
								return contacts
							})
					} else {
						return $q.reject("List id must be greater than 0")
					}
				})
			}

			function listAddSelectedContacts(listId) {
				return listAddContacts(contactsGetSelected(), listId)
			}

			function assignLists(resp) {
				$scope.lists = resp
				if (!_.find($scope.lists, { id: 0 })) {
					$scope.lists.unshift(ALL_LIST)
				}
				return resp
			}

			function getListsCacheKey() {
				return ["contact-lists", $scope.companyId, $scope.userId].join(
					"|"
				)
			}

			function getListByIdOrCreate(listId) {
				var list = _.find($scope.lists, { id: listId })

				if (!list) {
					list = listNew()
				}

				return $q.when(list)
			}

			function listViewFirst() {
				return listView(_.first($scope.lists))
			}

			function listView(list) {
				if (_.isObject(list)) {
					$scope.activeList = list
					$scope.qContacts = ""
					if (_.isInteger(list.id)) {
						listLoad(list.id)
					}
				}
				return list
			}

			function listClearCache(list) {
				clearContactsCacheForList(list.id) //Clear this list
				clearContactsCacheForList(0) //Clear the 'all' list
			}

			function listNew() {
				return openContactListForm()
					.then(listSave, console.warn)
					.then(listView)
			}

			function listEdit(model) {
				return openContactListForm(model).then(listSave, console.warn)
			}

			function listRemove(model) {
				var yes = confirm(
					"Are you sure that you want to remove this list? (Contacts will not be deleted)"
				)
				if (yes) {
					return $api
						.destroy("contact-lists", model.id)
						.exec()
						.then(function () {
							removeContactListFromScope(model)
							listViewFirst()
						})
				} else {
					return $q.when(true)
				}
			}

			function listSave(model) {
				model = _.cloneDeep(model)
				delete model.count
				delete model.selected
				model.company_id = $scope.companyId
				model.user_id = $scope.userId
				return $api
					.update("contact-lists", model)
					.exec()
					.then((x) => {
						return x.data
					})
					.then(addContactListToScope)
			}

			function listAddContactsFromAllPopup(listId) {
				return contactsGetAll().then(function (contacts) {
					return $popup
						.contacts(contacts)
						.then(function (selected) {
							return listAddContacts(selected, listId).then(
								function () {
									return selected
								}
							)
						})
						.then((contacts) => {
							contactsMerge(contacts)
							clearContactsCacheForList(listId)
							return listLoad(listId).then(function () {
								return contacts
							})
						})
				})
			}

			function removeContactListFromScope(list) {
				_.remove($scope.lists, function (l) {
					return l.id === list.id
				})
				return list
			}

			function addContactListToScope(list) {
				$scope.lists = _.unionBy($scope.lists, [list], "id")
				return list
			}

			function openContactListForm(model = {}) {
				return $q(function (resolve, reject) {
					var form = [
						{
							type: "input",
							subtype: "text",
							label: "Name",
							key: "name",
							value: null,
							required: true,
						},
					]

					_.forEach(form, function (field) {
						field.value = _.get(model, field.key, null)
					})

					$popup
						.form(form, "Contact List", false)
						.then(function (resp) {
							resolve(_.merge(model, resp))
						}, reject)
				})
			}

			/*=====  End of CONTACT LISTS  ======*/

			/*==================================
				=            CSV UPLOAD            =
				==================================*/

			function csvOpenHelpDialog() {
				$popup.info(
					"How to Upload a CSV File",
					"CSV files require at the very minimum a name and a phone number for each row. You can include extra information such as an email and/or organization name as optional columns. Any column header not present in the following list will be ignored.\n\nREQUIRED\n- \"Name\", \"Full Name\" or \"First Name\" with \"Last Name\".\n- \"Phone\", \"Mobile\" or \"Cell\".\n\nOPTIONAL:\n- \"Email\"\n- \"Company\" or \"Organization\"\n\n(555) 555-5555(666) 666-6666(777) 777-7777</td><td>mscott@hotmail.com</td><td>Dunder Mifflin</td></tr></table>\nIf a duplicate contact is found, the system will not create a duplicate entry but instead it will update the existing contact with the new information provided in the list."
				)
			}

			function csvUploadToList(listId) {
				return getListByIdOrCreate(listId).then(function (list) {
					if (list) {
						uploader.onBeforeUploadItem = function (item) {
							item.formData.push({
								user_id: $scope.userId,
								company_id: $scope.companyId,
								list_id: list.id,
							})
						}
						uploader.onSuccessItem = function (fileItem, response) {
							// Build a job name from the file name
							var name = ["Contacts Import"]
							var fileName = _.get(fileItem, "file.name", null)
							if (fileName) {
								name.push(fileName)
							}

							// Display the job process and wait for the end result
							$job.handle(
								response.data.job_id,
								name.join(" | ")
							).then(function (data) {
								var contacts = data,
									errors = [],
									x = true

								// Handle Success
								contactsMerge(contacts)
								listClearCache(list)

								// Handle Errors
								$scope.csvErrors = errors
								$timeout(function () {
									$scope.csvErrors = []
								}, 10000)

								return $q.when(x).then(function () {
									listView(list)
									if (contacts.length > 0) {
										$notification.success(
											contacts.length +
												" contacts successfully added."
										)
									}
									if (errors.length > 0) {
										$notification.error(
											errors.length +
												" contacts with errors."
										)
									}
									return contacts
								})
							})
						}
						clickOnCSVFileInput()
					}
				})
			}

			function clickOnCSVFileInput() {
				$el.find("#csvfile").click()
			}

			function defineUploaderListeners() {
				// FILTERS
				uploader.filters.push({
					name: "customFilter",
					fn: function () {
						return this.queue.length <= 5
					},
				})

				// CALLBACKS
				uploader.onWhenAddingFileFailed = function () {
					var msg = "Could not upload file"
					$notification.error(msg)
				}
				uploader.onBeforeUploadItem = function (item) {
					item.formData.push({
						user_id: $scope.userId,
						company_id: $scope.companyId,
					})
				}
				uploader.onProgressAll = function (progress) {
					$scope.progress = progress
				}
				uploader.onSuccessItem = function (fileItem, response) {
					$notification.error("An error occurred!") // Throw an error because this function is supposed to be overwritten
				}
				uploader.onErrorItem = function (fileItem, response) {
					$notification.error(
						_.get(response, "error.message", "An error occurred!")
					)
				}
				uploader.onCompleteItem = function (fileItem) {
					fileItem.remove()
				}
				uploader.onCompleteAll = function () {
					$scope.progress = 0
					uploader.clearQueue()
				}

				$scope.$watch(
					function () {
						return uploader.queue.length
					},
					function () {
						_(uploader.queue).each(function (item) {
							item.upload()
						})
					}
				)
			}

			/*=====  End of CSV UPLOAD  ======*/

			init()
		},
	}
}
