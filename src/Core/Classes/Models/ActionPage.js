///

import { Thread } from "./Thread"
import { Model } from "./Model"

export class ActionPage extends Thread {
	company_id
	name

	constructor(_service, _data) {
		super(_service, _data)
	}

	static getDefaults() {
		const defaults = {}
		return defaults
	}

	toString() {
		return this.name
	}
}
