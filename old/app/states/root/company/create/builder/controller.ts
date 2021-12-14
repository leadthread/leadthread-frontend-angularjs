/// <reference path="../../../../controller.ts" />
namespace lt.app {
	
	interface IBuilderPreview {
		title: string;
		brand: Brand;
		site: Site;
		page: Page;
		options: ISiteOptions;
	}

	interface IBuilderScope {
		$watch: Function;
		$on: Function;
		lock: string;
		campaignId: number;
		campaignType: string;
		cf: CampaignForm;
		cfLength: number;
		company: ICompany;
		dependant: Function;
		getBrandColor: Function;
		getGroupKey: Function;
		getIndex: Function;
		getLogo: Function;
		getLogoColor: Function;
		isDisabled: Function;
		isFieldComplete: Function;
		isSubGroupDisabled: Function;
		next: Function;
		placeholders: _.Dictionary<string>
		prev: Function;
		preview: IBuilderPreview;
		save: Function;
		destroy: Function;
		selectedSubGroup: string;
		send: Function;
		showBrand: Function;
		updatePage: Function;
		updatePromptPage: Function;
	}

	export class BuilderController extends StatesController {
		protected transformer: CampaignTransformer;
		protected types: _.Dictionary<string>;

		static $inject = ["$scope", "$state", "$stateParams", "$auth", "$placeholder", "$title", "$window", "$popup", "$q", "$notification", "$campaignDb", "$uibModal", "CampaignService", "CampaignTransformerFactory", "SiteFactory", "company", "brands"];
		constructor(public $scope: IBuilderScope, protected $state: ng.ui.IStateService, protected $stateParams: ng.ui.IStateParamsService, protected $auth: IAuthService, protected $placeholder: IPlaceholderService, protected $title: ITitleService, protected $window: ng.IWindowService, protected $popup: IPopupService, protected $q: ng.IQService, protected $notification: INotificationService, protected $campaignDb: ICampaignDatabaseService, protected $uibModal: ng.ui.bootstrap.IModalService, protected CampaignService: CampaignService, protected CampaignTransformerFactory: CampaignTransformerFactory, protected SiteFactory: SiteFactory, protected company: ICompany, protected brands: Brand[]){
			super();
			
			this.types = {
				"referral-thread": "ReferralThread",
				"leaderboard": "Leaderboard",
				"testimonial-thread": "TestimonialThread",
				"message-thread": "MessageThread",
				"reach": "Reach",
				"recognition": "Recognition",
				"review": "Review",
			};
		}

		$onInit() {
			this.init();
		}
		
		/**
		 * Start it up
		 */
		init() {
			this.$scope.cf = null;
			this.$scope.lock = "Loading";
			this.onFormChange = _.debounce(this.onFormChange, 1000);
			this.CampaignService.showOrCreate(this.$stateParams.campaignId, {
				brand_id: this.company.brand_id,
				brand: this.company.brand,
				company_id: this.$stateParams.companyId,
				content_sharing: true,
				incentive_id: null,
				incentive: null,
				is_phone_app: false,
				name: null,
				owner_id: this.$auth.getUserId(),
				target: null,
				type: this.$stateParams.campaignType,
				version: this.getLatestVersion(this.$stateParams.campaignType),
			}).then((campaign) => {
				return campaign.load(true);
			})
			.then((campaign) => {
				// Load existing campaign from service
				this.transformer = this.CampaignTransformerFactory.create(campaign);
				let form = this.transformer.toForm(campaign);

				if (form instanceof CampaignForm) {
					this.$scope.cf = form;
				} else {
					throw "form is not an instance of CampaignForm";
				}

				// Set page title
				if (this.$stateParams.campaignId) {
					this.$title.setTitle("Edit "+this.types[campaign.type]);
				} else {
					this.$title.setTitle("New "+this.types[campaign.type]);
				}

				// Set brand to field
				form.setFieldValue("campaignBrand", campaign.brand)

				// Do the rest...
				this.defineScope();
				this.defineListeners();
				this.definePlaceholders();
				this.defineBranding();
				this.openFirstGroup();

				this.unlock();
			}, () => {
				this.unlock();
			});
		}

