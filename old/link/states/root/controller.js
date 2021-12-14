const Controller as BaseController = require("../controller")

export class Controller extends BaseController {

        //Dependencies
    	static $inject = ["$scope", "$favicon", "$http", "$q", "$api", "$stateParams", "$company", "$placeholder", "$sms", "$location", "$title", "CampaignFactory", "ActionPageFactory", "ReferralFactory", "contact", "owner", "company", "link", "story", "target", "referral", "EventService"];

        private story: IStory;

        constructor(public $scope: ILinkScope, private $favicon: IFaviconService, private $http: ng.IHttpService, private $q: ng.IQService, private $api: IApiService, private $stateParams: ng.ui.IStateParamsService, private $company: ICompanyService, private $placeholder: IPlaceholderService, private $sms: ISmsService, private $location: ng.ILocationService, private $title: ITitleService, private CampaignFactory: CampaignFactory, private ActionPageFactory: ActionPageFactory, private ReferralFactory: ReferralFactory, private contact: IContact|null, private owner: IUser, private company: Company, private link: Link, private story: IStory, private target: Thread, protected referral: Referral, protected EventService: EventService) {
            super();
            this.story = story || {
                type: null,
                video: null,
                image: null,
                caption: null,
            };
        }

        init() {
            let self = this;
            this.EventService.record(this.$scope.options.link, "opened");
            self.$company.setCompany(self.company);
        }

        protected defineScope(): void {
            let self = this,
                options = <ISiteOptions>{};

            self.$scope.company = self.company;
            self.$scope.contact = self.contact;
            self.$scope.referral = self.referral;
            self.$scope.lock = null;
            self.$scope.owner = self.owner;
            self.$scope.showSite = true;
            self.$scope.target = this.target;
            self.$scope.pageIndex = self.$stateParams.page;
            self.$scope.scrollTo = self.$stateParams.scrollTo;

            options.collectCompany = this.target.type === "referral-thread";
            options.color = this.target.brand.color || "#000000";
            options.getMsgFn = self.getReferralMsgFn;
            options.getUrlFn = self.getUrlFn;
            options.link = self.link;
            options.contact = self.contact;
            options.referral = self.referral;
            options.onNewReferral = self.onNewReferral;
            options.owner = self.owner;
            options.sent_via = null;
            options.type = this.target.type;
            options.story = self.story;

            if(this.target instanceof Campaign) {
                options.incentive = this.target.incentive;
            }

            self.$title.setTitle(this.target.brand.name);
            self.$favicon.changeFavicon(this.target.brand.favicon_id);

            self.$scope.options = options;
        }

        protected defineListeners(): void {
            this.$scope.$on("SiteNext", () => {
                this.scrollTop();
                this.$scope.pageIndex++;
                this.$location.search("page", this.$scope.pageIndex);
            });
            this.$scope.$on("SitePrev", () => {
                this.scrollTop();
                this.$scope.pageIndex--;
                this.$location.search("page", this.$scope.pageIndex);
            });
        }

        protected definePlaceholders(): void {
            var values: any = {
                "company": this.$scope.company.name,
                "sales-rep-full-name": this.$scope.owner.first_name+" "+this.$scope.owner.last_name,
                "sales-rep-first-name": this.$scope.owner.first_name,
                "sales-rep-last-name": this.$scope.owner.last_name,
            };

            if (this.$scope.contact) {
                values["customer-first-name"] = this.$scope.contact.first_name;
                values["customer-last-name"] = this.$scope.contact.last_name;
                values["customer-full-name"] = this.$scope.contact.first_name+" "+this.$scope.contact.last_name;
            }
            this.$placeholder.clear().set(values);
        }

        protected getReferralMsgFn = (): string => {
            if(this.$scope.target instanceof Campaign) {
                return this.$placeholder.parse(this.$scope.target.referral_text_message);
            } else {
                return "";
            }
        }

        protected getUrlFn = (options: ISiteOptions): ng.IPromise<ILink> => {
            let self = this;

            return self.$company.getId().then(function (company_id: number) {
                var data = self.getUrlRequestData();

                data.sent_via = options.sent_via;
                data.company_id = company_id;

                if (options.referral && options.referral.id) {
                    data.referral_id = options.referral.id;
                }

                return self.$http({"method":"POST", "url":"/api/v1/links/referral", "data": data}).then(function (x: ng.IHttpPromiseCallbackArg<IApiItemResponse<ILink>>) {
                    return x.data.data;
                })
            });
        }

        protected onNewReferral = (referral: Referral): ng.IPromise<Referral> => {
            // Associate to this target
            let self = this;

            if(self.$scope.contact) {
                return self.$api
                    .show("contacts", self.$scope.contact.id)
                    .store("referrals", _.merge(referral.valueOf(), {
                        campaign_id: self.$scope.target.id,
                        company_id: self.$scope.company.id,
                        owner_id: self.$scope.owner.id,
                    }))
                    .exec()
                    .then(function (resp: IReferral): ng.IPromise<Referral> {
                        var referral = self.ReferralFactory.create(resp);

                        return self.$sms.getSmsHrefObject(self.$scope.options.getMsgFn, self.$scope.options.getUrlFn, referral).then(function (x: ISmsHref): Referral {
                            referral.link = x;
                            return referral;
                        });
                    });
            }
        }

        protected getUrlRequestData = () => {
            var params = <any>{
                campaign_id: _.get(this, "target.id"),
                company_id: null,
                contact_id: _.get(this, "contact.id"),
                sms_batch_id: _.get(this, "link.sms_batch_id"),
                referral_id: null,
                sent_via: null,
                story_caption: _.get(this, "story.caption"),
                story_image: _.get(this, "story.image.id"),
                story_type: _.get(this, "story.type"),
                story_video: _.get(this, "story.video.id"),
                target_id: _.get(this, "target.action_page_id"),
                user_id: _.get(this, "owner.id"),
            };

            return params;
        }

        /**
         * Scrolls the window to the top
         */
        public scrollTop(): void {
            window.scrollTo(0, 0);
        }
    }
}

angular.module('lt.link').controller("RootController", lt.link.states.root.Controller);
