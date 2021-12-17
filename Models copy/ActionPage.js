///

import { Thread, ThreadFactory, ThreadService } from "./Thread"

export class ActionPage extends Thread {
	company_id
	name

	constructor(_service, _data) {
		super(_service, _data)
	}

	toString() {
		return this.name
	}
}

export class ActionPageFactory extends ThreadFactory {
	static $inject = ["ActionPageService"]
	constructor(_service) {
		super(_service)
	}
	create(_data) {
		return this._service.create(_data)
	}
}

export class ActionPageService extends ThreadService {
	resource = "action-pages"

	static $inject = ["$api", "$q", "SiteService", "BrandService"]
	constructor($api, $q, SiteService, BrandService) {
		super($api, $q, SiteService, BrandService)
	}

	create = (_data) => {
		return new ActionPage(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	showOrCreate(id, search) {
		return super.showOrCreate(id, search)
	}

	destroy(id) {
		return super.destroy(id)
	}

	saveFor(parentResource, parentId, model) {
		return super.saveFor(parentResource, parentId, model)
	}
}
