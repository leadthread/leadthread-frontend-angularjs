/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 */
///
import { ModelService } from "./Model"
import { Referral } from "../../Classes"

export class ReferralService extends ModelService {
	resource = "referrals"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return Referral.create(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	destroy(id) {
		return super.destroy(id)
	}
}

export const module = { key: "ReferralService", fn: ReferralService }
