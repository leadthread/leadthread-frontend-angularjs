export const inject = ["$rootScope", "$device"]

export const fn = ($rootScope, $device) => {
	$rootScope.windowWidth = $device.width
	$rootScope.$watch(
		function () {
			return $device.width
		},
		function (n) {
			$rootScope.windowWidth = n
		}
	)
}
