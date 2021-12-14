/* global PDFJS:false */
angular.module("lt.core").directive("pdfViewer", ["$rootScope", function ($rootScope) { 
	"use strict";

	return {
		restrict: "EA",
		templateUrl: "components/pdf-viewer/index.html",
		scope : {
			pdf : "="
		},
		link: function ($scope, $el) {
			var canvas;
			var context;

			function init () {
				canvas = $el.find("canvas")[0];
				context = canvas.getContext("2d");
				defineScope();
				defineListeners();
			}

			function defineScope () {
				$scope.width = $el.innerWidth();
				$scope.nextPage = nextPage;
				$scope.previousPage = previousPage;
				$scope.pageNumber = 1;
				$scope.pdfDoc = null;
				$scope.loading = true;
				getPdf();
			}

			function defineListeners () {
				$scope.$watch(function () {
					return $el.innerWidth();
				}, function (n, o) {
					if (n != o) {
						$scope.width = n;
						renderPdf($scope.pageNumber);
					}
				});

				$scope.$watch(function () {
					return $scope.pdf;
				}, function (n, o) {
					if (n != o) {
						getPdf();
					}
				});
			}

			function getPdf () {
				PDFJS.getDocument($scope.pdf).then(function (pdf) {
					$scope.pdfDoc = pdf;
					$scope.loading = false;
					$scope.error = false;
					$rootScope.$digest();
					renderPdf(1);
				}).catch(function () {
					$scope.loading = false;
					$scope.error = "Could not load the PDF";
					$rootScope.$digest();
				});
			}
			
			var renderPdf = function (pageNumber) {
				if ($scope.pdfDoc) {
					if (pageNumber === undefined || pageNumber === null) {
						pageNumber = 1;
					}
					$scope.pageNumber = pageNumber;
					context.clearRect(0, 0, canvas.width, canvas.height);

					$scope.pdfDoc.getPage(pageNumber).then(function (page) {
						$scope.page = page;

						var desiredWidth = $el.innerWidth();
						if (desiredWidth > 800) {
							desiredWidth = 800;
						}
						var viewport = page.getViewport(1);
						var scale = desiredWidth / viewport.width;
						var scaledViewport = page.getViewport(scale);
						
						canvas.height = scaledViewport.height;
						canvas.width = scaledViewport.width;

						var renderContext = {
							canvasContext: context,
							viewport: scaledViewport
						};


						page.render(renderContext);
					});
				}
			};

			function nextPage () {
				var target = ($scope.pageNumber + 1) % ($scope.pdfDoc.pdfInfo.numPages+1);
				if (target == 0) {
					target = 1;
				}
				if ($scope.pdfDoc) {
					renderPdf(target);
				}
			}

			function previousPage () {
				var target = ($scope.pageNumber - 1) % ($scope.pdfDoc.pdfInfo.numPages+1);
				if (target == 0) {
					target = $scope.pdfDoc.pdfInfo.numPages;
				}
				if ($scope.pdfDoc) {
					renderPdf(target);
				}
			}

			renderPdf = _.debounce(renderPdf, 1000);

			init();
		}
	};
}]);
