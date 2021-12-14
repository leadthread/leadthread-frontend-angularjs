(function (angular, _) {
	"use strict";
	
	angular.module("lt.core").directive("formFile", ["FileUploader", "$notification", function (FileUploader, $notification) { 
		return {
			restrict: "A",
			templateUrl: "components/form-file/index.html",
			scope : {
				model: "=formFile",
				type: "@",
				url: "@",
			},
			link: function ($scope, $el) {
				
				$scope.url = ($scope.url ? $scope.url : "/api/v1/files/upload");

				var uploader = new FileUploader({
					url: $scope.url,
					headers: {
						"X-Requested-With": "XMLHttpRequest", // For proper json errors from the backend
						"X-CSRF-TOKEN": window.$CSRF
					},
				});

				function init () {
					defineScope();
					defineListeners();
				}

				function defineScope () {
					$scope.progress = 0;
					$scope.uploader = uploader;
					$scope.clickUploader = clickUploader;
					$scope.cancelFile = cancelFile;
				}

				function defineListeners () {

					// FILTERS

					uploader.filters.push({
						name: "customFilter",
						fn: function () {
							return this.queue.length < 1;
						}
					});

					if ($scope.type === "image") {
						uploader.filters.push({
							name: "imageFilter",
							fn: function (item) {
								var type = "|" + item.type.slice(item.type.lastIndexOf("/") + 1) + "|";
								return "|jpg|png|jpeg|bmp|gif|".indexOf(type) !== -1;
							}
						});
					}

					// CALLBACKS

					uploader.onWhenAddingFileFailed = function (item, filter) {
						var msg = "Could not upload file";

						if (filter.name === "imageFilter") {
							msg = "Please upload an image!";
						}

						$notification.error(msg);
					};
					uploader.onAfterAddingFile = function () {
						// 
					};
					uploader.onAfterAddingAll = function () {
						// 
					};
					uploader.onBeforeUploadItem = function () {
						// 
					};
					uploader.onProgressItem = function () {
						// 
					};
					uploader.onProgressAll = function (progress) {
						$scope.progress = progress;
					};
					uploader.onSuccessItem = function (fileItem, response) {
						// 
						$scope.model = response.data;
					};
					uploader.onErrorItem = function (fileItem, response) {
						$notification.error(_.get(response, "error.message", "An error occurred!"));
					};
					uploader.onCancelItem = function () {
						// 
					};
					uploader.onCompleteItem = function (fileItem) {
						// 
						fileItem.remove();
					};
					uploader.onCompleteAll = function () {
						// 
						$scope.progress = 0;
					};

					$scope.$watch(function () {
						return uploader.queue.length;
					}, function () {
						_(uploader.queue).each(function (item) {
							item.upload();
						});
					});
				}

				function clickUploader () {
					var el = $el[0].querySelector(".hidden-input");
					el.click();
				}

				function cancelFile () {
					$scope.model = null;
				}

				init();
			}
		};
	}]);
})(window.angular, window._);