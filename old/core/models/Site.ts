/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:54:50
*/
/// <reference path="Model.ts" />
/// <reference path="Page.ts" />
namespace lt {
	export class Site extends Model implements ISite {
		public pages: Page[];
		public name: string;
		public type: string;
		public company_id: number;

		constructor(protected _service: SiteService, protected _data: ISite) {
			super(_service, _data);
			this.pages = this.pages || [];
		}

		toString(): string {
			return this.name;
		}

		createPage<T extends Page>(type: string, options: _.Dictionary<any> = {}): T {
			return this._service.createPage<T>(this, type, options);
		}

		setPage(page: Page, find: any): void {
			// Find item index using indexOf+find
			var index = _.indexOf(this.pages, _.find(this.pages, find));

			if (index !== -1) {
				// Replace item at index using native splice
				this.pages.splice(index, 1, page);
			} else {
				this.pages.push(page);
			}
		}

		deletePage(find: any) {
			var page = _.find(this.pages, find);
			if (page) {
				return page.destroy().then(() => {
					_.remove(this.pages, find);
				});
			}
		}

		getPage<T extends Page>(find: any): T {
			let page = _.find(this.pages, find);
			return page as T;
		}

		getPages<T extends Page[]>(find: any): T {
			return _.filter(this.pages, find) as T;
		}

		getActionPagePage(): ActionPagePage {
			var p: ActionPagePage = this.getPage<ActionPagePage>((m: Page) => {
				return m.type === 'action';
			});

			return (p ? p : this.createPage<ActionPagePage>("action"));
		}

		setActionPagePage(m: ActionPagePage): void {
			if (m instanceof ActionPagePage) {
				return this.setPage(m, function (p: Page) {
					return p instanceof ActionPagePage;
				});
			}
		}

		getIntroPage(): IntroPage {
			var p: IntroPage = this.getPage<IntroPage>((m: Page) => {
				return m.type === 'intro';
			});

			return (p ? p : this.createPage<IntroPage>("intro"));
		}

		setIntroPage(m: IntroPage): void {
			if (m instanceof IntroPage) {
				return this.setPage(m, function (p: Page) {
					return p instanceof IntroPage;
				});
			}
		}

		getSharePage(): SharePage {
			var p: SharePage = this.getPage<SharePage>((m: Page) => {
				return m.type === "share";
			});

			return (p ? p : this.createPage<SharePage>("share"));
		}

		setSharePage(m: SharePage): void {
			if (m instanceof SharePage) {
				return this.setPage(m, function (p: Page) {
					return p instanceof SharePage;
				});
			}
		}

		getMemoryPromptPage(name: string = null): MemoryPromptPage {
			var p: MemoryPromptPage = this.getPage<MemoryPromptPage>((m: Page) => {
				return m.type === 'prompt' && (name ? m.name === name : true);
			});

			let opts: _.Dictionary<any> = {};
			if (name) {
				opts.name = name
			}

			return (p ? p : this.createPage<MemoryPromptPage>("prompt", opts));
		}

		setMemoryPromptPage(key: string, page: MemoryPromptPage) {
			if (page instanceof MemoryPromptPage) {
				return this.setPage(page, (p: Page) => {
					return p instanceof MemoryPromptPage && p.name === key;
				});
			}
		}

		getMemoryPromptPages(): MemoryPromptPage[] {
			var p: MemoryPromptPage[] = this.getPages<MemoryPromptPage[]>((m: Page) => {
				return m.type === 'prompt';
			});

			return (p ? p : []);
		}

		getThankYouPage() {
			var p: ThankYouPage = this.getPage<ThankYouPage>((m: Page) => {
				return m.type === 'thank';
			});

			return (p ? p : this.createPage<ThankYouPage>("thank"));
		}

		setThankYouPage(page: ThankYouPage) {
			if (page instanceof ThankYouPage) {
				return this.setPage(page, function (p: Page) {
					return p instanceof ThankYouPage;
				});
			}
		}
	}

	export class PreviewSite extends Site {
		// PreviewSite specific functions go here
		getSmsPreviewPage() {
			var p: SmsPreviewPage = this.getPage<SmsPreviewPage>((m: Page) => {
				return m.type === 'smspreview';
			});

			return (p ? p : this.createPage<SmsPreviewPage>("smspreview"));
		};
		
		setSmsPreviewPage(m: SmsPreviewPage) {
			if (m instanceof SmsPreviewPage) {
				return this.setPage(m, function (p: Page) {
					return p instanceof SmsPreviewPage;
				});
			}
		};

