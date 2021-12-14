import _ from "lodash"

export const key = "categoriesDirective"

export const inject = ["$api", "$q", "Prompt"]

export const fn = ($api, $q, Prompt) => {
	return {
		restrict: "E",
		templateUrl: "components/accordion/categories/index.html",
		scope: {
			step: "=",
			cat: "=",
			option: "=",
			prompt: "=",
		},
		link: function ($scope) {
			function init() {
				defineScope()
				defineListeners()
			}

			function defineScope() {
				$scope.back = back
				$scope.cat = $scope.cat ? $scope.cat : null
				$scope.choose = choose
				$scope.select = select

				$scope.options = {
					// Auto Industry
					auto: [
						{
							prompt: "Who has a car that is frequently in the shop getting repaired?",
							ready: false,
							img: 11,
							fingerprint:
								"e646ac36fa3b7a66d524be400a965decfe1a2bea1c8093ec60fb1786e8e1b489",
						},
						{
							prompt: "Do you know anybody that is expecting a child or will soon need a larger car?",
							ready: false,
							img: 1,
							fingerprint:
								"3bd2f8589d14c162f2ae9c83a6f04923597cb4839ab3b840d28b17ba9ada1ec0",
						},
						{
							prompt: "Who do you know, that would really benefit from having their smartphone connected car?",
							ready: false,
							img: 6,
							fingerprint:
								"19f1f327b1670b731fb44fb6d39db33cbd9891ad018d305d07e7c7eae530e7cc",
						},
						{
							prompt: "Who do you know that is very mindful about the environment and would be interested in one of our Hybrid or Electric cars?",
							ready: false,
							img: 7,
							fingerprint:
								"5adcaffee462846738da34c0ca3c6f389b13dc8d41b059cfb1309372f46f9118",
						},
						{
							prompt: "Who do you know, that could benefit from more horse power, for towing their toys?",
							ready: false,
							img: 8,
							fingerprint:
								"e73690ccfbabddf1cd19efbfd32337f6c3d572adca61d670f1976d08751c5fc7",
						},
					],
					// Mortgage
					home: [
						{
							prompt: "Do you know any recent college graduates, who have entered the workforce and are looking for that first home?",
							ready: false,
							img: 2,
							fingerprint:
								"37dfcdb726504dc9ffa47ed06a769db5eaa5bfeada9cf9a7770d4620b074fa7d",
						},
						{
							prompt: "Do you know any pet lovers, that would like to get their own home and backyard for their family pets?",
							ready: false,
							img: 3,
							fingerprint:
								"b2ab03e3b6cdf0f73300bef59421acf682ead486b772d83b734f7b73e6954cdb",
						},
						{
							prompt: "Do you know anybody, who is weighing options of “adding-on” to current home vs. buying a new home?",
							ready: false,
							img: 9,
							fingerprint:
								"476ccf201f2f84cfd3dc5f83379fedc73c87832a9825f5ca93e30cdd300cdb9b",
						},
						{
							prompt: "Who do you know, that is currently renting a home or apartment and looking to get into a house?",
							ready: false,
							img: 10,
							fingerprint:
								"04e9e53635f1f24a691b5f10084c7e6eac6e38449ff6dc2c4472b0a5959dc19c",
						},
					],
					// Solar
					solar: [
						{
							prompt: "Who do you know, that has already shown an interest in environmentally friendly purchases like - electric or hybrid cars?",
							ready: false,
							img: 4,
							fingerprint:
								"80a5384b1f14154c08f58984b6126986e3ef789be23a07f312461b2f70c3a265",
						},
						{
							prompt: "Do you know anybody who has an “off-grid” home or cabin?",
							ready: false,
							img: 5,
							fingerprint:
								"1c1027ec5caa246a55c373ba12c3006a5f1f9e345f9759eda3fda825b74fab86",
						},
						{
							prompt: "Who do you know, that is always looking for clever ways to save money?",
							ready: false,
							img: 11,
							fingerprint:
								"4f236879d81c8c3af1b74c5f8403099abb9c26bb2553be080e7e38de85333bed",
						},
						{
							prompt: "Do you know any “hobbyist” types who are often involved with new technologies?",
							ready: false,
							fingerprint:
								"45f45758247f0783ae53531da6a3e9e149e75178b7007db389bff410cd6504c7",
							img: 2,
						},
					],
				}

				_.forEach($scope.options, function (opts) {
					_.forEach(opts, function (opt) {
						opt = getImg(opt)
					})
				})
				choose($scope.cat)
			}

			function getImg(opt) {
				var arr = []
				arr.push(
					$q(function (resolve) {
						$api.index("files", {
							fingerprint: opt.fingerprint,
						})
							.exec()
							.then(function (newOpt) {
								newOpt = newOpt.data[0]
								opt.img = newOpt.id
								opt.ready = true
								resolve(opt)
							})
					})
				)

				$q.all(arr).then(function (res) {
					return res[0]
				})
			}

			function defineListeners() {}

			function back() {
				$scope.cat = null
				$scope.option.chosen = []
				$scope.step = 0
			}

			function choose(cat) {
				if (cat !== undefined) {
					$scope.cat = cat
					$scope.option.chosen = $scope.options[cat]
				}
			}

			function select(opt) {
				//get image url or cue.imgs
				// $scope.$emit("addCue", {
				// 	prompt:opt.prompt,
				// 	file_id:opt.img,
				// 	imgs:"/files/"+opt.fingerprint+"/thumb/480"
				// });
				var res = opt
				if (!(opt instanceof Prompt)) {
					res = new Prompt(
						opt.prompt,
						opt.img,
						"/files/" + opt.fingerprint + "/thumb/480"
					)
				}
				$scope.prompt = res
				$scope.cat = null
				$scope.option.chosen = []
				$scope.step = 0
			}

			init()
		},
	}
}
