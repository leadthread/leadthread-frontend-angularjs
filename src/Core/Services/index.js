export * as Api from "./Api"
export * as App from "./App"
export * as Auth from "./Auth"
export * as Cache from "./Cache"
export * as Device from "./Device"
export * as HtmlTitle from "./HtmlTitle"
export * as ModalSms from "./ModalSms"
export * as Notification from "./Notification"
export * as Placeholder from "./Placeholder"
export * as Sms from "./Sms"
export * as TextInsert from "./TextInsert"

import {
	ActionPageServiceClass,
	ActionPageFactoryClass,
	BrandServiceClass,
	BrandFactoryClass,
	CampaignServiceClass,
	CampaignFactoryClass,
	CompanyServiceClass,
	CompanyFactoryClass,
	ContactServiceClass,
	ContactFactoryClass,
	EventServiceClass,
	EventFactoryClass,
	FileServiceClass,
	FileFactoryClass,
	IncentiveServiceClass,
	IncentiveFactoryClass,
	LinkServiceClass,
	LinkFactoryClass,
	PageServiceClass,
	PageFactoryClass,
	PlaylistServiceClass,
	PlaylistFactoryClass,
	PlaylistScheduleServiceClass,
	PlaylistScheduleFactoryClass,
	PointServiceClass,
	PointFactoryClass,
	ReferralServiceClass,
	ReferralFactoryClass,
	RoleServiceClass,
	RoleFactoryClass,
	SectionServiceClass,
	SectionFactoryClass,
	SiteServiceClass,
	SiteFactoryClass,
	SmsBatchServiceClass,
	SmsBatchFactoryClass,
	StoryServiceClass,
	StoryFactoryClass,
	ThreadServiceClass,
	ThreadFactoryClass,
	UserServiceClass,
	UserFactoryClass,
	VideoServiceClass,
	VideoFactoryClass,
} from "../Classes"

export const ActionPageService = {
	key: "ActionPageService",
	fn: ActionPageServiceClass,
}
export const BrandService = { key: "BrandService", fn: BrandServiceClass }
export const CampaignService = {
	key: "CampaignService",
	fn: CampaignServiceClass,
}
export const CompanyService = { key: "CompanyService", fn: CompanyServiceClass }
export const ContactService = { key: "ContactService", fn: ContactServiceClass }
export const EventService = { key: "EventService", fn: EventServiceClass }
export const FileService = { key: "FileService", fn: FileServiceClass }
export const IncentiveService = {
	key: "IncentiveService",
	fn: IncentiveServiceClass,
}
export const LinkService = { key: "LinkService", fn: LinkServiceClass }
export const PageService = { key: "PageService", fn: PageServiceClass }
export const PlaylistService = {
	key: "PlaylistService",
	fn: PlaylistServiceClass,
}
export const PlaylistScheduleService = {
	key: "PlaylistScheduleService",
	fn: PlaylistScheduleServiceClass,
}
export const PointService = { key: "PointService", fn: PointServiceClass }
export const ReferralService = {
	key: "ReferralService",
	fn: ReferralServiceClass,
}
export const RoleService = { key: "RoleService", fn: RoleServiceClass }
export const SectionService = { key: "SectionService", fn: SectionServiceClass }
export const SiteService = { key: "SiteService", fn: SiteServiceClass }
export const SmsBatchService = {
	key: "SmsBatchService",
	fn: SmsBatchServiceClass,
}
export const StoryService = { key: "StoryService", fn: StoryServiceClass }
export const ThreadService = { key: "ThreadService", fn: ThreadServiceClass }
export const UserService = { key: "UserService", fn: UserServiceClass }
export const VideoService = { key: "VideoService", fn: VideoServiceClass }

export const ActionPageFactory = {
	key: "ActionPageFactory",
	fn: ActionPageFactoryClass,
}
export const BrandFactory = { key: "BrandFactory", fn: BrandFactoryClass }
export const CampaignFactory = {
	key: "CampaignFactory",
	fn: CampaignFactoryClass,
}
export const CompanyFactory = { key: "CompanyFactory", fn: CompanyFactoryClass }
export const ContactFactory = { key: "ContactFactory", fn: ContactFactoryClass }
export const EventFactory = { key: "EventFactory", fn: EventFactoryClass }
export const FileFactory = { key: "FileFactory", fn: FileFactoryClass }
export const IncentiveFactory = {
	key: "IncentiveFactory",
	fn: IncentiveFactoryClass,
}
export const LinkFactory = { key: "LinkFactory", fn: LinkFactoryClass }
export const PageFactory = { key: "PageFactory", fn: PageFactoryClass }
export const PlaylistFactory = {
	key: "PlaylistFactory",
	fn: PlaylistFactoryClass,
}
export const PlaylistScheduleFactory = {
	key: "PlaylistScheduleFactory",
	fn: PlaylistScheduleFactoryClass,
}
export const PointFactory = { key: "PointFactory", fn: PointFactoryClass }
export const ReferralFactory = {
	key: "ReferralFactory",
	fn: ReferralFactoryClass,
}
export const RoleFactory = { key: "RoleFactory", fn: RoleFactoryClass }
export const SectionFactory = { key: "SectionFactory", fn: SectionFactoryClass }
export const SiteFactory = { key: "SiteFactory", fn: SiteFactoryClass }
export const SmsBatchFactory = {
	key: "SmsBatchFactory",
	fn: SmsBatchFactoryClass,
}
export const StoryFactory = { key: "StoryFactory", fn: StoryFactoryClass }
export const ThreadFactory = { key: "ThreadFactory", fn: ThreadFactoryClass }
export const UserFactory = { key: "UserFactory", fn: UserFactoryClass }
export const VideoFactory = { key: "VideoFactory", fn: VideoFactoryClass }
