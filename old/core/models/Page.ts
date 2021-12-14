/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:56:00
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Page extends Model implements IPage {
		order: number;
		sections: Section[];
		type:string;
		background_color:string;
		company_id: number;
		name: string;
		site_id: number;

		constructor(protected _service: PageService, protected _data: IPage) {
			super(_service, _data);
			this.sections = this.sections || [];
		}

		toString(): string {
			return this.name;
		}

		createSection(_data: ISection): Section {
			return this._service.createSection(_data);
		}

		addSection(find: _.Dictionary<any>, params: _.Dictionary<any>)
		{
			let section = this.getSection(find);
			section = (section ? section : this.createSection(find as ISection));

			for (let key in params) {
				section[key] = params[key];
			}
			for (let key in find) {
				section[key] = find[key];
			}
			
			this.setSection(section, find);
		}

		setSection(section: Section, find: any): Section {
			// Find item index using indexOf+find
			var index = _.indexOf(this.sections, _.find(this.sections, find));

			if (index !== -1) {
				// Replace item at index using native splice
				this.sections.splice(index, 1, section);
				// this.sections[index] = section;
			} else {
				this.sections.push(section);
			}

			return section;
		}

		getSection(find: any): Section {
			return _.find(this.sections, find);
		}

		getSections(find: any): Section[] {
			return _.filter(this.sections, find);
		}

		getButtonSection(find: any) {
			let p;
			if (find) {
				p = this.getSection(find);
			}
			return (p ? p : this.createSection({type: "tel", company_id: this.company_id}));
		}

		getButtonSections(name: string = null): ButtonSection[] {
			return this.getSections((s: Section) => {
				return s instanceof ButtonSection && (name ? _.includes(s.name, name) : true);
			});
		}

		setButtonSection(find: any, section: ButtonSection) {
			if (section instanceof ButtonSection) {
				return this.setSection(section, find);
			}
		}

		deleteSection(find: any): ng.IPromise<boolean> {
			return this.deleteSections(find);
		}

		deleteSections(find: any): ng.IPromise<boolean> {
			return this._service.deleteSections(this, find);
		}
	}

	export class IntroPage extends Page {
		getMediaSection(): MediaSection {
			var p = this.getSection((p: Section) => {
				return p instanceof MediaSection;
			});

			return (p ? p : this.createSection({type: "image", company_id: this.company_id}));
		}
		
		setMediaSection(section: MediaSection): MediaSection {
			if (section instanceof MediaSection) {
				return this.setSection(section, (p: Section) => {
					return p instanceof MediaSection;
				});
			}
		}

		getHeaderSection(): TextSection {
			var p = this.getSection(function (p: Section) {
				return p.type === "text" && p.name === "intro_header";
			});

			return (p ? p : this.createSection({type: "text", company_id: this.company_id}));
		}

		setHeaderSection(section: TextSection) {
			if (section.type === "text") {
				return this.setSection(section, function (p: Section) {
					return p.type === "text" && p.name === "intro_header";
				});
			}
		}

		getBodySection() {
			let p = this.getSection((p: Section) => {
				return p.type === "text" && p.name === "intro_body";
			});

			return (p ? p : this.createSection({type: "text", name: "intro_body", company_id: this.company_id}));
		}

		setBodySection(section: TextSection) {
			if (section.type === "text") {
				return this.setSection(section, (p: Section) => {
					return p.type === "text" && p.name === "intro_body";
				});
			}
		}

		getFooterSection() {
			let p = this.getSection((p: Section) => {
				return p.type === "text" && p.name === "intro_footer";
			});

			return (p ? p : this.createSection({type: "text", name: "intro_footer", company_id: this.company_id}));
		}

		setFooterSection(section: TextSection) {
			if (section.type === "text") {
				return this.setSection(section, (p: Section) => {
					return p.type === "text" && p.name === "intro_footer";
				});
			}
		}

		getTestimonialSection() {
			let p = this.getSection((p: Section) => {
				return p.type === "testimonial" && p.name === "intro_testimonial";
			});

			return (p ? p : this.createSection({type: "testimonial", name: "intro_testimonial", company_id: this.company_id}));
		}

		setTestimonialSection(section: TestimonialSection) {
			if (section.type === "testimonial") {
				return this.setSection(section, function (p: Section) {
					return p.type === "testimonial" && p.name === "intro_testimonial";
				});
			}
		}
	}

	export class ThankYouPage extends Page {
		getHeaderSection(): TextSection {
			var p = this.getSection(function (p: Section) {
				return p.type === "text" && p.name === "thanks_header";
			});

			return (p ? p : this.createSection({type: "text", company_id: this.company_id}));
		}

		setHeaderSection(section: TextSection) {
			if (section.type === "text") {
				return this.setSection(section, function (p: Section) {
					return p.type === "text" && p.name === "thanks_header";
				});
			}
		}

		getBodySection() {
			let p = this.getSection((p: Section) => {
				return p.type === "text" && p.name === "thanks_body";
			});

			return (p ? p : this.createSection({type: "text", name: "thanks_body", company_id: this.company_id}));
		}

		setBodySection(section: TextSection) {
			if (section.type === "text") {
				return this.setSection(section, (p: Section) => {
					return p.type === "text" && p.name === "thanks_body";
				});
			}
		}
	}

	export class PreviewPage extends Page {
		getSocialPreviewSection() {
			let p = this.getSection((p: Section) => {
				return p instanceof SocialPreviewSection && p.name === "socialpreview";
			});

			return (p ? p : this.createSection({type: "socialpreview", name: "socialpreview", company_id: this.company_id}));
		}

		setSocialPreviewSection(section: SocialPreviewSection) {
			if (section instanceof SocialPreviewSection) {
				return this.setSection(section, (p: Section) => {
					return p instanceof SocialPreviewSection && p.name === "socialpreview";
				});
			}
		}

		getSmsPreviewSection() {
			let p = this.getSection((p: Section) => {
				return p instanceof SmsPreviewSection && p.name === "smspreview";
			});

			return (p ? p : this.createSection({type: "smspreview", name: "smspreview", company_id: this.company_id}));
		}

		setSmsPreviewSection(section: SmsPreviewSection) {
			if (section instanceof SmsPreviewSection) {
				return this.setSection(section, (p: Section) => {
					return p instanceof SmsPreviewSection && p.name === "smspreview";
				});
			}
		}

		getIncentivePreviewSection() {
			let p = this.getSection((p: Section) => {
				return p instanceof IncentivePreviewSection && p.name === "incentivepreview";
			});

			return (p ? p : this.createSection({type: "incentivepreview", name: "incentivepreview", company_id: this.company_id}));
		}

		setIncentivePreviewSection(section: IncentivePreviewSection) {
			if (section instanceof IncentivePreviewSection) {
				return this.setSection(section, (p: Section) => {
					return p instanceof IncentivePreviewSection && p.name === "incentivepreview";
				});
			}
		}
	}

	export class SocialPreviewPage extends PreviewPage {
	}

	export class SmsPreviewPage extends PreviewPage {
	}

	export class IncentivePreviewPage extends PreviewPage {
	}

	export class MemoryPromptPage extends Page {
		getImageSection() {
			var p = this.getSection((p: Section) => {
				return p.type === "image" && p.name === this.name+"_img";
			});

			return (p ? p : this.createSection({type: "image", company_id: this.company_id}));
		}
		getBodySection() {
			var p = this.getSection((p: Section) => {
				return p.type === "text" && p.name === this.name+"_text";
			});

			return (p ? p : this.createSection({type: "text", company_id: this.company_id}));
		}
		getNavSection() {
			var p = this.getSection((p: Section) => {
				return p.type === "nav" && p.name === this.name+"_nav";
			});

			return (p ? p : this.createSection({type: "nav", company_id: this.company_id}));
		}
		setImageSection(section: ImageSection) {
			if (section.type === "image") {
				return this.setSection(section, (p: Section) => {
					return p.type === "image" && p.name === this.name+"_img";
				});
			}
		}
		setBodySection(section: TextSection) {
			if (section.type === "text") {
				return this.setSection(section, (p: Section) => {
					return p.type === "text" && p.name === this.name+"_text";
				});
			}
		}
		setNavSection(section: NavSection) {
			if (section.type === "nav") {
				return this.setSection(section, (p: Section) => {
					return p.type === "nav" && p.name === this.name+"_nav";
				});
			}
		}
	}

	export class SharePage extends Page {
		getShareSection(): ShareSection {
			var p = this.getSection((p: Section) => {
				return p.type === "share";
			});

			return (p ? p : this.createSection({type: "share", company_id: this.company_id}));
		}

		setShareSection(section: ShareSection) {
			if (section.type === "share") {
				return this.setSection(section, (p: Section) => {
					return p.type === "share";
				});
			}
		}
	}

	export class ActionPagePage extends Page {
		getStorySection() {
			let p = this.getSection((p: Section) => {
				return p.type === "story"
			});

			return (p ? p : this.createSection({type: "story", company_id: this.company_id}));
		}
		getBodySection() {
			let p = this.getSection((p: Section) => {
				return p.type === "text" && p.name === "action_body";
			});

			return (p ? p : this.createSection({type: "text", name: "action_body", company_id: this.company_id}));
		}
		getFooterSection() {
			let p = this.getSection((p: Section) => {
				return p.type === "text" && p.name === "action_footer";
			});

			return (p ? p : this.createSection({type: "text", name: "action_footer", company_id: this.company_id}));
		}

		setStorySection(section: StorySection) {
			if (section.type === "story") {
				return this.setSection(section, (p: Section) => {
					return p.type === "story"
				});
			}
		}
		setBodySection(section: TextSection) {
			if (section.type === "text") {
				return this.setSection(section, (p: Section) => {
					return p.type === "text" && p.name === "action_body";
				});
			}
		}
		setFooterSection(section: TextSection) {
			if (section.type === "text") {
				return this.setSection(section, (p: Section) => {
					return p.type === "text" && p.name === "action_footer";
				});
			}
		}
	};

	export class PageFactory extends ModelFactory {
		static $inject = ["PageService"];
		constructor(protected _service: PageService) {
			super(_service);
		}
		create(_data: IPage): Page {
			return this._service.create(_data);
		}
	}

	export class PageService extends ModelService {
		protected resource: string = "pages";
		
		static $inject = ["$api", "$q", "SectionFactory", "SectionService"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected SectionFactory: SectionFactory, protected SectionService: SectionService) {
			super($api, $q);
			this.related.load.sections = this.loadSections;
			this.related.save.after.sections = this.saveSections;
		}

		public create = (_data: IPage): Page => {
			switch (_data.type) {
				case "action":
					return new ActionPagePage(this, _data);
				case "intro":
					return new IntroPage(this, _data);
				case "share":
					return new SharePage(this, _data);
				case "smspreview":
					return new SmsPreviewPage(this, _data);
				case "incentivepreview":
					return new IncentivePreviewPage(this, _data);
				case "socialpreview":
					return new SocialPreviewPage(this, _data);
				case "thank":
					return new ThankYouPage(this, _data);
				default:
					throw "Unknown type for Page: "+_.get(_data, "type", "null");
			}
		}

		public show(id: number): ng.IPromise<Page> {
			return super.show(id);
		}

		public index(): ng.IPromise<Page[]> {
			return super.index();
		}

		public indexFor(parentResource: string, parentId: number): ng.IPromise<Page[]> {
			return super.indexFor(parentResource, parentId);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}

		public loadSections = (m: Page): ng.IPromise<Section[]> => {
			return this.SectionService.indexFor(this.resource, m.id).then(this.assignResult<Section[]>(m, "sections"));
		}

		public deleteSections(m: Page, find: any): ng.IPromise<boolean> {
			let sections = m.getSections(find);
			let promises: ng.IPromise<boolean>[] = [];

			if (sections) {
				promises = _.map(sections, (section) => {
					return section.destroy();
				});
			}

			return this.$q.all(promises).then((results: boolean[]) => {
				_.remove(m.sections, find);
				return true;
			});
		}

		public createSection(_data: ISection): Section {
			return this.SectionFactory.create(_data);
		}

		public saveSections = (m: Page, include: string[]|boolean = false): ng.IPromise<Section[]> => {
			let p: ng.IPromise<Section>[] = [];
			_.forEach(m.sections, (sections) => {
				p.push(this.SectionService.saveFor(this.resource, m.id, sections, include))
			});
			return this.$q.all(p);
		}
	}

	angular.module("lt.core").service("PageService", PageService); 
	angular.module("lt.core").service("PageFactory", PageFactory); 
}