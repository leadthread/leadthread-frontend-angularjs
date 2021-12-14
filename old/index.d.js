declare var _Event: Event;

declare namespace lt {

	/*=======================================
	=            DATA STRUCTURES            =
	=======================================*/

	export interface IState extends ng.ui.IState {
		title: string;
	}

	export interface ITelephone {

	}

	/* CONTROLS */
	
	export interface IControls {
		
	}

	export interface IControl {
		label: string;
		key?: string;
		value: any;
		type: string;
		icon?: string;
	}

	export interface IButtonControl extends IControl {
		button_label: string;
		button_type: string;
	}

	export interface ISelectControl<T> extends IControl {
		options: ISelectControlOption<T>[];
	}

	export interface ISelectControlOption<T> {
		value: T;
		label: string;
	}

	/* API RESPONSES */

	export interface IApiListResponse<T> extends IApiResponse {
		data: T[],
		links?: {
			first: string,
			last: string,
			prev: string,
			next: string,
		},
		meta?: {
			current_page: number,
			from: number,
			last_page: number,
			path: string,
			per_page: number,
			to: number,
			total: number,
		},
	}

	export interface IApiItemResponse<T> extends IApiResponse {
		data: T,
	}

	export interface IApiCountResponse extends IApiResponse {
		data: number,
	}

	export interface IApiResponse {
		
	}

	export interface ISmsHref {
		href: string;
		url: string;
		message: string;
		phone: ITelephone;
	}

	export interface IPopupField {
		key: string;
		label: string;
		maxlength?: number;
		minlength?: number;
		choices?: {
			[label: string]: string|boolean;
		}
		required: boolean;
		subtype: string;
		type: string;
		value: any;
	}

	export interface IPerson {
		company?: string;
		email: string;
		first_name: string;
		last_name: string;
		phone: string|ITelephone;
		sent?: boolean;
		href?: string;
		link?: ILink;
	}

	export interface IUrlOptions {
		sent_via: string;
		person?: IPerson;
	}

	export interface ISiteOptions {
		getCampaignId(): number;
		getMsgFn(): string;
		getUrlFn(options: IUrlOptions): ng.IPromise<ILink>;
		onNewReferral(referral: IReferral): ng.IPromise<IReferral>;
		contact: IContact;
		link: ILink;
		owner: IUser;
		referral: IReferral;
		sent_via: string;
		story: IStory;
		preview?: boolean;
		collectCompany?: boolean;
		incentive: IIncentive;
		color: string;
		type: string;
	}

	export interface IModelServiceRelatedIndex {
		load: {
			[property: string]: <T extends IModel>(m: T) => ng.IPromise<T|T[]>;
		}
		save: {
			before: {
				[property: string]: <T extends IModel>(m: T, include: string[]|boolean) => ng.IPromise<T|T[]>
			}
			after: {
				[property: string]: <T extends IModel>(m: T, include: string[]|boolean) => ng.IPromise<T|T[]>
			}
		}
	}

	export interface IFactory {
		create<T, K>(data: T): K 
	}

	export interface ICampaignTransformer {
		toForm(campaign: ICampaign): ICampaignForm;
		toCampaign(form: ICampaignForm): ng.IPromise<ICampaign>;
		getCampaignInstance(): ICampaign;
	}

	export interface ICampaignForm {
		getField(name: string): ICampaignFormField;
		getFieldValue(name: string): any;
		setFieldValue(name: string, value: any): void;
		type: string;
		version: number;
	}

	export interface ICampaignFormTableOfContents {
		[group: string]: ICampaignFormTableOfContentsItem;
	}

	export interface ICampaignFormTableOfContentsItem {
		
	}

	export interface ICampaignFormSubGroup {
		description?: string;
		questions: ICampaignFormField[];
	}

	export interface ICampaignFormGroup {
		[group: string]: ICampaignFormSubGroup;
	}

	export interface ICampaignFormForm {
		[group: string]: ICampaignFormGroup;
	}

	export interface ICampaignFormField {
		depend?: {name: string, value: any};
		description: string;
		displayName: string;
		limitTo?: number;
		name: string;
		note?: string;
		placeholders?: boolean;
		show:boolean;
		type: string;
		value: any;
		options?: any;
		valid: boolean | Function;
		required: boolean | Function;
	}

	export interface ICampaignButtonFormFieldButton {
		text: string;
		button_icon: string;
		type: string;
		url: string;
		phone: string;
		email: string;
		success_message: string;
	}

	export interface IStyle {}

	/*=====  End of DATA STRUCTURES  ======*/

