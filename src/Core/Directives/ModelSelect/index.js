import _ from "lodash"

export const key = "modelSelect"

export const inject = ["$api", "$q", "$window"]

export const fn = ($api, $q, $window) => {
	return {
		restrict: "A",
		template: require("./index.html"),
		scope: {
			path: "@",
			models: "=",
			selected: "=",
			options: "=",
			displayColumn: "@",
		},
		link: function ($scope) {
			var defaults = {
				mode: "select",
				actions: {
					back: {
						enabled: false,
						doBack: doBack,
						onBack: onBack,
						backFn: backFn,
					},
					next: {
						enabled: false,
						doNext: doNext,
						onNext: onNext,
						nextFn: nextFn,
					},
					select: {
						enabled: true,
						doSelect: doSelect,
						onSelect: onSelect,
						selectFn: selectFn,
					},
					new: {
						enabled: true,
						doNew: doNew,
						onNew: onNew,
						newFn: newFn,
					},
					save: {
						enabled: true,
						doSave: doSave,
						onSave: onSave,
						saveFn: saveFn,
					},
					delete: {
						enabled: true,
						doDelete: doDelete,
						onDelete: onDelete,
						deleteFn: deleteFn,
					},
				},
			}

			function init() {
				defineScope()
				defineListeners()
			}

			function defineListeners() {}

			function defineScope() {
				//Set some options
				$scope.options = _.merge(defaults, $scope.options)
				$scope.displayColumn = $scope.displayColumn
					? $scope.displayColumn
					: "id"

				//Select a model
				$scope.selected = _.isObject($scope.selected)
					? $scope.selected
					: selectFirst()

				//Scope Functions
				$scope.backFn = $scope.options.actions.back.backFn
				$scope.nextFn = $scope.options.actions.next.nextFn
				$scope.selectFn = $scope.options.actions.select.selectFn
				$scope.saveFn = $scope.options.actions.save.saveFn
				$scope.deleteFn = $scope.options.actions.delete.deleteFn
				$scope.newFn = $scope.options.actions.new.newFn
			}

			function selectFirst() {
				$scope.selected = _.first($scope.models)
				return $scope.selected
			}

			/*======================================================
				=            Internal model action function            =
				======================================================*/

			function backFn() {
				$window.history.back()
			}
			function nextFn() {
				// Nothing yet...
			}
			function selectFn(obj) {
				return $q(function (resolve) {
					$scope.options.actions.select
						.doSelect(obj)
						.then(function (obj) {
							resolve(obj)
							$scope.options.actions.select.onSelect(obj)
						})
				})
			}
			function newFn() {
				return $q(function (resolve) {
					$scope.options.actions.new.doNew().then(function (obj) {
						saveFn(obj).then(function (resp) {
							var obj = resp
							$scope.models.unshift(obj)
							selectFirst()
							resolve(obj)
							$scope.options.actions.new.onNew(obj)
						})
					})
				})
			}
			function saveFn(obj) {
				return $scope.options.actions.save
					.doSave(obj)
					.then($scope.options.actions.save.onSave, onError)
			}
			function deleteFn(id) {
				return $scope.options.actions.delete
					.doDelete(id)
					.then(function () {
						_.remove($scope.models, {
							id: id,
						})
					})
					.then($scope.options.actions.delete.onDelete, onError)
			}

			/*=====  End of Internal model action function  ======*/

			/*===========================================================
				=            Overwritable model action functions            =
				===========================================================*/

			function doNext() {}
			function doBack() {}
			function doSelect(obj) {
				return $q(function (resolve) {
					$scope.selected = obj
					resolve(obj)
				})
			}
			function doNew() {
				return $q(function (resolve) {
					resolve({})
				})
			}
			function doSave(obj) {
				return $api
					.update($scope.path, obj)
					.exec()
					.then(function (x) {
						return x.data
					})
			}
			function doDelete(id) {
				return $api
					.destroy($scope.path, id)
					.exec()
					.then(function (x) {
						return x.data
					})
			}

			/*=====  End of Overwritable model action functions  ======*/

			/*=======================================
				=            Event functions            =
				=======================================*/

			function onBack() {}
			function onNext() {}
			function onSelect(arg1) {
				return arg1
			}
			function onNew(arg1) {
				return arg1
			}
			function onSave(arg1) {
				return arg1
			}
			function onDelete(arg1) {
				return arg1
			}
			function onError(arg1) {
				return arg1
			}

			/*=====  End of Event functions  ======*/

			init()
		},
	}
}
