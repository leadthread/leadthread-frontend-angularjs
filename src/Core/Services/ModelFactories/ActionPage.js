import { ThreadFactory } from "./Thread"

export class ActionPageFactory extends ThreadFactory {
	static $inject = ["ActionPageService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export const module = { key: "ActionPageFactory", fn: ActionPageFactory }
