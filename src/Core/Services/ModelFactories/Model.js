///
import _ from "lodash"

export class ModelFactory {
	static $inject = ["ModelService"]
	constructor(_service) {
		this._service = _service
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export const module = { key: "ModelFactory", fn: ModelFactory }
