/*
* @Author: Tyler Arbon
* @Date:   2017-06-21 10:57:39
* @Last Modified by:   Tyler Arbon
* @Last Modified time: 2017-07-18 11:09:52
*/
/// <reference path="CampaignTransformer.ts" />
namespace lt {
	export class V1RecognitionCampaignTransformer extends V1MessageThreadCampaignTransformer {

	}

	angular.module("lt.app").service("V1RecognitionCampaignTransformer", V1RecognitionCampaignTransformer);
}