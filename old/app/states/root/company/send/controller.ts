namespace lt.app {
	interface ISendScope {
		$watch: Function;
		deselectContact: (contact: ISendContact) => ISendContact;
		onCampaignSend: () => void;
		onPlaylistAdd: () => void;
		toggleSendOverlay: () => void;
		company: Company;
		controls: ISendControls;
		link: string;
		loaded: boolean;
		searching: boolean;
		sending: boolean;
		sendOverlayEnabled: boolean;
		target: Playlist|Campaign;
		type: string;
		userId: number;
		isAdmin: boolean;
		isMobile: boolean;
	}

	interface ISendContact extends Contact {
		timestamp: string;
		selected: boolean;
		sent: boolean;
	}

	interface ISendCampaignPopupResult {
		message: string;
	}

	interface ISendPlaylistPopupResult {

	}

	interface ISendControls {
		send: {
			active: boolean;
		}
		type: {
			selected: string;
			items: ["campaign", "playlist"];
		}
		campaign: {
			selected: Campaign;
			items: Campaign[];
		}
		playlist: {
			selected: Playlist;
			items: Playlist[];
		}
		user: {
			selected: User;
			items: User[];
		}
		contacts: {
			selected: ISendContact[];
			items: ISendContact[];
		}
	}

	export class SendController extends StatesController {
		static $inject: string[] = ["$scope", "campaigns", "playlists", "users", "ContactService", "$device", "$notification", "$location", "$placeholder", "$timeout", "$title", "$http", "$sms", "$stateParams", "$auth", "$popup", "$q", "EventService", "isAdmin"];
		constructor(public $scope: ISendScope, protected campaigns: Campaign[], protected playlists: Playlist[], protected users: User[], protected ContactService: ContactService, protected $device: IDeviceService, protected $notification: INotificationService, protected $location: ng.ILocationService, protected $placeholder: IPlaceholderService, protected $timeout: ng.ITimeoutService, protected $title: ITitleService, protected $http: ng.IHttpService, protected $sms: ISmsService, protected $stateParams: ng.ui.IStateParamsService, protected $auth: IAuthService, protected $popup: IPopupService, protected $q: ng.IQService, protected EventService: EventService, protected isAdmin: boolean){
			super();
		}

		defineScope() {
			this.$scope.sending = false;
			this.$scope.userId = this.$auth.getUserId();
			this.$scope.loaded = false;
			this.$scope.sendOverlayEnabled = false; 
			this.$scope.searching = false;
			this.$scope.deselectContact = this.deselectContact;
			this.$scope.isAdmin = this.isAdmin;
			this.$scope.isMobile = this.$device.isMobile();

			//funcs
			this.$scope.toggleSendOverlay = this.toggleSendOverlay;
			this.$scope.onPlaylistAdd = this.onPlaylistAdd;
			this.$scope.onCampaignSend = this.onCampaignSend;
			this.$scope.link = null;

			this.$scope.controls = {
				send: {
					active: true,
				},
				type: {
					selected: null,
					items: ["campaign", "playlist"],
				},
				campaign: {
					selected: null,
					items: this.campaigns,
				},
				playlist: {
					selected: null,
					items: this.playlists,
				},
				user: {
					selected: null,
					items: this.users,
				},
				contacts: {
					items: [],
					selected: [],
				}
			};

			this.$scope.controls.type.selected = this.$stateParams.type;
			this.$scope.controls.user.selected     = _.find(this.$scope.controls.user.items,     {id: this.$stateParams.userId});
			this.$scope.controls.campaign.selected = _.find(this.$scope.controls.campaign.items, {id: this.$stateParams.campaignId});
			this.$scope.controls.playlist.selected = _.find(this.$scope.controls.playlist.items, {id: this.$stateParams.playlistId});
		}
		defineListeners() {
			this.$scope.$watch("controls.user.selected.id", (n: number) => {
				this.$location.search("userId", n);
			});
			this.$scope.$watch("controls.campaign.selected.id", (n: number) => {
				this.$location.search("campaignId", n);
			});
			this.$scope.$watch("controls.playlist.selected.id", (n: number) => {
				this.$location.search("playlistId", n);
			});
			this.$scope.$watch("controls.type.selected", (n: string) => {
				this.$location.search("type", n);
			});

			this.$scope.$watch("controls.contacts.selected.length", (n: number, o: number) => {
				if (n > o) {
					this.onSelectedContacts(this.$scope.controls.contacts.selected);
				}
				if (n === 0) {
					this.$scope.sendOverlayEnabled = false; 
				}
			});
		}

		definePlaceholders () {
			let user = this.$auth.getUser();
			this.$placeholder.clear().set({
				"company": this.$scope.company.name,
				"sales-rep-first-name": user.first_name,
				"sales-rep-last-name": user.last_name,
				"sales-rep-full-name": user.first_name+" "+user.last_name,
			});
		}

		init() {
			let type 	 = _.get<string>(this.$scope, "controls.type.selected");
			let campaign = _.get<Campaign>(this.$scope, "controls.campaign.selected");
			let playlist = _.get<Playlist>(this.$scope, "controls.playlist.selected");

			this.$scope.type = type;
			this.$scope.target = campaign ? campaign : playlist;

			if (type) {
				this.setNavbarTitle();

				if (campaign || playlist) {
					if (type === "campaign") {
						this.getCampaignLink();
					}

					if (this.$stateParams.contactId) {
						this.ContactService.show(this.$stateParams.contactId).then((resp: ISendContact) => {
							this.$timeout(() => {
								this.$scope.controls.contacts.selected = _.unionWith(this.$scope.controls.contacts.selected, [resp], (a: ISendContact, b: ISendContact) => {
									return a.phone.valueOf() === b.phone.valueOf();
								});
								this.onSelectedContacts(this.$scope.controls.contacts.selected);
							}, 1000);
						});
					}

					this.$scope.loaded = true;
				}
			}
		}

		setNavbarTitle() {
			let x = "Send Campaign";
			if (this.$scope.controls.type.selected === "playlist") {
				x = "Add to Playlist";
			}
			this.$title.setTitle(x);
		};

		getCampaignLink(userId: number = null): ng.IPromise<ILink> {
			if (!_.isInteger(userId)) {
				userId = this.$auth.getUser().id;
			}
			return this.$http.post("/api/v1/links/campaign", {
				user_id:userId,
				campaign_id:this.$scope.controls.campaign.selected.id,
				company_id:this.$stateParams.companyId,
				target_id: this.$scope.controls.campaign.selected.id
			}).then((resp: ng.IHttpPromiseCallbackArg<IApiItemResponse<ILink>>) => {
				this.$scope.link = resp.data.data.keyword_url || resp.data.data.long_url;
				return resp.data.data;
			});
		};

		getContactLink(contactId: number, userId: number = null): ng.IPromise<ILink> {
			if (!_.isInteger(userId)) {
				userId = this.$auth.getUser().id;
			}
			return this.$http.post("/api/v1/links/contact", {
				user_id:userId,
				campaign_id:this.$scope.controls.campaign.selected.id,
				company_id:this.$stateParams.companyId,
				contact_id: contactId,
			}).then((resp: ng.IHttpPromiseCallbackArg<IApiItemResponse<ILink>>) => {
				return resp.data.data;
			});
		};

		toggleSendOverlay() {
			this.$scope.sendOverlayEnabled = !this.$scope.sendOverlayEnabled;
		};

		onSelectedContacts = (p: ISendContact|ISendContact[]): ng.IPromise<ISendContact[]> => {
			if (_.isArray(p)) {
				return this.$q.all(_.map(p, this.onSelectedContact));
			} else {
				return this.onSelectedContact(p).then((p) => {return [p]});
			}
		};

		onSelectedContact = (p: ISendContact): ng.IPromise<ISendContact> => {
			if (this.$scope.type === "campaign" && this.$scope.isMobile) {
				let promise = this.getContactLink(p.id).then((link) => {
					return this.$q.all({
						link: this.$sms.getSmsHrefObject(this.getMsgFn(), link.long_url, p, true),
						event: this.EventService.record(link, "sent")
					}).then((x: {link: ISmsHref, event: Event}) => {
						p.timestamp = new Date().toISOString();
						p.link = x.link;
						this.deselectContact(p);
						location.href = p.link.href;
						return p;
					});
				});
				return this.$popup.while(promise, "Opening your SMS App...");
			} else {
				return this.$q.when(p);
			}
		};

		onPlaylistAdd = () => {
			let contacts: ISendContact[];

			if (this.$scope.target instanceof Playlist) {
				contacts = _.cloneDeep(this.$scope.controls.contacts.selected);

				if(contacts.length > 0 && this.$scope.controls.send.active) {
					return this.$popup.sendPlaylist({
						count: contacts.length,
						playlist: this.$scope.target,
					}).then((resp: ISendPlaylistPopupResult) => {
						this.$scope.controls.send.active = false;					
						let userId = _.get<number>(this, "$scope.controls.user.selected.id")
						return this.$http.post("/api/v1/playlists/"+this.$scope.target.id+"/attach", _.merge({"contact_ids": _.map(contacts, "id"), "user_id": userId}, resp)).then(() => {
							this.$notification.success("Success! Added "+contacts.length+" contacts to the playlist.");
							this.$scope.controls.send.active = true;
							_.map(this.$scope.controls.contacts.selected, this.deselectContact);
						}, function (error: any) {
							// this.$notification.error(error);
						});
					});
				}
			} else {
				return this.$q.reject("Type must be 'playlist'");
			}
		};

		onCampaignSend = () => {
			let contacts: ISendContact[];

			if (this.$scope.target instanceof Campaign) {
				contacts = _.cloneDeep(this.$scope.controls.contacts.selected);

				if(contacts.length > 0 && this.$scope.controls.send.active) {
					return this.$popup.sendCampaign({
						count: contacts.length,
						campaign: this.$scope.target,
					}).then((resp: ISendCampaignPopupResult) => {
						this.$scope.controls.send.active = false;
						let userId = _.get<number>(this, "$scope.controls.user.selected.id")
						return this.$sms.sendInvite(_.map(contacts, "id"), resp.message, this.$stateParams.companyId, this.$scope.controls.campaign.selected.id, userId).then(() => {
							this.$notification.success("Success! Sent the campaign to "+contacts.length+" contacts.");
							this.$scope.controls.send.active = true;
							_.map(this.$scope.controls.contacts.selected, this.deselectContact);
						}, (error: any) => {
							// this.$notification.error(error);
						});
					});
				}
			} else {
				return this.$q.reject("Type must be 'campaign'");
			}

		};

		deselectContact(p: ISendContact) {
			if (p) {
				p.selected = false;
			}
			return p;
		};
		
		getMsgFn() {
			return this.$scope.controls.campaign.selected.contact_text_message;
		};
	}
	
	angular.module("lt.app").controller("SendController", SendController);
}

