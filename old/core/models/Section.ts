/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-19 13:55:34
*/
/// <reference path="Model.ts" />
namespace lt {
	export class Section extends Model implements ISection {
		background_color?: string;
		button_border_color?: string;
		button_border_radius?: number;
		button_border_width?: number;
		button_color?: string;
		button_icon?: string;
		company_id: number;
		email?: string;
		file?: File;
		file_id?: number;
		font_color?: string;
		font_size?: number;
		name?: string;
		order?: number;
		padding_horizontal?: number;
		padding_vertical?: number;
		phone?: string;
		success_message?: string;
		text?: string;
		text_align?: string;
		type: string;
		url?: string;
		icon?: string;
		video?: IVideo;
		video_id?: number;

		constructor(protected _service: SectionService, protected _data: ISection) {
			super(_service, _data);
		}

		toString(): string {
			return this.name;
		}

		valueOf(): ISection {
			return super.valueOf() as ISection;
		}

		getDefaults(): ISection {
			return _.merge(super.getDefaults(), {
				background_color: "#FFFFFF",
				button_border_color: "#666666",
				button_border_radius: 10,
				button_border_width: 1,
				button_color: "#FFFFFF",
				button_icon: null,
				company_id: null,
				font_color: "#666666",
				font_size: 16,
				padding_horizontal: 14,
				padding_vertical: 14,
				text_align: "center",
				success_message: null,
				type: null,
				icon: null,
			});
		}
	}

	export class SpacerSection extends Section {};
	export class TextSection extends Section {};
	export class TestimonialSection extends Section {};

	// Forwarding
	export class ForwardingSection extends Section {};
	export class SocialSection extends ForwardingSection {};
	export class CollectSection extends ForwardingSection {};
	export class ShareSection extends ForwardingSection {}; 
	
	// Media
	export class MediaSection extends Section {};
	export class StorySection extends MediaSection {};
	export class ImageSection extends MediaSection {};
	export class DocumentSection extends MediaSection {};
	export class PdfSection extends DocumentSection {};
	export class VideoSection extends MediaSection {};
	
	// Buttons
	export class ButtonSection extends Section {};
	export class RegisterSection extends ButtonSection {};
	export class TelSection extends ButtonSection {};
	export class SmsSection extends ButtonSection {};
	export class UrlSection extends ButtonSection {};
	export class MailtoSection extends ButtonSection {};
	export class NavSection extends ButtonSection {};

	// Preview Section
	export class PreviewSection extends Section {
		getDefaults(): ISection {
			return _.merge(super.getDefaults(), {
				padding_horizontal: 0,
				padding_vertical: 0,
			});
		}
	};
	export class IncentivePreviewSection extends PreviewSection {};
	export class SmsPreviewSection extends PreviewSection {};
	export class SocialPreviewSection extends PreviewSection {};

	export class SectionFactory extends ModelFactory {
		static $inject = ["SectionService"];
		constructor(protected _service: SectionService) {
			super(_service);
		}
		create(_data: ISection): Section {
			return this._service.create(_data);
		}
	}

	export class SectionService extends ModelService {
		protected resource: string = "sections";
		
		static $inject = ["$api", "$q", "FileService", "VideoService"];
		constructor(protected $api: IApiService, protected $q: ng.IQService, protected FileService: FileService, protected VideoService: VideoService) {
			super($api, $q);
			this.related.load.file = this.loadFile;
			this.related.load.video = this.loadVideo;
		}

		public create = (_data: ISection): Section => {
			switch (_data.type) {
				case "collect": return new CollectSection(this, _data);
				case "image": return new ImageSection(this, _data);
				case "incentivepreview": return new IncentivePreviewSection(this, _data);
				case "mailto": return new MailtoSection(this, _data);
				case "nav": return new NavSection(this, _data);
				case "pdf": return new PdfSection(this, _data);
				case "register": return new RegisterSection(this, _data);
				case "share": return new ShareSection(this, _data);
				case "sms": return new SmsSection(this, _data);
				case "smspreview": return new SmsPreviewSection(this, _data);
				case "social": return new SocialSection(this, _data);
				case "socialpreview": return new SocialPreviewSection(this, _data);
				case "story": return new StorySection(this, _data);
				case "tel": return new TelSection(this, _data);
				case "testimonial": return new TestimonialSection(this, _data);
				case "video": return new VideoSection(this, _data);
				case "text": return new TextSection(this, _data);
				case "spacer": return new SpacerSection(this, _data);
				case "url": return new UrlSection(this, _data);
				default:
					throw "Unknown type for Section: "+_.get(_data, "type", "null");
			}
		}

		public loadVideo = (m: Section): ng.IPromise<Video> => {
			let x;
			if(m.video_id) {
				x = this.VideoService.show(m.video_id)
			} else {
				x = this.$q.when(null);
			}
			return x.then(this.assignResult<Video>(m, "video", true));
		}

		public loadFile = (m: Section): ng.IPromise<File> => {
			let x;
			if(m.file_id) {
				x = this.FileService.show(m.file_id)
			} else {
				x = this.$q.when(null);
			}
			return x.then(this.assignResult<File>(m, "file", true));
		}

		public show(id: number): ng.IPromise<Section> {
			return super.show(id);
		}

		public index(): ng.IPromise<Section[]> {
			return super.index();
		}

		public indexFor(parentResource: string, parentId: number): ng.IPromise<Section[]> {
			return super.indexFor(parentResource, parentId);
		}

		public destroy(id: number): ng.IPromise<boolean> {
			return super.destroy(id);
		}
	}

	angular.module("lt.core").service("SectionService", SectionService); 
	angular.module("lt.core").service("SectionFactory", SectionFactory); 
}