/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-03 09:32:58
*/
/// <reference path="CampaignTransformer.ts" />
namespace lt {
	export class V1ReferralThreadCampaignTransformer extends CampaignTransformer {
		
		toCampaign(form: CampaignForm): ng.IPromise<Campaign> {
			return this.createCampaignInstance(form).then((campaign) => {
				campaign.is_phone_app = false;
				campaign.contact_text_message = form.getFieldValue("uPMessage");
				campaign.name = form.getFieldValue("campaignName");
				campaign.keyword = form.getFieldValue("campaignKeyword");
				campaign.channel = "sms";
				campaign.content_sharing = false;
				campaign.referral_text_message = form.getFieldValue("pRMessage");

				var promise = [];
				promise.push(this.$q.when(this.setBrand(campaign, form)));
				promise.push(this.$q.when(this.setIntroPage(campaign, form)));
				promise.push(this.$q.when(this.setSharePage(campaign, form)));
				promise.push(this.$q.when(this.setActionPage(campaign, form)));
				promise.push(this.$q.when(this.setIncentive(campaign, form)));

				return this.$q.all(promise).then(() => {
					this.campaign = campaign;
					return campaign;
				});
			});
		}

		toForm(campaign: Campaign): CampaignForm {
			var form = this.createFormInstance(campaign);
			
			this.setNameFormField(form, campaign);
			this.setKeywordFormField(form, campaign);
			this.setBrandingFormFields(form, campaign);
			this.setUserContactMessageFormField(form, campaign);
			this.setContactReferralMessageFormField(form, campaign);
			this.setIncentiveFormField(form, campaign);

			// ----------------

			this.setActionPageFormFields(form, campaign);

			return form;
		}
		
