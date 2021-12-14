angular.module("lt.core").factory("$job", ["$socket", "$rootScope", "$q", "$timeout", "$notification", function ($socket, $rootScope, $q, $timeout, $notification) {
	
	var jobs = [];

	var handle = function (job_id, name) {
		var deferred = $q.defer();
		name = name || "Job #"+job_id;
		$socket.subscribe("job."+job_id);
		jobs.push({id: job_id, name: name, data: [], warnings: [], status: "waiting", progress: 0, deferred: deferred});
		return deferred.promise;
	};

	var all = function () {
		return jobs;
	};

	var cleanup = function (job) {
		if (job.warnings.length > 0) {
			var x = _(job.warnings).take(5).join("\n");
			$notification.warn(job.warnings.length+" Warnings", x, 10000);
		}
		$timeout(function () {
			_.remove(jobs, {id: job.id});
		}, 3000);
	};

	$rootScope.$on("App\\Events\\Jobs\\Started", function (event, resp) {
		var job = _.find(jobs, {"id": resp.job_id});
		job.status = "started";
		job.progress = 0;
	});

	$rootScope.$on("App\\Events\\Jobs\\Updated", function (event, resp) {
		var job = _.find(jobs, {"id": resp.job_id});
		
		if (_.isArray(resp.data)) {
			if (!_.isArray(job.data)) {
				job.data = [];
			}
			job.data = job.data.concat(resp.data);
		} else {
			job.data = resp.data;
		}

		job.status = "working";
		job.progress = resp.part/resp.total;
	});

	$rootScope.$on("App\\Events\\Jobs\\Warning", function (event, resp) {
		var job = _.find(jobs, {"id": resp.job_id});

		_.forEach(resp.warnings, function (w) {
			if (!_.isArray(job.warnings)) {
				job.warnings = [];
			}
			job.warnings.push(w);
		});
	});

	$rootScope.$on("App\\Events\\Jobs\\Failed", function (event, resp) {
		var job = _.find(jobs, {"id": resp.job_id});
		job.status = "failed";
		job.progress = 1;
		$notification.error("Failed", resp.error, 10000);
		cleanup(job);
	});

	$rootScope.$on("App\\Events\\Jobs\\Succeeded", function (event, resp) {
		var job = _.find(jobs, {"id": resp.job_id});
		job.status = "succeeded";
		job.progress = 1;
		job.deferred.resolve(job.data);
		cleanup(job);
	});

	return {
		handle: handle,
		all: all,
	};
}]);