		/**
		 * Defines the scope
		 */
		defineScope() {
			// Functions
			this.$scope.save = this.save;
			this.$scope.destroy = this.destroy;
			this.$scope.send = this.send;
			this.$scope.next = this.next;
			this.$scope.prev = this.prev;
			this.$scope.dependant = this.dependant;
			this.$scope.getIndex = this.getIndex;
			this.$scope.isSubGroupDisabled = this.isSubGroupDisabled;
			this.$scope.isFieldComplete = this.isFieldComplete;	
			this.$scope.isDisabled = this.isDisabled;
			this.$scope.getGroupKey = this.getGroupKey;
			this.$scope.cfLength = 0;
			this.$scope.updatePage = this.updatePage;
			this.$scope.updatePromptPage = this.updatePromptPage;
			this.$scope.showBrand = this.showBrand;
			this.$scope.getBrandColor = this.getBrandColor;
			this.$scope.getLogo = this.getLogo;
			this.$scope.getLogoColor = this.getLogoColor;

			// Values
			this.$scope.campaignId = this.$stateParams.campaignId;
			this.$scope.campaignType = this.$stateParams.campaignType;
			this.$scope.company = this.company;
			this.$scope.prompt = prompt;
			this.$scope.preview = {
				title: "",
				site: null,
				page: null,
				brand: null,
				options: <ISiteOptions>{
					story: {},
					preview: true,
				}
			};

			this.promptScope();
		}

		/**
		 * Defines the listeners
		 */
		defineListeners() {
			/* Populate the campaign object when questions change */
			this.$scope.$watch(() => {
				return this.$scope.cf;
			}, this.onFormChange, true);

			/* Scope events */
			this.$scope.$on("cueUp", this.cueUp);
			this.$scope.$on("cueDown", this.cueDown);
			this.$scope.$on("deleteCue", this.deleteCue);
			
			/* Scroll to top */
			this.$scope.$watch("selectedSubGroup", () => {
				let campaign = this.transformer.getCampaignInstance();
				this.updatePreview(campaign);
				this.$window.scrollTo(0, 0);
			});
		}

		/**
		 * Defines the default placeholder text values
		 */
		definePlaceholders() {
			let user = this.$auth.getUser();
			let values = {
				"company": this.$scope.company.name,
				"sender-full-name": user.first_name+" "+user.last_name,
				"sender-first-name": user.first_name,
				"sender-last-name": user.last_name,
				"customer-first-name": "John",
				"customer-last-name": "Doe",
				"customer-full-name": "John Doe",
			};
			this.$placeholder.clear().set(values);

			// Available placeholders to insert
			this.$scope.placeholders = {
				"Company Name": "Company",
				"Sender Full Name": "Sender Full Name",
				"Sender First Name": "Sender First Name",
				"Sender Last Name": "Sender Last Name",
				"Customer Full Name": "Customer Full Name",
				"Customer First Name": "Customer First Name",
				"Customer Last Name": "Customer Last Name",
			};
		}

		defineBranding = () => {
			let form = this.$scope.cf;
			let field = form.getField("campaignBrand");
			// Set existing brands
			field.options.brands = this.brands;
			field.options.onBrandChange = this.onBrandChange;
		}

		onBrandChange = (brand: Brand) => {
			let form = this.$scope.cf;
			// Set existing brands
			form.setFieldValue("campaignBrand", brand);
		}

		protected onFormChange = () => {
			if(this.$scope.cf !== null) {
				return this.transformer.toCampaign(this.$scope.cf).then((campaign) => {
					this.$scope.toc = this.getTableOfContents();
					this.$scope.cfLength = this.getSubGroupKeys().length;
					this.updatePreview(campaign);
				});
			}
		}

		/**
		 * Helper scope for memory prompts
		 */
		promptScope() {
			this.$scope.openCustomPrompt = this.openCustomPrompt;
			this.$scope.openLibraryPrompt = this.openLibraryPrompt;
		}

		getTableOfContents() {
			return this.$scope.cf.getTableOfContents();
		}

		/*
		 * Opens the first group
		 */
		openFirstGroup() {
			let form = this.$scope.cf.getForm();
			let first = Object.keys(form)[0];
			this.$scope.selectedSubGroup = Object.keys(form[first])[0];
		}
		
		/**
		 * Unlocks the page by hiding the loading screen
		 */
		unlock() {
			this.$scope.lock = null;
		}
		
		/**
		 * Handles the cueUp scope event
		 * @param  {Event} event The scope event
		 * @param  {MemoryPrompt} cue The Memory Prompt to move up
		 */
		cueUp(event: ng.IAngularEvent, cue: IMemoryPrompt) {
			event.preventDefault();
			let obj = this.$scope.cf.getField("cues").value;
			for (let i = obj.length - 1; i >= 0; i--) {
				if (_.isEqual(cue, obj[i]) && i != 0) {
					let temp = obj[i].order;
					obj[i].order = obj[i-1].order;
					obj[i-1].order = temp;
				}
			}
			this.$scope.cf.getField("cues").value = _.sortBy(obj, ["order"]);
		}