	/*==============================
	=            MODELS            =
	==============================*/

	export interface IModel {
		id?: number;
		created_at?: string;
		updated_at?: string;		
	}

	export interface IEvent extends IModel {
		link_id?: number;
		type: string;
		referral_id?: number;
	}

	export interface IPlaylist extends IModel {
	}

	export interface IPlaylistSchedule extends IModel {
		playlist_id: number;
	}

	export interface IThread extends IModel {
		company_id: number;
		name: string;
		site?: ISite;
		site_id?: number;
		type: string;
		brand: IBrand;
		brand_id: number;
	}

	export interface ICampaign extends IThread {
		action_page?: IActionPage;
		action_page_id?: number;
		owner_id: number;
		channel?: string;
		contact_text_message?: string;
		referral_text_message?: string;
		social_message?: string;
		type: string;
		is_phone_app: boolean;
		content_sharing: boolean;
		target: string;
		incentive: IIncentive;
		incentive_id: number;
		version: number;
		keyword?: string;
	}

	export interface ILink extends IModel {
		target_id: number;
		target_type: string;
		sent_via: string;
		contact_id: number;
		long_url: string;
		keyword_url?: string;
		short_url: string;
	}

	export interface ISmsBatch extends IModel {
		count: number;
		created_at: string;
		campaign_id: number;
		campaign: ICampaign;
	}

	export interface IRole extends IModel {
		name: string;
	}

	export interface IMemoryPrompt extends IModel {
		order: number;
	}

	export interface ISection extends IModel, IStyle {
		background_color?: string;
		button_border_color?: string;
		button_border_radius?: number;
		button_border_width?: number;
		button_color?: string;
		button_icon?: string;
		company_id: number;
		email?: string;
		file_id?: number;
		file?: IFile;
		font_color?: string;
		font_size?: number;
		icon?: string;
		name?: string;
		order?: number;
		padding_horizontal?: number;
		padding_vertical?: number;
		phone?: string;
		success_message?: string;
		text_align?: string;
		text?: string;
		type: string;
		url?: string;
		video_id?: number;
		video?: IVideo;
	}

	export interface IStory extends IModel {
		type: string;
		video: IVideo;
		image: IImage;
		caption: string;
	}

	export interface ISite extends IModel {
		name:string;
		pages: IPage[];
		type:string;
		company_id: number;
	}

	export interface IPage extends IModel {
		order: number;
		sections: ISection[];
		type:string;
		background_color:string;
		company_id: number;
		name: string;
		site_id: number;
	}

	export interface IActionPage extends IThread {}
	export interface ICompany extends IModel {
		name: string;
		brand: Brand;
		brand_id: number;
		disabled_at: string;
		type: string;
	}
	export interface IPoint extends IModel {
		type: string;
		contact_id: number;
		sms_batch_id: number;
	}
	export interface IContact extends IPerson, IModel {
		sent?: boolean;
		link?: ISmsHref;
		selected?: boolean;
		points?: IPoint[];
	}
	export interface IContactList extends IModel {
		count?: number;
		selected?: boolean;
		company_id: number;
		user_id: number;
		name: string;
	}
	export interface IBrand extends IModel {
		name: string;
		logo_id: number;
		logo: IFile;
		favicon_id: number;
		favicon: IFile;
		domain: string;
		color: string;
		company_id: number;
		logo_background_color: string;
		homepage_url: string;
	}
	export interface IFile extends IModel {
		mime?: string;
		fingerprint: string;
	}
	export interface IImage extends IFile {}
	export interface IDocument extends IFile {}
	export interface IIncentive extends IModel {
		text: string;
		media?: IImage|IVideo|IFile;
		media_id?: number;
		media_type?: string;
	}
	export interface IReferral extends IPerson, IModel {
		contact_id: number;
		is_lead: boolean;
	}
	export interface IRole extends IModel {
		name: string;
	}
	export interface IUser extends IPerson, IModel {}
	export interface IVideo extends IModel {}

	/*=====  End of MODELS  ======*/

	/*================================
	=            SERVICES            =
	================================*/

	export interface IApiService {
		index(resource: string, params?: _.Dictionary<any>): this;
		paginate(resource: string, page?: number, limit?: number , params?: _.Dictionary<any>): this
		count(resource: string, params?: _.Dictionary<any>): this;
		show(resource: string, id: number): this;
		store(resource: string, model: IModel): this;
		update(resource: string, model: IModel): this;
		destroy(resource: string, id: number): this;
		withDeleted(include?: boolean): this;
		exec<T extends IApiResponse>(minutes?: number, canceler?: ng.IDeferred<any>): ng.IPromise<T>;
	}

