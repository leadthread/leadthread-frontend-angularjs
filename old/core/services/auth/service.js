(function (angular, _) {
	"use strict";
	
	var AuthService = function ($http, $localStorage, $sessionStorage, $api, $state, $q, $rootScope, $stateParams, AUTH_EVENTS, $notification, RoleService) {
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$http = $http;
		this.$localStorage = $localStorage;
		this.$sessionStorage = $sessionStorage;
		this.$api = $api;
		this.AUTH_EVENTS = AUTH_EVENTS;
		this.RoleService = RoleService;
		this.$rootScope = $rootScope;
		this.$q = $q;
		this.$notification = $notification;
		this.RoleService = RoleService;
	};

	AuthService.prototype.assignUser = function (data) {
		this.setUser(data);
		return {user: data};
	};

	AuthService.prototype.assignCompanies = function (data) {
		// return this.$api.index("companies").exec().then(_.bind(function (resp) {
		// 	data.companies = resp.data;

		// 	// Filter out disabled companies
		// 	data.activeCompanies = _.filter(data.companies, function (o) {
		// 		return o.status != "disabled";
		// 	});

		// 	// Check if there are any non-disabled companies
		// 	if (data.activeCompanies.length == 0) {
		// 		return this.$q.reject("Your account has been disabled");
		// 	} else {
				return data;
		// 	}
		// }, this));
	};

	AuthService.prototype.assignRoles = function (data) {
		var promises = [];
		var myRoles = [];

		_.forEach(data.activeCompanies, _.bind(function (company) {
			promises.push(this.$api.show("users", data.user.id).index("roles", {
				"company_id":company.id
			}).exec().then(function (roles) {
				var role = _.first(roles.data);
				if (role) {
					myRoles.push({ 
						"role":role.name, 
						"company":company.id 
					});
				}
			}));
		}, this));

		return this.$q.all(promises).then(_.bind(function () {
			this.$localStorage.set("role", myRoles);
			data.roles = myRoles;
			return data;
		}, this));
	};

	AuthService.prototype.assignState = function (data) {
		var stateName = this.$localStorage.get("state-login-target-name");
		var stateParams = this.$localStorage.get("state-login-target-params") || {};

		if (!stateName) {
			this.goHome();
		}

		this.$localStorage.remove("state-login-target-name");
		this.$localStorage.remove("state-login-target-params");

		this.$state.go(stateName, stateParams);

		return data;
	};

	AuthService.prototype.handleLoginRejection = function (reason) {
		if (_.isString(reason)) {
			this.$notification.error(reason);
		}
		this.$localStorage.clear();
		return this.$q.reject(reason);
	};

	AuthService.prototype.login = function (email, password) {
		var promise;
		var credentials = {
			email:email, 
			password:password
		};

		if (!_.isString(credentials.email)) {
			promise = this.$q.reject("Email is not valid");
		} else if (!_.isString(credentials.password)) {
			promise = this.$q.reject("Password is not valid");
		} else {
			promise = this.$http.post("/auth/login", credentials);
		}

		promise.then(_.bind(this.assignUser, this))
			.then(_.bind(this.assignCompanies, this))
			// .then(_.bind(this.assignRoles, this))
			.then(_.bind(this.assignState, this))
			.catch(_.bind(this.handleLoginRejection, this));

		return promise;
	};
	
	AuthService.prototype.loginWithInviteCode = function (code) {
		return this.$http.post("/auth/code", {
			code: code
		}).then(_.bind(function (resp) {
			this.$localStorage.set("contact", resp.contact);
			this.$localStorage.set("code", resp.code);
			return resp;
		}, this));
	};

	AuthService.prototype.loginWithLink = function (link) {
		this.$localStorage.set("link", link);
		return this.$q.when(true);
	};

	AuthService.prototype.getLink = function () {
		var link = this.$localStorage.get("link");
		if (link)
			return link;
		return null;
	};

	AuthService.prototype.register = function (firstName, lastName, phone, email, company, linkId, userId) {
		return this.$http.post("/links/register", {
			company: company,
			email: email,
			first_name: firstName,
			last_name: lastName,
			link_id: linkId,
			phone: phone,
			user_id: userId,
		});
	};

	AuthService.prototype.isLoggedIn = function () {
		return !!this.getUser();
	};

	AuthService.prototype.getUser = function () {
		var user = window.$USER;
		if (user) {
			return user;
		} else {
			return null;
		}
	};

	AuthService.prototype.setUser = function (user) {
		window.$USER = user;
		return user;
	};

	AuthService.prototype.getUserId = function () {
		var user = this.getUser();
		if (user) {
			return user.id;
		}
		return null;
	};

	AuthService.prototype.getContact = function () {
		return this.$localStorage.get("contact");
	};

	AuthService.prototype.getInviteCode = function () {
		return this.$localStorage.get("code");
	};

	AuthService.prototype.getContactId = function () {
		return this.getContact().id;
	};

	AuthService.prototype.logout = function () {
		delete window.$USER;
		this.$localStorage.clear();
		this.$sessionStorage.clear();
		window.location = "/logout";
	};

	AuthService.prototype.loadRole = function (companyId) {
		var self = this;
		var role = this.getRole(companyId);

		if (role) {
			return this.$q.when(role);
		}

		return self.RoleService.indexFor("users", this.getUserId(), {"company_id": companyId}).then(function (roles) {
			var loadedRoles = self.$localStorage.get("role") || [];
			var role = _.first(roles);
			
			if (role) {
				var opts = { 
					"role":role.name, 
					"company":companyId 
				};

				if (!_.find(roles, opts)) {
					loadedRoles.push(opts);
				}

				self.$localStorage.set("role", loadedRoles);
				return opts;
			} else {
				return self.$q.reject("Could not find a role for that company");
			}
		});
	};

	AuthService.prototype.getRoles = function () {
		return this.$localStorage.get("role");
	};

	AuthService.prototype.getRole = function (companyId) {
		companyId = companyId || _.get(this, "$stateParams.companyId", this.getDefaultCompanyId());
		
		var role = _.find(this.$localStorage.get("role"), {
			"company":companyId
		});

		return role;
	};

	AuthService.prototype.getRoleAsString = function (companyId) {
		return this.loadRole(companyId).then(function (role) {
			return role.role;
		});
	};

	AuthService.prototype.hasRole = function (role, companyId) {
		return this.getRoleAsString(companyId).then(function (name) {
			return name === role;
		});
	};

	AuthService.prototype.isSuperAdmin = function () {
		return this.$http.get("/api/v1/user/super").then(function (resp) {
			return resp.data.data;
		});
	};

	AuthService.prototype.isAdmin = function (companyId) {
		return this.hasRole("Admin", companyId);
	};

	AuthService.prototype.isUser = function (companyId) {
		return this.hasRole("User", companyId);
	};

	AuthService.prototype.getDefaultCompanyId = function () {
		var roles = this.getRoles();
		if (!roles) {
			return null;
		}
		var companyId = roles[0].company;
		return companyId;
	};

	AuthService.prototype.getCompanyCount = function () {
		var x = _.uniq(_.map(this.getRoles(), "company"));
		return x.length;
	};

	AuthService.prototype.getHomeUrl = function (role) {
		var state = this.getHomeState(role);
		return this.$state.href(state[0], state[1]);
	};

	AuthService.prototype.goHome = function () {
		var state = this.getHomeState();
		if (!this.$state.is(state[0])) {
			return this.$state.go(state[0], state[1]);
		}
	};

	AuthService.prototype.getHomeState = function () {
		var defaultState = "root.auth.login";
		var loggedIn = this.isLoggedIn();

		if (loggedIn) {
			return ["root.company-select", {}];
		} else {
			return [defaultState, {}];
		}
	};

	angular.module("lt.core").service("$auth", ["$http", "$localStorage", "$sessionStorage", "$api", "$state", "$q", "$rootScope", "$stateParams", "AUTH_EVENTS", "$notification", "RoleService", AuthService]);
})(window.angular, window._);