		/**
		 * Handles the cueDown scope event
		 */
		cueDown(event: ng.IAngularEvent, cue: IMemoryPrompt) {
			event.preventDefault();
			let obj = this.$scope.cf.getField("cues").value;
			for (let i = obj.length - 1; i >= 0; i--) {
				if (_.isEqual(cue, obj[i]) && i < obj.length-1) {
					let temp = obj[i].order;
					obj[i].order = obj[i+1].order;
					obj[i+1].order = temp;
				}
			}
			this.$scope.cf.getField("cues").value = _.sortBy(obj, "order");
		}

		/**
		 * Handles the deleteCue scope event
		 * @param  {Event} event The scope event
		 * @param  {MemoryPrompt} cue The Memory Prompt to delete
		 */
		deleteCue(event: ng.IAngularEvent, cue: IMemoryPrompt) {
			event.preventDefault();
			let obj = this.$scope.cf.getField("cues").value;
			for (let i = obj.length - 1; i >= 0; i--) {
				if (_.isEqual(cue, obj[i])) {
					obj.splice(i, 1);
				}
			}
		}

		/**
		 * Sets the page on the preview for a Memory Prompt
		 * @param  {Integer|String} order The Memory Prompt number
		 */
		updatePromptPage(order: number) {
			this.$scope.preview.site = this.transformer.getCampaignInstance().site;
			// this.$scope.preview.page = this.$scope.preview.site.getMemoryPromptPage("prompt"+order);
			this.$scope.preview.title = "Memory Prompt "+order;
		}

		/**
		 * Changes what the preview displays
		 */
		updatePreview = (campaign: Campaign) => {
			this.$scope.preview.brand = this.getBrand();

			let called = false;
			_.forEach(this.$scope.cf.getForm(), (x) => {
				_.forEach(x, (y, z) => {
					if (z === this.$scope.selectedSubGroup) {
						let q = _.first<ICampaignFormField>(y.questions);
						this.updatePage(q, campaign);
						called = true;
					}
				});
			});

			if (!called) {
				this.updateSite(campaign);
			}
		}

		/**
		 * Sets the appropriate site for the preview 
		 * depending on the accordion tab you are on
		 */
		updateSite = (campaign: Campaign) => {
			switch (this.$scope.selectedSubGroup) {
				case "Action Page":
				case "Action Button":
				case "Referral Text Message":
				case "Branding":
					this.$scope.preview.site = campaign.action_page.site;
					this.$scope.preview.title = "Referral Page";
					break;
				case "Customer Text Message":
				case "Intro Page":
				case "Share Page":
				case "Testimonial Page":
				case "Text Messages":
				case "How to share":
				case "Incentive":
					this.$scope.preview.site = campaign.site;
					this.$scope.preview.title = "Customer Page";
					this.$scope.preview.options.getMsgFn = () => {
						return this.$scope.cf.getField("pRMessage").value;
					}
					this.$scope.preview.options.getUrlFn = (options: IUrlOptions): ng.IPromise<ILink> => {
						return this.$q.when({
							"long_url": "https://app.yaptive.com/l/P1234",
						});
					};
					break;
				default: 
					throw "Unknown sub group: "+this.$scope.selectedSubGroup+". Can not determine what to display in the preview."
			}

			if (this.$scope.preview.site) {
				this.$scope.preview.page = this.$scope.preview.site.pages[0];
			}
		}