		setIntroPage(campaign: Campaign, form: CampaignForm) {
			return this.getBrandColor(campaign, form).then((color) => {

				var introPage = campaign.site.getIntroPage();

				introPage.company_id = this.$stateParams.companyId;
				introPage.name = "intro";
				introPage.order = 0;
				introPage.background_color = "#ffffff";

				var media = introPage.getMediaSection();
				media.type = form.getFieldValue("defaultType");
				media.file_id = null;
				media.file = null;
				media.video_id = null;
				media.video = null;
				if (media.type == "image") {
					if (!(media instanceof ImageSection)) {
						media = this.SectionFactory.create(media);
					}
					media.type = "image";
					media.file_id = form.getFieldValue("defaultImage") !== null ? form.getFieldValue("defaultImage").id : null;
					media.file = form.getFieldValue("defaultImage") !== null ? form.getFieldValue("defaultImage") : null;
				} else if (media.type == "video") {
					if (!(media instanceof VideoSection)) {
						media = this.SectionFactory.create(media);
					}
					media.type = "video";
					media.video_id = form.getFieldValue("defaultVideo") != null ? form.getFieldValue("defaultVideo").id : null;
					media.video = form.getFieldValue("defaultVideo") != null ? form.getFieldValue("defaultVideo") : null;
				} else if (media.type == "pdf") {
					if (!(media instanceof PdfSection)) {
						media = this.SectionFactory.create(media);
					}
					media.type = "pdf";
					media.file_id = form.getFieldValue("defaultPDF") != null ? form.getFieldValue("defaultPDF").id : null;
					media.file = form.getFieldValue("defaultPDF") != null ? form.getFieldValue("defaultPDF") : null;
				}

				if (media.type == "image" || media.type == "video" || media.type == "pdf") {
					media.company_id = this.$stateParams.companyId;
					media.name = "intro_media";
					media.order = 0;
					media.padding_vertical = 0;
					media.padding_horizontal = 0;
					introPage.setMediaSection(media);
				}

				// push Text
				var txt = introPage.getBodySection();
				txt.company_id = this.$stateParams.companyId;
				txt.name = "intro_body";
				txt.order = 2;
				txt.type = "text";
				txt.text = form.getFieldValue("landingText");
				introPage.setBodySection(txt);

				//copy action buttons
				var buttons = introPage.getButtonSections();

				_.forEach(buttons, (button, i) => {
					let value = form.getFieldValue("callToActionButtons");
					var s = _.isArray(value) ? value[i] : null;

					if (!s) {
						introPage.deleteSections((section: ISection) => {
							return section.name === "intro_action_button_"+i;
						});
					} 
				});

				_.forEach(form.getFieldValue("callToActionButtons"), (button, i) => {
					var name = "intro_action_button_"+i;
					var find = (s: ISection) => {
						return s.name === name;
					};
					var actionButton = introPage.getButtonSection(find);

					actionButton.name = name;
					actionButton.order = 4+parseInt(i);
					actionButton.button_border_color = color;
					actionButton.button_color = color;
					actionButton.font_color = "#FFFFFF";
					actionButton.font_size = 20;
					actionButton.text = button.text;
					actionButton.button_icon = button.button_icon;
					actionButton.success_message = button.success_message,
					actionButton.type = button.type;
					actionButton.phone = button.phone;
					actionButton.url = button.url;
					actionButton.email = button.email;

					switch (actionButton.type) { // Call To Action Button Type ['tel', 'sms', 'url']
					case "register" :
					case "tel" :
					case "sms" :
						introPage.setButtonSection(find, this.SectionFactory.create(actionButton.valueOf()));
						break;
					case "url" :
						if (_.isString(actionButton.url)) {
							var idx1 = actionButton.url.indexOf("http://");
							var idx2 = actionButton.url.indexOf("https://");
							if (idx1 === -1 && idx2 === -1) {
								actionButton.url = "http://"+actionButton.url;
							}
						}
						introPage.setButtonSection(find, this.SectionFactory.create(actionButton.valueOf()));
						break;
					case "mailto" :
						introPage.setButtonSection(find, this.SectionFactory.create(actionButton.valueOf()));
						break;
					case "nav" :
						introPage.setButtonSection(find, this.SectionFactory.create(actionButton.valueOf()));
						break;
					default :
						throw "Could not set section of type: "+actionButton.type;
					}
				});

				// Set the static forward button
				var name = "intro_static_forward";
				var find = (s: ISection) => {
					return s.name === name;
				};
				var actionButton = introPage.getButtonSection(find);
				actionButton.name = name;
				actionButton.order = 100;
				actionButton.button_border_color = color;
				actionButton.button_color = color;
				actionButton.font_color = "#FFFFFF";
				actionButton.font_size = 20;
				actionButton.text = "Share Now";
				actionButton.type = "nav";
				actionButton.phone = null;
				actionButton.url = null;
				actionButton.email = null;
				introPage.setButtonSection(find, this.SectionFactory.create(actionButton.valueOf()));

				// push Text
				var footer = introPage.getFooterSection();
				footer.company_id = this.$stateParams.companyId;
				footer.name = "intro_footer";
				footer.order = 30;
				footer.type = "text";
				footer.font_size = 10;				
				footer.text = form.getFieldValue("footer");
				introPage.setFooterSection(footer);

				campaign.site.setIntroPage(introPage);
			});
		}

		setActionPageButtonFormField(campaign: Campaign, form: CampaignForm) {
			var page = campaign.site.getIntroPage();
			var buttons = page.getButtonSections("intro_action_button_");
			let buttonArr: ICampaignButtonFormFieldButton[] = campaign.id ? [] : form.getFieldValue("callToActionButtons");

			_.forEach(buttons, (button) => {
				if (_.isString(button.url)) {
					var idx1 = button.url.indexOf("http://");
					var idx2 = button.url.indexOf("https://");
					if (idx1 === -1 && idx2 === -1) {
						button.url = "http://"+button.url;
					}
				}
				buttonArr.push({
					text: button.text,
					success_message: button.success_message,
					button_icon: button.button_icon,
					type: button.type,
					url: button.url,
					phone: button.phone,
					email: button.email,
				});
			});

			form.setFieldValue("callToActionButtons", buttonArr);
		}
	}

	angular.module("lt.app").service("V1ReferralThreadCampaignTransformer", V1ReferralThreadCampaignTransformer);
}