	export interface IAuthService {
		logout(): ng.IPromise<boolean>;
		isAdmin(): ng.IPromise<boolean>;
		isSuperAdmin(): ng.IPromise<boolean>;
		getUser(): IUser;
		getUserId(): number;
		hasRole(role: string): ng.IPromise<boolean>;
	}

	export interface ITitleService {
		setTitle(title: string): void;
	}

	export interface ICompanyService {
		getId(): ng.IPromise<number>;
		setCompany(m: Company): void;
		getColor(): ng.IPromise<string>;
		getLogo(): ng.IPromise<IImage>;
		getLogoBackgroundColor(): ng.IPromise<string>;
	}

	export interface IDeviceService {
		isDesktop(): boolean;
		isApple(): boolean;
		iOSVersion(): number;
		isMobile(): boolean;
	}

	export interface IFaviconService {
		changeFavicon(id: number): void;
	}

	export interface IPopupService {
		form(form: IPopupField[], prompt: string, showCopyPasteHelper?: boolean, size?: string): ng.IPromise<any>
		textarea(key: string, value: number|string, prompt: string, label?: string, minlength?: number, maxlength?: number): ng.IPromise<any>;
		info(title: string, text: string, buttonText?: string): ng.IPromise<any>;
		contacts(contacts: IContact[]): ng.IPromise<IContact[]>;
		incentive(incentive: IIncentive): ng.IPromise<any>;
		sendCampaign(options: {
			count: number,
			campaign: Campaign
		}): ng.IPromise<any>;
		sendPlaylist(options: {
			count: number,
			playlist: Playlist
		}): ng.IPromise<any>;
		while<T extends ng.IPromise<any>>(promise: T, text: string): T;
	}

	export interface INotificationService {
		success(title?: string, body?: string): void;
		error(title?: string, body?: string): void;
	}

	export interface ISmsService {
		sendInvite (contactIds: number|number[], message: string, company_id: number, campaign_id: number, user_id?: number): ng.IPromise<any>;
		getSmsHref(message: string|Function, url?: string|Function, person?: IPerson, includeResend?: boolean): ng.IPromise<string>
		getSmsHrefObject(message: string|Function, url?: string|Function, person?: IPerson, includeResend?: boolean): ng.IPromise<ISmsHref>
	}

	export interface ICampaignService {
		showOrCreate(id: number, search: ICampaign): ng.IPromise<Campaign>;
	}

	export interface IPlaceholderService {
		parse(input: string): string;
		clear(): IPlaceholderService;
		set(values: {
			[propName: string]: string;
		}): IPlaceholderService;
	}

	export interface ICacheService {
		has(key: string): boolean;
		remember<T>(key: string, minutes: number, callback: () => ng.IPromise<T>|ng.IHttpPromise<T>|T, useLocalStorage?: boolean): ng.IPromise<T>;
		forget(key: string): void;
		forgetWhere(key: string): void;
	}

	export interface IStorageService {
		get(key: string): any;
		getAllStoredItems(): any[];
		remove(key: string): void;
		removeWhere(key: string): void;
		set(key: string, value: any): void;
	}

	export interface ITitleService {
		setTitle(title: string): void;
		getTitle(): string;
	}

	export interface IStateService extends ng.ui.IStateService {
		current: IState;
	}

	export interface ICampaignRepositoryService {
		addCampaign(campaign: ICampaign): void;
		load(companyId: number): ng.IPromise<ICampaign[]> ;
	}

	export interface ICampaignDatabaseService {
		save(campaign: ICampaign): ng.IPromise<ICampaign>;
	}

	export interface IModelService {
		create(data: IModel): Model;
		destroy(id: number): ng.IPromise<boolean>;
		index(): ng.IPromise<Model[]>;
		indexFor(parentResource: string, parentId: number): ng.IPromise<Model[]>;
		load<T extends Model>(model: T, include: string[]|boolean): ng.IPromise<T>;
		show(id: number): ng.IPromise<Model>;
		showOrCreate(id: number, search: IModel): ng.IPromise<Model>;
		save<T>(model: T, include: string[]|boolean): ng.IPromise<T>;
		saveFor<T>(parentResource: string, parentId: number, model: T, include: string[]|boolean): ng.IPromise<Model>;
	}

	export interface IJobService {
		handle(jobId: number, jobName: string): ng.IPromise<any>;
	}

	export interface ISocketService {
		subscribe(channel: string): any;
		unsubscribe(channel: string): void;
	}

	/*=====  End of SERVICES  ======*/	
}