		/**
		 * Sets the page on the preview for a specific input field
		 * @param  {String} field The name of the input field
		 */
		updatePage = (field: ICampaignFormField, campaign?: Campaign) => {
			campaign = campaign || this.transformer.getCampaignInstance();

			// get active field
			this.updateSite(campaign);

			switch (true) {
				case /^message|mediaType|descriptionTitle|descriptionBody$/.test(field.name) :
					this.$scope.preview.page = this.$scope.preview.site.getIntroPage();
					this.$scope.preview.title = "Customer Page";
					break;
				case /^campaignName|messageHeader|landingText|ctaText|defaultType$/.test(field.name) : 
					this.$scope.preview.page = this.$scope.preview.site.getActionPagePage();
					this.$scope.preview.title = "Referral Page";
					break;
				case /^uPMessage|pRMessage$/.test(field.name) :
					let previewSiteA = this.SiteFactory.create({type: "preview"} as ISite) as PreviewSite;
					let previewPageA: SmsPreviewPage = previewSiteA.getSmsPreviewPage();
					let previewSectionA: SmsSection = previewPageA.getSmsPreviewSection();
					
					previewSectionA.text = field.name == "uPMessage" ? this.$scope.cf.getField("uPMessage").value : this.$scope.cf.getField("pRMessage").value;
					this.$scope.preview.title = field.name == "uPMessage" ? "Message to Customer" : "Message to Referral";
					this.$scope.preview.site = previewSiteA;
					this.$scope.preview.page = previewPageA

					previewPageA.setSmsPreviewSection(previewSectionA);
					previewSiteA.setSmsPreviewPage(previewPageA);
					break;
				case /^socialMessage$/.test(field.name) :
					let previewSiteB = this.SiteFactory.create({type: "preview"} as ISite) as PreviewSite;
					let previewPageB: SocialPreviewPage = previewSiteB.getSocialPreviewPage();
					let previewSectionB: SocialSection = previewPageB.getSocialPreviewSection();
					
					previewSectionB.text = this.$scope.cf.getField("socialMessage").value;
					this.$scope.preview.title = "Social Media Preview";
					this.$scope.preview.site = previewSiteB;
					this.$scope.preview.page = previewPageB;

					previewPageB.setSocialPreviewSection(previewSectionB);
					previewSiteB.setSocialPreviewPage(previewPageB);
					break;
				case /^incentive.*$/.test(field.name) : 
					if (campaign.version === 1) {
						let previewSiteC = this.SiteFactory.create({type: "preview"} as ISite) as PreviewSite;
						let previewPageC: IncentivePreviewPage = previewSiteC.getIncentivePreviewPage();
						let previewSectionC: IncentivePreviewSection = previewPageC.getIncentivePreviewSection();
						
						this.$scope.preview.title = "Incentive";
						this.$scope.preview.site = previewSiteC;
						this.$scope.preview.page = previewPageC;
						this.$scope.preview.options.incentive = campaign.incentive;
						
						previewPageC.setIncentivePreviewSection(previewSectionC);
						previewSiteC.setIncentivePreviewPage(previewPageC);
					} else {
						this.$scope.preview.page = this.$scope.preview.site.getIntroPage();
						this.$scope.preview.title = "Customer Page";
					}
					break;
				case /^includeCues$/.test(field.name):
					this.updatePromptPage(1);
					break;
				default :
					throw "preview not set for " + field.name;
			}
		}

		/**
		 * Returns the subgroup keys for all groups/sections
		 * @return {Array}
		 */
		getSubGroupKeys() {
			let keyArr: string[] = [];
			_.forEach(this.$scope.cf.getForm(), (v) => {
				_.forEach(v, (x, k) => {
					keyArr.push(k);
				});
			});
			return keyArr;
		}

		/**
		 * Gets the index of the subgroup
		 * @param {string} subGroupKey [description]
		 */
		getIndex = (subGroupKey: string): number => {
			let keys = this.getSubGroupKeys();
			return _.indexOf(keys, subGroupKey);
		}

		/**
		 * Opens the next Accordion group
		 * @param  {String}
		 */
		next = () => {
			let keys = this.getSubGroupKeys();
			let index = _.indexOf(keys, this.$scope.selectedSubGroup) + 1;
			let nextKey = keys[index];
			if (nextKey) {
				this.$scope.selectedSubGroup = nextKey;
			}
		}

		/**
		 * Opens the previous Accordion group
		 * @param  {String}
		 */
		prev = () => {
			let keys = this.getSubGroupKeys();
			let index = _.indexOf(keys, this.$scope.selectedSubGroup) - 1;
			let nextKey = keys[index];
			if (nextKey) {
				this.$scope.selectedSubGroup = nextKey;
			}
		}

		/**
		 * Checks if a group is disabled
		 * @param  {mixed}
		 * @return {Boolean}
		 */
		isSubGroupDisabled = (sub: ICampaignFormSubGroup) => {
			return !this.$scope.cf.isSubGroupDone(sub);
		}

		/**
		 * Checks if a group is disabled
		 * @param  {mixed}
		 * @return {Boolean}
		 */
		isFieldComplete = (field: ICampaignFormField) => {
			return this.$scope.cf.isFieldComplete(field);
		}

		/**
		 * Checks if the whole form is disabled
		 */
		isDisabled = (): boolean => {
			return !this.$scope.cf.isValid();
		}

		/**
		 * Opens a prompt popup for help text
		 */
		prompt(title: string, text: string) {
			return this.$popup.info(title, text);
		}

