import _ from "lodash"
import Controller from "../Controller"

import { Campaign } from "../../../../Core/Classes"

export default class RootController extends Controller {
	//Dependencies
	static $inject = [
		"$scope",
		"$favicon",
		"$http",
		"$q",
		"$api",
		"$stateParams",
		"$company",
		"$placeholder",
		"$sms",
		"$location",
		"$title",
		"CampaignFactory",
		"ActionPageFactory",
		"ReferralFactory",
		"contact",
		"owner",
		"company",
		"link",
		"story",
		"target",
		"referral",
		"EventService",
	]

	constructor(
		$scope,
		$favicon,
		$http,
		$q,
		$api,
		$stateParams,
		$company,
		$placeholder,
		$sms,
		$location,
		$title,
		CampaignFactory,
		ActionPageFactory,
		ReferralFactory,
		contact,
		owner,
		company,
		link,
		story,
		target,
		referral,
		EventService
	) {
		super()
		this.$scope = $scope
		this.$favicon = $favicon
		this.$http = $http
		this.$q = $q
		this.$api = $api
		this.$stateParams = $stateParams
		this.$company = $company
		this.$placeholder = $placeholder
		this.$sms = $sms
		this.$location = $location
		this.$title = $title
		this.CampaignFactory = CampaignFactory
		this.ActionPageFactory = ActionPageFactory
		this.ReferralFactory = ReferralFactory
		this.contact = contact
		this.owner = owner
		this.company = company
		this.link = link
		this.story = story
		this.target = target
		this.referral = referral
		this.EventService = EventService
		this.story = story || {
			type: null,
			video: null,
			image: null,
			caption: null,
		}
		this.$onInit()
	}

	init() {
		let self = this
		this.EventService.record(this.$scope.options.link, "opened")
		self.$company.setCompany(self.company)
	}

	defineScope() {
		let self = this,
			options = {}

		self.$scope.company = self.company
		self.$scope.contact = self.contact
		self.$scope.referral = self.referral
		self.$scope.lock = null
		self.$scope.owner = self.owner
		self.$scope.showSite = true
		self.$scope.target = this.target
		self.$scope.pageIndex = self.$stateParams.page
		self.$scope.scrollTo = self.$stateParams.scrollTo

		options.collectCompany = this.target.type === "referral-thread"
		options.color = this.target.brand.color || "#000000"
		options.getMsgFn = self.getReferralMsgFn
		options.getUrlFn = self.getUrlFn
		options.link = self.link
		options.contact = self.contact
		options.referral = self.referral
		options.onNewReferral = self.onNewReferral
		options.owner = self.owner
		options.sent_via = null
		options.type = this.target.type
		options.story = self.story

		if (this.target instanceof Campaign) {
			options.incentive = this.target.incentive
		}

		self.$title.setTitle(this.target.brand.name)
		self.$favicon.changeFavicon(this.target.brand.favicon_id)

		self.$scope.options = options
	}

	defineListeners() {
		this.$scope.$on("SiteNext", () => {
			this.scrollTop()
			this.$scope.pageIndex++
			this.$location.search("page", this.$scope.pageIndex)
		})
		this.$scope.$on("SitePrev", () => {
			this.scrollTop()
			this.$scope.pageIndex--
			this.$location.search("page", this.$scope.pageIndex)
		})
	}

	definePlaceholders() {
		var values = {
			company: this.$scope.company.name,
			"sales-rep-full-name":
				this.$scope.owner.first_name +
				" " +
				this.$scope.owner.last_name,
			"sales-rep-first-name": this.$scope.owner.first_name,
			"sales-rep-last-name": this.$scope.owner.last_name,
		}

		if (this.$scope.contact) {
			values["customer-first-name"] = this.$scope.contact.first_name
			values["customer-last-name"] = this.$scope.contact.last_name
			values["customer-full-name"] =
				this.$scope.contact.first_name +
				" " +
				this.$scope.contact.last_name
		}
		this.$placeholder.clear().set(values)
	}

	getReferralMsgFn = () => {
		if (this.$scope.target instanceof Campaign) {
			return this.$placeholder.parse(
				this.$scope.target.referral_text_message
			)
		} else {
			return ""
		}
	}

	getUrlFn = (options) => {
		let self = this

		return self.$company.getId().then(function (company_id) {
			var data = self.getUrlRequestData()

			data.sent_via = options.sent_via
			data.company_id = company_id

			if (options.referral && options.referral.id) {
				data.referral_id = options.referral.id
			}

			return self
				.$http({
					method: "POST",
					url: "/api/v1/links/referral",
					data: data,
				})
				.then(function (x) {
					return x.data.data
				})
		})
	}

	onNewReferral = (referral) => {
		// Associate to this target
		let self = this

		if (self.$scope.contact) {
			return self.$api
				.show("contacts", self.$scope.contact.id)
				.store(
					"referrals",
					_.merge(referral.valueOf(), {
						campaign_id: self.$scope.target.id,
						company_id: self.$scope.company.id,
						owner_id: self.$scope.owner.id,
					})
				)
				.exec()
				.then(function (resp) {
					var referral = self.ReferralFactory.create(resp)

					return self.$sms
						.getSmsHrefObject(
							self.$scope.options.getMsgFn,
							self.$scope.options.getUrlFn,
							referral
						)
						.then(function (x) {
							referral.link = x
							return referral
						})
				})
		}
	}

	getUrlRequestData = () => {
		var params = {
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
		}

		return params
	}

	/**
	 * Scrolls the window to the top
	 */
	scrollTop() {
		window.scrollTo(0, 0)
	}
}
