import angular from "angular"

export const inject = ["$provide"]

export const fn = ($provide) => {
	$provide.decorator("$q", [
		"$delegate",
		function ($delegate) {
			//Helper method copied from q.js.
			var isPromiseLike = function (obj) {
				return obj && angular.isFunction(obj.then)
			}

			function any(tasks) {
				return $delegate(function (resolve, reject) {
					var failed = []

					angular.forEach(tasks, function (promise) {
						if (!isPromiseLike(promise)) {
							throw "Was expecting every item in the array to be a promise!"
						}
						promise.then(resolve, function () {
							failed.push(promise)
							if (tasks.length === failed.length) {
								reject(failed)
							}
						})
					})
				})
			}

			$delegate.any = any
			return $delegate
		},
	])
}