		/**
		 * Takes you to the send campaign page for the selected campaign
		 * @return {[type]} [description]
		 */
		send = () => {
			this.$state.go("root.company.send", {campaignId: this.$stateParams.campaignId});
		}

		/**
		 * Saves the campaign data
		 * @return {Promise}
		 */
		save = (): ng.IPromise<ICampaign> => {
			let promise: ng.IPromise<ICampaign> = null;

			if (this.$scope.lock === null) {
				this.$scope.lock = "Saving";
				if (this.$scope.cf.isValid()) {
					promise = this.$q.when(this.transformer.toCampaign(this.$scope.cf)).then((campaign) => {
						return this.$campaignDb.save(campaign).then((data) => {
							this.$notification.success("Saved!");
							this.unlock();
							return data;
						}, (error: any) => {
							this.unlock();
							return this.$q.reject(error);
						});
					});
				} else {
					promise = this.$q.reject("Invalid Form!");
				}
			} else {
				promise = this.$q.reject("Cannot save because the page is currently "+this.$scope.lock);
			}

			return promise.then((resp) => {
				this.$state.go("root.company.create.edit", {companyId: this.$stateParams.companyId, campaignId: resp.id, campaignType: resp.type});
				return resp;
			});
		}

		destroy = () => {
			if(confirm("Are you sure you want to delete this Campaign?")) {
				return this.CampaignService.destroy(this.$scope.campaignId).then(() => {
					this.$notification.success("Campaign has been deleted.");
					this.$state.go("root.company");
				});
			}
		}

		/**
		 * Shows and hides dependant question fields
		 * @param  {Object} question A question from campaign data
		 */
		dependant = (field: ICampaignFormField) => {
			return this.$scope.cf.isFieldEnabled(field);
		}

		showBrand = () => {
			if (this.$scope.preview.site instanceof PreviewSite) {
				return false;
			}
			return true;
		}

		getBrand = (): Brand => {
			return this.transformer.getCampaignInstance().brand;
		}

		getLogo = (): Brand => {
			let logo = this.$scope.cf.getFieldValue("companyLogo");
			if (logo) {
				return logo;
			}
			return null;
		}

		getLogoColor = () => {
			let color = this.$scope.cf.getField("companyLogoColor").value;
			return color || "#FFFFFF";
		}

		getBrandColor = () => {
			let color = this.$scope.cf.getField("campaignColor").value;
			return color || "#000000";
		}

		openCustomPrompt() {
			let custom = this.$uibModal.open({
				animation: true,
				templateUrl: "components/prompt-builder/custom/index.html",
				controller: "PromptBuilderCustomController",
				resolve: {
					items: () => {
						return this.$scope.items;
					}
				}
			});

			custom.result.then(this.onNewCue);
		};

		openLibraryPrompt() {
			let library = this.$uibModal.open({
				animation: true,
				templateUrl: "components/prompt-builder/library/index.html",
				controller: "PromptBuilderLibraryController",
				resolve: {
				}
			});

			library.result.then(this.onNewCue);
		};

		onNewCue(c: IMemoryPrompt) {
			if (this.$scope.cf.getField("cues").value === null) {
				this.$scope.cf.getField("cues").value = [];
			}

			c.order = this.$scope.cf.getField("cues").value.length + 1; // You cannot start at 0
			this.$scope.cf.getField("cues").value.push(c);
			this.updatePromptPage(this.$scope.cf.getField("cues").value.length);
			this.$scope.cf.getField("cues").value = _.sortBy(this.$scope.cf.getField("cues").value, "order");

			return c;
		};

		getGroupKey() {
			let key = "";
			_.forEach(this.$scope.cf.getForm(), (v, k) => {
				_.forEach(v, (vv, kk) => {
					if (this.$scope.selectedSubGroup === kk) {
						key = k;
					}
				});
			});
			return key;
		}

		protected getLatestVersion(type: string): number {
			switch(type) {
				case "referral-thread":
				return window.$VERSION_REFERRAL_THREAD;
				case "leaderboard":
				return window.$VERSION_LEADERBOARD;
				case "message-thread":
				return window.$VERSION_MESSAGE_THREAD;
				case "reach":
				return window.$VERSION_REACH;
				case "review":
				return window.$VERSION_REVIEW;
				case "recognition":
				return window.$VERSION_RECOGNITION;
				case "testimonial-thread":
				return window.$VERSION_TESTIMONIAL_THREAD;
				default:
				throw "Could not find version for campaign type: "+type;
			}
		}
	}

	angular.module("lt.app").controller("BuilderController", BuilderController);
}