		getSocialPreviewPage() {
			var p: SocialPreviewPage = this.getPage<SocialPreviewPage>((m: Page) => {
				return m.type === 'socialpreview';
			});

			return (p ? p : this.createPage<SocialPreviewPage>("socialpreview"));
		};

		setSocialPreviewPage(m: SocialPreviewPage) {
			if (m instanceof SocialPreviewPage) {
				return this.setPage(m, function (p: Page) {
					return p instanceof SocialPreviewPage;
				});
			}
		};

		getIncentivePreviewPage() {
			var p: IncentivePreviewPage = this.getPage<IncentivePreviewPage>((m: Page) => {
				return m.type === 'incentivepreview';
			});

			return (p ? p : this.createPage<IncentivePreviewPage>("incentivepreview"));
		};

		setIncentivePreviewPage(m: IncentivePreviewPage) {
			if (m instanceof IncentivePreviewPage) {
				return this.setPage(m, function (p: Page) {
					return p instanceof IncentivePreviewPage;
				});
			}
		};
	};

	export class ReferralThreadSite extends Site {};
	export class LeaderboardSite extends Site {};
	export class ActionPageSite extends Site {};
	export class MessageThreadSite extends Site {};
	export class ReachSite extends Site {};
	export class RecognitionSite extends Site {};
	export class ReviewSite extends Site {};
	export class TestimonialThreadSite extends Site {};

	export class SiteFactory extends ModelFactory {
		static $inject = ["SiteService"];
		constructor(protected _service: SiteService) {
			super(_service);
		}
		create(_data: ISite): Site {
			return this._service.create(_data);
		}
	}

	export class SiteService extends ModelService {
		protected resource: string = "sites";
		
		static $inject = ["$api", "$q", "PageService", "$stateParams"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected PageService: PageService, protected $stateParams: ng.ui.IStateParamsService) {
			super($api, $q);
			this.related.load = {
				pages: this.loadPages
			}
			this.related.save.after.pages = this.savePages;
		}

		public create = (_data: ISite): Site => {
			switch (_data.type) {
			case "preview":
				return new PreviewSite(this, _data);
			case "referral-thread":
				return new ReferralThreadSite(this, _data);
			case "leaderboard":
				return new LeaderboardSite(this, _data);
			case "testimonial-thread":
				return new TestimonialThreadSite(this, _data);
			case "message-thread":
				return new MessageThreadSite(this, _data);
			case "reach":
				return new ReachSite(this, _data);
			case "recognition":
				return new RecognitionSite(this, _data);
			case "review":
				return new ReviewSite(this, _data);
			case "action":
				return new ActionPageSite(this, _data);
			default:
				throw "Unknown type for Site: "+_.get(_data, "type", "null");
			}
		}

		public beforeSave(m: Site): Site {
			m.company_id = m.company_id || this.$stateParams.companyId;
			return m;
		}

		public loadPages = (m: Site): ng.IPromise<Page[]> => {
			if(m.id) {
				return this.PageService.indexFor(this.resource, m.id).then(this.assignResult<Page[]>(m, "pages")); 
			} else {
				return this.$q.when([]);
			}
		}

		public showOrCreate(id: number, search: ISite): ng.IPromise<Site> {
			return super.showOrCreate(id, search);
		}

		public show(id: number): ng.IPromise<Site> {
			return super.show(id);
		}

		public index(): ng.IPromise<Site[]> {
			return super.index();
		}

		public indexFor(parentResource: string, parentId: number): ng.IPromise<Site[]> {
			return super.indexFor(parentResource, parentId);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}

		public createPage<T extends Page>(m: Site, type: string, options: _.Dictionary<any> = {}): T {
			let page: IPage = {
				type: type,
				order: 0,
				sections: [],
				background_color: "#FFFFFF",
				company_id: m.company_id,
				name: null,
				site_id: m.id,
			};

			return this.PageService.create(_.merge(page, options)) as T;
		}

		public savePages = (m: Site, include: string[]|boolean = false): ng.IPromise<Page[]> => {
			let p: ng.IPromise<Page>[] = [];
			_.forEach(m.pages, (page) => {
				p.push(this.PageService.saveFor(this.resource, m.id, page, include))
			});
			return this.$q.all(p);
		}
	}

	angular.module("lt.core").service("SiteService", SiteService); 
	angular.module("lt.core").service("SiteFactory", SiteFactory); 
}