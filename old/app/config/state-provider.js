angular.module("lt.app").config(["$stateProvider", function ($stateProvider) {
	"use strict";

	$stateProvider.state("root", {
		url:"",
		templateUrl:"states/root/index.html",
		title:"Root",
	});

	$stateProvider.state("root.company-select", {
		url: "/company-select",
		templateUrl: "states/root/company-select/index.html",
		controller: "CompanySelectController",
		roles: ["Admin", "User", "Contact"],
		title: "Company Selection",
		resolve: {
			_companies: ["CompanyService", function (CompanyService) {
				return CompanyService.paginate(1, 24);
			}],
		}
	});

	$stateProvider.state("root.console", {
		url: "/console?{companyId:int}",
		templateUrl: "states/root/console/index.html",
		controller: "ConsoleController",
		roles: ["Admin"],
		title: "Yaptive Admin Console",
		reloadOnSearch: false,
		resolve: {
			company: ["$stateParams", "CompanyService", function ($stateParams, CompanyService) {
				if ($stateParams.companyId)
					return CompanyService.show($stateParams.companyId).then(function (c) {
						return c.load(true);
					});
				else
					return null;
			}],
		 
		}
	});

	/*======================================
	=            Authentication            =
	======================================*/
	
	$stateProvider.state("root.auth", {
		url: "/auth",
		templateUrl: "states/root/auth/index.html",
		controller: "AuthController"
	});

	$stateProvider.state("root.auth.register", {
		url:"/register/{linkId}",
		templateUrl:"states/root/auth/register/index.html",
		controller:"AuthRegisterController",
		resolve: {
			link: ["$stateParams", "$api", function ($stateParams, $api) {
				return $api.show("links", $stateParams.linkId).exec().then(function (resp) {
					return resp.data;
				});
			}],
			campaign: ["CampaignService", "link", function (CampaignService, link) {
				return CampaignService.show(link.campaign_id).then(function (campaign) {
					return campaign.load(["brand", "logo"]);
				});
			}],
			company: ["CompanyService", "campaign", function (CompanyService, campaign) {
				return CompanyService.show(campaign.company_id).then(function (company) {
					return company.load(true);
				});
			}],
		}
	});

	$stateProvider.state("root.auth.code", {
		url:"/code",
		templateUrl:"states/root/auth/code/index.html",
		controller:"AuthCodeController",
	});

	$stateProvider.state("root.company.logout", {
		url:"/logout",
		templateUrl:"states/root/auth/logout/index.html",
		controller:"LogoutController",
		title: "Log Out",
	});

	$stateProvider.state("root.auth.login", {
		url:"/login",
		templateUrl:"states/root/auth/login/index.html",
		controller:"AuthLoginController",
		title: "Log In",
	});

	$stateProvider.state("root.auth.reset", {
		url:"/reset",
		templateUrl:"states/root/auth/reset/index.html",
		controller:"AuthResetController",
		title: "Password Reset",
	});

	$stateProvider.state("root.auth.reset.token", {
		url:"/{token}?{email}",
		templateUrl:"states/root/auth/reset/token/index.html",
		controller:"AuthResetTokenController",
		title: "Password Reset",
	});

	/*=====  End of Authentication  ======*/

	$stateProvider.state("root.company", {
		url:"/{companyId:int}",
		templateUrl:"states/root/company/index.html",
		roles: ["Admin", "User", "Contact"],
		controller:"CompanyController",
		resolve:{
			companies: ["CompanyService", function (CompanyService) {
				return CompanyService.index();
			}],
			company: ["company_id", "companies", "$q", function (company_id, companies, $q) {
				var x = _.find(companies, {id: company_id});
				return x ? x.load(true) : $q.reject("Could not find a company with that ID");
			}],
			company_id: ["$stateParams", "$q", function ($stateParams, $q) {
				// console.log('state params:', $stateParams.companyId);
				return $q.when($stateParams.companyId);
			}],
			role: ["$auth", "company_id", function ($auth, company_id) {
				return $auth.getRoleAsString(company_id);
			}],
			isAdmin: ["$auth", function ($auth) {
				return $auth.hasRole("Admin");
			}],
		}
	});

	$stateProvider.state("root.company.message", {
		url: "/message?{contactId:int}",
		roles: ["Admin", "User"],
		templateUrl: "states/root/company/message/index.html",
		controller: "MessageController",
		title: "Message Center",
	});

	$stateProvider.state("root.company.dashboard", {
		url:"/dashboard?{campaignId:int}",
		roles: ["Admin", "User"],
		templateUrl:"states/root/company/dashboard/index.html",
		controller:"DashboardController",
		title:"Dashboard",
		reloadOnSearch: true,
		resolve: {
			campaigns: ["CampaignService", function (CampaignService) {
				return CampaignService.index();
			}],
			companies: ["CompanyService", function (CompanyService) {
				return CompanyService.index();
			}],
			company: ["company_id", "companies", "$q", function (company_id, companies, $q) {
				var x = _.find(companies, {id: company_id});
				return x ? x.load(true) : $q.reject("Could not find a company with that ID");
			}],
			company_id: ["$stateParams", "$q", function ($stateParams, $q) {
				// console.log('state params:', $stateParams.companyId);
				return $q.when($stateParams.companyId);
			}],
		}
	});

	// $stateProvider.state("root.company.leaderboards", {
	// 	url:"/leaderboards?{campaignId:int}",
	// 	roles: ["Admin"],
	// 	templateUrl:"states/root/company/leaderboards/index.html",
	// 	controller:"LeaderboardsController",
	// 	title:"Leaderboards",
	// 	reloadOnSearch: true,
	// 	resolve: {
	// 		campaigns: ["CampaignService", function (CampaignService) {
	// 			return CampaignService.index({type: "leaderboard"});
	// 		}],
	// 	}
	// });

	$stateProvider.state("root.company.leaderboard", {
		url:"/leaderboard/{batchId}",
		roles: ["Admin"],
		templateUrl:"states/root/company/leaderboard/index.html",
		controller:"LeaderboardController",
		title:"Leaderboard",
		reloadOnSearch: true,
		resolve: {
			sms_batch: ["SmsBatchService", "$stateParams", function (SmsBatchService, $stateParams) {
				return SmsBatchService.show($stateParams.batchId);
			}],
			contacts: ["ContactService", "$stateParams", function (ContactService, $stateParams) {
				return ContactService.indexFor("batches", $stateParams.batchId);
			}],
			points: ["PointService", "$stateParams", function (PointService, $stateParams) {
				return PointService.indexFor("batches", $stateParams.batchId);
			}],
		}
	});

	/*=================================
	=            Campaigns            =
	=================================*/

	$stateProvider.state("root.company.send", {
		url:"/send?{type}&{playlistId:int}&{campaignId:int}&{contactId:int}&{userId:int}",
		templateUrl:"states/root/company/send/index.html",
		roles: ["Admin", "User"],
		controller:"SendController",
		title: "Send Campaign",
		reloadOnSearch: true,
		resolve: {
			users: ["UserService", function (UserService) {
				return UserService.index();
			}],
			campaigns: ["CampaignService", function (CampaignService) {
				return CampaignService.index();
			}],
			playlists: ["PlaylistService", "$q", function (PlaylistService, $q) {
				// return $q.when([]);
				return PlaylistService.index();
			}],
			// playlists: ["$api", "company_id", function ($api, company_id) {
			// 	return $api.index("playlists", {company_id: company_id}).exec().then(function (x) {
			// 		return x.data;
			// 	});
			// }],
		}
	});

	$stateProvider.state("root.company.playlist", {
		url:"/playlist?{playlistId:int}",
		templateUrl:"states/root/company/playlist/index.html",
		roles:["Admin"],
		controller:"PlaylistController",
		title:"Playlist",
		reloadOnSearch: true,
		resolve: {
			playlists: ["$api", "company_id", function ($api, company_id) {
				return $api.index("playlists", {company_id: company_id}).exec().then(function (x) {
					return x.data;
				});
			}],
			campaigns: ["CampaignService", function (CampaignService) {
				return CampaignService.index();
			}],
		}
	});

	$stateProvider.state("root.company.campaigns", {
		url:"/campaign",
		templateUrl:"states/root/company/create/index.html",
		roles: ["Admin"],
		controller:"CreateController",
		title: "My Campaigns",
		resolve:{
			_: ["CampaignService", function (CampaignService) {
				return CampaignService.index();
			}]
		}
	});

	$stateProvider.state("root.company.create", {
		abstract: true,
		url:"/campaign",
		templateUrl:"states/root/company/create/index.html",
		roles: ["Admin"],
		controller:"CreateController",
		title: "My Campaigns",
		resolve:{
			_: ["CampaignService", function (CampaignService) {
				return CampaignService.index();
			}]
		}
	});

	$stateProvider.state("root.company.create.new", {
		url:"/new/{campaignType}",
		templateUrl:"states/root/company/create/builder/index.html",
		roles: ["Admin"],
		controller:"BuilderController",
		title: "New Campaign",
		resolve:{
			brands:["company_id", "BrandService", "$q", function (company_id, BrandService, $q) {
				return BrandService.index().then(function (brands) {
					return $q.all(_.map(brands, function (brand) {
						return brand.load(true);
					}));
				});
			}],
		}
	});

	$stateProvider.state("root.company.create.edit", {
		url:"/edit/{campaignType}/{campaignId:int}",
		templateUrl:"states/root/company/create/builder/index.html",
		roles: ["Admin"],
		controller:"BuilderController",
		title: "Edit Campaign",
		resolve:{
			brands:["company_id", "BrandService", "$q", function (company_id, BrandService, $q) {
				return BrandService.index().then(function (brands) {
					return $q.all(_.map(brands, function (brand) {
						return brand.load(true);
					}));
				});
			}],
		}
	});

	/*=====  End of Campaigns  ======*/

	$stateProvider.state("root.company.users", {
		url:"/users",
		templateUrl:"states/root/company/users/index.html",
		roles: ["Admin", "User", "Contact"],
		controller:"UsersController",
		resolve: {
			
		}
	});

	/*====================================
	=            Contacts             =
	====================================*/
	
	$stateProvider.state("root.company.contacts", {
		url:"/contacts",
		templateUrl:"states/root/company/contacts/index.html",
		roles: ["Admin", "User"],
		controller:"ContactsController",
		title: "My Contacts",
	});

	$stateProvider.state("root.company.contacts.index", {
		url:"/index?{userId:int}",
		templateUrl:"states/root/company/contacts/index/index.html",
		roles: ["Admin", "User"],
		controller:"ContactsIndexController",
		title: "My Contacts",
		resolve: {  
			users: ["UserService", function (UserService) {
				return UserService.index();
			}]
		}
	});

	$stateProvider.state("root.company.contact", {
		url:"/contact/{contactId:int}",
		templateUrl:"states/root/company/contact/index.html",
		roles: ["Admin", "User"],
		controller:"ContactController",
		title: "My Contacts",
		resolve: {
			contact: ["$stateParams", "$messages", function ($stateParams, $messages) {
				return $messages.getContact($stateParams.contactId);
			}],
			user: ["$auth", "$q", function ($auth, $q) {
				return $q(function (resolve) {
					resolve($auth.getUser());
				});
			}],
			users: ["$api", "contact", function ($api, contact) {
				return $api.show("contacts", contact.id).index("users").exec().then(function (x) {
					return x.data;
				});
			}],
			referrals: ["$q", "role", "$api", "company_id", "contact", "users", "user", function ($q, role, $api, company_id, contact, users, user) {
				return $q(function (resolve, reject) {
					if (role === "Admin") {
						$api.show("contacts", contact.id).index("referrals").exec().then(function (resp) {
							resolve(resp.data);
						}, reject);
					} else if (role === "User") {
						$api.show("contacts", contact.id).index("referrals", {owner_id:user.id}).exec().then(function (resp) {
							resolve(resp.data);
						}, reject);
					} else {
						reject("Unknown role: "+role);
					}
				});
			}],
			campaigns: ["$q", "role", "contact", "company_id", "users", "$api", "user", function ($q, role, contact, company_id, users, $api, user) {
				return $q(function (resolve, reject) {
					if (role === "Admin") {
						$api.show("contacts", contact.id).index("campaigns").exec().then(function (resp) {
							resolve(resp.data);
						});
					} else if (role === "User") {
						$api.show("contacts", contact.id).index("campaigns").exec().then(function (resp) {
							$api.show("users", user.id).index("campaigns").exec().then(function (res) {
								var result = _.intersectionWith(res.data, resp.data, function (f, s) {
									return f.id == s.id;
								});

								resolve(result);
							});
						});
					} else {
						reject();
					}
				});
			}],
			userContactJunction: ["$q", "$api", "users", "company_id", "contact", "user", function ($q, $api, users, company_id, contact, user) {
				return $api.show("contacts", contact.id).show("users", user.id).index("pivot").exec().then(function (x) {
					return x.data;
				});
			}]
		}
	});
	
	$stateProvider.state("root.company.referral", {
		url:"/referral/{referralId}",
		templateUrl:"states/root/company/referral/index.html",
		roles: ["Admin", "User"],
		controller:"ReferralController",
		title:"Referral",
		resolve: {
			link: ["LinkService", "$stateParams", function (LinkService, $stateParams) {
				return LinkService.indexFor("referrals", $stateParams.referralId).then(function (x) {
					return _.first(x);
				});
			}],
			campaign: ["link", "$api", function (link, $api) {
				return $api.show("campaigns", link.campaign_id).exec().then(function (x) {
					return x.data;
				});
			}],
			contact: ["link", "$api", function (link, $api) {
				return $api.show("contacts", link.contact_id).exec().then(function (x) {
					return x.data;
				});
			}],
			referral: ["ReferralService", "$stateParams", function (ReferralService, $stateParams) {
				return ReferralService.show($stateParams.referralId);
			}],
			user: ["link", "$api", function (link, $api) {
				return $api.show("users", link.user_id).exec().then(function (x) {
					return x.data;
				});
			}],
			notes: ["$api", "$q", "link", function ($api, $q, link) {
				return $api.show("links", link.id).index("notes").exec().then(function (resp) {
					var users = [];
					for (var i = 0; i < resp.data.length; i++) {
						if (users.indexOf(resp.data[i].user_id) == -1) {
							users.push(resp.data[i].user_id);
						}
					}

					var qs0 = [];
					for (var j = 0; j < users.length; j++) {
						qs0.push($api.show("users", users[j]).exec().then(function (res) {
							users[j] = res.data;
						}));
					}
					return $q.all(qs0).then(function () {
						var qs = [];
						for (var k = 0; k < resp.data.length; k++) {
							var name = users.find(function (u) {
								return u.id == resp.data[k].user_id;
							});
							name = name.first_name+" "+name.last_name;
							qs.push(resp.data[k].user_name = name);
						}
						return $q.all(qs).then(function () {
							return resp.data;
						});
					});
				});
			}]
		}
	});

	/*=====  End of Contacts  ======*/

	/*===============================
	=            Reports            =
	===============================*/

	var params = [
		"date",
		"campaign",
		"campaign_type",
		"user",
		"user_id:int",
		"contact_sent",
		"contact_opt_out",
		"contact_opened",
		"campaign_id:int",
		"contact_shares",
		"contact_incentive_views",
		"recipient_opens",
		"recipient_watched_video",
		"recipient_clicked_call",
		"recipient_clicked_sms",
		"recipient_clicked_url",
		"recipient_clicked_email",
		"recipient_clicked_register",
		"recipient_registered",
		"recipient_is_lead",
		"recipient_is_lead_total",
	];

	var paramsString = _.map(params, function (param) {
		return "{"+param+"}";
	}).join("&");
	
	$stateProvider.state("root.company.report", {
		url:"/report",
		templateUrl:"states/root/company/report/index.html",
		roles: ["Admin", "User"],
		controller:"ReportController",
		reloadOnSearch: true,
		title: "Reports",
		resolve: {  
			users: ["UserService", function (UserService) {
				return UserService.index();
			}],
			campaigns: ["CampaignService", function (CampaignService) {
				return CampaignService.index();
			}],
		}
	});

	$stateProvider.state("root.company.report.campaign", {
		url:"/campaign?"+paramsString,
		templateUrl:"states/root/company/report/campaign/index.html",
		roles: ["Admin"],
		controller:"ReportCampaignController",
		title: "Reports",
	});

	$stateProvider.state("root.company.report.user", {
		url:"/user?"+paramsString,
		templateUrl:"states/root/company/report/user/index.html",
		roles: ["Admin", "User"],
		controller:"ReportUserController",
		title: "Reports",
	});

	$stateProvider.state("root.company.report.recipient", {
		url:"/recipient?"+paramsString,
		templateUrl:"states/root/company/report/recipient/index.html",
		roles: ["Admin", "User"],
		controller:"ReportRecipientController",
		title: "Reports",
	});

	$stateProvider.state("root.company.report.contact", {
		url:"/contact?"+paramsString,
		templateUrl:"states/root/company/report/contact/index.html",
		roles: ["Admin", "User"],
		controller:"ReportContactController",
		title: "Reports",
	});
	
	/*=====  End of Reports  ======*/

	/*================================
	=            Settings            =
	================================*/

	$stateProvider.state("root.company.user-settings", {
		url:"/user/settings",
		templateUrl:"states/root/company/user-settings/index.html",
		title: "User Settings",
		controller:"UserSettingsController"
	});

	$stateProvider.state("root.company.settings", {
		url:"/settings",
		roles: ["Admin"],
		templateUrl:"states/root/company/settings/index.html",
		controller:"SettingsController",
		title: "Branding",
		resolve:{
			brands:["company_id", "BrandService", "$q", function (company_id, BrandService, $q) {
				return BrandService.index().then(function (brands) {
					return $q.all(_.map(brands, function (brand) {
						return brand.load(true);
					}));
				});
			}],
		}
	});

	$stateProvider.state("root.company.manage", {
		url: "/manage",
		roles: ["Admin"],
		templateUrl: "states/root/company/manage/index.html",
		controller: "ManageController",
		title: "User Management",
		resolve: {
			users: ["$api", "$stateParams", "$q", function ($api, $stateParams, $q) {
				return $api.index("users").exec().then(function (resp) {
					var promises = {};
					
					_.forEach(resp.data, function (user) {
						promises[user.id] = $api.show("users", user.id).index("roles", {company_id: $stateParams.companyId}).exec().then(function (x) {
							return x.data;
						});
					});

					return $q.all(promises).then(function (res) {
						_.forEach(resp.data, function (user) {
							user.role = res[user.id][0].name;
						});
						return resp.data;
					}, console.error);
				});
			}],
			roles: ["RoleService", function (RoleService) {
				return RoleService.index();
			}],
		}
	});
	
	/*=====  End of Settings  ======*/

	$stateProvider.state("root.style", {
		url:"/style",
		templateUrl:"states/root/style/index.html"
	});
	
	/*===========================
	=            404            =
	===========================*/
	
	var opts404 = {
		url: "*path",
		title: "404",
		templateUrl: "states/root/404/index.html"
	};

	$stateProvider.state("root.company.404", _.cloneDeep(opts404));
	$stateProvider.state("root.404", _.cloneDeep(opts404));
			
	/*=====  End of 404  ======*/

}]);