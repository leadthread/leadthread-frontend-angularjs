import _ from "lodash"
import {
	CampaignClass as Campaign,
	PlaylistClass as Playlist,
} from "../../../../../../Core/Classes"
import Controller from "../../../Controller"

class SendController extends Controller {
	static $inject = [
		"$scope",
		"campaigns",
		"playlists",
		"users",
		"ContactService",
		"$device",
		"$notification",
		"$location",
		"$placeholder",
		"$timeout",
		"$title",
		"$http",
		"$sms",
		"$stateParams",
		"$auth",
		"$popup",
		"$q",
		"EventService",
		"isAdmin",
	]
	constructor(
		$scope,
		campaigns,
		playlists,
		users,
		ContactService,
		$device,
		$notification,
		$location,
		$placeholder,
		$timeout,
		$title,
		$http,
		$sms,
		$stateParams,
		$auth,
		$popup,
		$q,
		EventService,
		isAdmin
	) {
		super()
	}

	defineScope() {
		this.$scope.sending = false
		this.$scope.userId = this.$auth.getUserId()
		this.$scope.loaded = false
		this.$scope.sendOverlayEnabled = false
		this.$scope.searching = false
		this.$scope.deselectContact = this.deselectContact
		this.$scope.isAdmin = this.isAdmin
		this.$scope.isMobile = this.$device.isMobile()

		//funcs
		this.$scope.toggleSendOverlay = this.toggleSendOverlay
		this.$scope.onPlaylistAdd = this.onPlaylistAdd
		this.$scope.onCampaignSend = this.onCampaignSend
		this.$scope.link = null

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
			},
		}

		this.$scope.controls.type.selected = this.$stateParams.type
		this.$scope.controls.user.selected = _.find(
			this.$scope.controls.user.items,
			{ id: this.$stateParams.userId }
		)
		this.$scope.controls.campaign.selected = _.find(
			this.$scope.controls.campaign.items,
			{ id: this.$stateParams.campaignId }
		)
		this.$scope.controls.playlist.selected = _.find(
			this.$scope.controls.playlist.items,
			{ id: this.$stateParams.playlistId }
		)
	}
	defineListeners() {
		this.$scope.$watch("controls.user.selected.id", (n) => {
			this.$location.search("userId", n)
		})
		this.$scope.$watch("controls.campaign.selected.id", (n) => {
			this.$location.search("campaignId", n)
		})
		this.$scope.$watch("controls.playlist.selected.id", (n) => {
			this.$location.search("playlistId", n)
		})
		this.$scope.$watch("controls.type.selected", (n) => {
			this.$location.search("type", n)
		})

		this.$scope.$watch("controls.contacts.selected.length", (n, o) => {
			if (n > o) {
				this.onSelectedContacts(this.$scope.controls.contacts.selected)
			}
			if (n === 0) {
				this.$scope.sendOverlayEnabled = false
			}
		})
	}

	definePlaceholders() {
		let user = this.$auth.getUser()
		this.$placeholder.clear().set({
			company: this.$scope.company.name,
			"sales-rep-first-name": user.first_name,
			"sales-rep-last-name": user.last_name,
			"sales-rep-full-name": user.first_name + " " + user.last_name,
		})
	}

	init() {
		let type = _.get(this.$scope, "controls.type.selected")
		let campaign = _.get(this.$scope, "controls.campaign.selected")
		let playlist = _.get(this.$scope, "controls.playlist.selected")

		this.$scope.type = type
		this.$scope.target = campaign ? campaign : playlist

		if (type) {
			this.setNavbarTitle()

			if (campaign || playlist) {
				if (type === "campaign") {
					this.getCampaignLink()
				}

				if (this.$stateParams.contactId) {
					this.ContactService.show(this.$stateParams.contactId).then(
						(resp) => {
							this.$timeout(() => {
								this.$scope.controls.contacts.selected =
									_.unionWith(
										this.$scope.controls.contacts.selected,
										[resp],
										(a, b) => {
											return (
												a.phone.valueOf() ===
												b.phone.valueOf()
											)
										}
									)
								this.onSelectedContacts(
									this.$scope.controls.contacts.selected
								)
							}, 1000)
						}
					)
				}

				this.$scope.loaded = true
			}
		}
	}

	setNavbarTitle() {
		let x = "Send Campaign"
		if (this.$scope.controls.type.selected === "playlist") {
			x = "Add to Playlist"
		}
		this.$title.setTitle(x)
	}

	getCampaignLink(userId = null) {
		if (!_.isInteger(userId)) {
			userId = this.$auth.getUser().id
		}
		return this.$http
			.post("/api/v1/links/campaign", {
				user_id: userId,
				campaign_id: this.$scope.controls.campaign.selected.id,
				company_id: this.$stateParams.companyId,
				target_id: this.$scope.controls.campaign.selected.id,
			})
			.then((resp) => {
				this.$scope.link =
					resp.data.data.keyword_url || resp.data.data.long_url
				return resp.data.data
			})
	}

	getContactLink(contactId, userId = null) {
		if (!_.isInteger(userId)) {
			userId = this.$auth.getUser().id
		}
		return this.$http
			.post("/api/v1/links/contact", {
				user_id: userId,
				campaign_id: this.$scope.controls.campaign.selected.id,
				company_id: this.$stateParams.companyId,
				contact_id: contactId,
			})
			.then((resp) => {
				return resp.data.data
			})
	}

	toggleSendOverlay() {
		this.$scope.sendOverlayEnabled = !this.$scope.sendOverlayEnabled
	}

	onSelectedContacts = (p) => {
		if (_.isArray(p)) {
			return this.$q.all(_.map(p, this.onSelectedContact))
		} else {
			return this.onSelectedContact(p).then((p) => {
				return [p]
			})
		}
	}

	onSelectedContact = (p) => {
		if (this.$scope.type === "campaign" && this.$scope.isMobile) {
			let promise = this.getContactLink(p.id).then((link) => {
				return this.$q
					.all({
						link: this.$sms.getSmsHrefObject(
							this.getMsgFn(),
							link.long_url,
							p,
							true
						),
						event: this.EventService.record(link, "sent"),
					})
					.then((x) => {
						p.timestamp = new Date().toISOString()
						p.link = x.link
						this.deselectContact(p)
						location.href = p.link.href
						return p
					})
			})
			return this.$popup.while(promise, "Opening your SMS App...")
		} else {
			return this.$q.when(p)
		}
	}

	onPlaylistAdd = () => {
		let contacts

		if (this.$scope.target instanceof Playlist) {
			contacts = _.cloneDeep(this.$scope.controls.contacts.selected)

			if (contacts.length > 0 && this.$scope.controls.send.active) {
				return this.$popup
					.sendPlaylist({
						count: contacts.length,
						playlist: this.$scope.target,
					})
					.then((resp) => {
						this.$scope.controls.send.active = false
						let userId = _.get(
							this,
							"$scope.controls.user.selected.id"
						)
						return this.$http
							.post(
								"/api/v1/playlists/" +
									this.$scope.target.id +
									"/attach",
								_.merge(
									{
										contact_ids: _.map(contacts, "id"),
										user_id: userId,
									},
									resp
								)
							)
							.then(
								() => {
									this.$notification.success(
										"Success! Added " +
											contacts.length +
											" contacts to the playlist."
									)
									this.$scope.controls.send.active = true
									_.map(
										this.$scope.controls.contacts.selected,
										this.deselectContact
									)
								},
								function (error) {
									// this.$notification.error(error);
								}
							)
					})
			}
		} else {
			return this.$q.reject("Type must be 'playlist'")
		}
	}

	onCampaignSend = () => {
		let contacts

		if (this.$scope.target instanceof Campaign) {
			contacts = _.cloneDeep(this.$scope.controls.contacts.selected)

			if (contacts.length > 0 && this.$scope.controls.send.active) {
				return this.$popup
					.sendCampaign({
						count: contacts.length,
						campaign: this.$scope.target,
					})
					.then((resp) => {
						this.$scope.controls.send.active = false
						let userId = _.get(
							this,
							"$scope.controls.user.selected.id"
						)
						return this.$sms
							.sendInvite(
								_.map(contacts, "id"),
								resp.message,
								this.$stateParams.companyId,
								this.$scope.controls.campaign.selected.id,
								userId
							)
							.then(
								() => {
									this.$notification.success(
										"Success! Sent the campaign to " +
											contacts.length +
											" contacts."
									)
									this.$scope.controls.send.active = true
									_.map(
										this.$scope.controls.contacts.selected,
										this.deselectContact
									)
								},
								(error) => {
									// this.$notification.error(error);
								}
							)
					})
			}
		} else {
			return this.$q.reject("Type must be 'campaign'")
		}
	}

	deselectContact(p) {
		if (p) {
			p.selected = false
		}
		return p
	}

	getMsgFn() {
		return this.$scope.controls.campaign.selected.contact_text_message
	}
}

const key = "SendController"
const fn = SendController

export const CompanySend = {
	key,
	fn,
}
