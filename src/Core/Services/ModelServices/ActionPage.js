///
import { ActionPage } from "../../Classes"
import { ThreadService } from "./Thread"

export class ActionPageService extends ThreadService {
	resource = "action-pages"

	static $inject = ["$api", "$q", "BrandService", "SiteService"]
	constructor($api, $q, BrandService, SiteService) {
		super($api, $q, BrandService, SiteService)
	}

	create = (_data) => {
		return ActionPage.create(this, _data)
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

export const module = { key: "ActionPageService", fn: ActionPageService }
