/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 */
///
import { Model, ModelFactory, ModelService } from "./Model"

export class Referral extends Model {
	company
	email
	first_name
	last_name
	phone
	link
	contact_id
	is_lead

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return this.first_name + " " + this.last_name
	}

	valueOf() {
		return super.valueOf()
	}
}

export class ReferralFactory extends ModelFactory {
	static $inject = ["ReferralService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class ReferralService extends ModelService {
	resource = "referrals"

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	create = (_data) => {
		return new Referral(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	destroy(id) {
		return super.destroy(id)
	}
}
