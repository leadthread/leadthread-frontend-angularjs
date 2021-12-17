/*
 * @Author: Tyler Arbon
 * @Date:   2017-06-21 10:57:39
 * @Last Modified by:   Tyler Arbon
 * @Last Modified time: 2017-08-01 11:45:09
 */
///
import { Event } from "../../Classes"
import { ModelService } from "./Model"

export class EventService extends ModelService {
	resource = "events"
	recorded = []

	static $inject = ["$api", "$q"]
	constructor($api, $q) {
		super($api, $q)
	}

	record = (link, type, referral_id) => {
		return this.create({
			link_id: link.id,
			type: type,
			referral_id: referral_id,
		})
			.save()
			.then((e) => {
				this.recorded.push(e)
				return e
			})
	}

	create = (_data) => {
		return Event.create(this, _data)
	}

	show(id) {
		return super.show(id)
	}

	destroy(id) {
		return super.destroy(id)
	}

	indexFor(parentResource, parentId) {
		return super.indexFor(parentResource, parentId)
	}

	// save(orig, include = null) {
	// 	return this.saveRelatedBefore(orig, include).then(() => {
	// 		orig = this.beforeSave(orig);

	// 		if (!orig) {
	// 			return this.$q.when(null);
	// 		}

	// 		if(_.isNumber(orig.id)) {
	// 			return this.$http.put>("/"+this.resource, orig.valueOf());
	// 		} else {
	// 			return this.$http.post>("/"+this.resource, orig.valueOf());
	// 		}
	// 	})
	// 	.then((fresh) => {
	// 		return _.merge(orig, fresh.data);
	// 	})
	// 	.then(this.afterSave)
	// 	.then((fresh) => {
	// 		return this.$q.when(this.saveRelatedAfter(fresh, include)).then(() => {
	// 			return fresh
	// 		});
	// 	});
	// }
}

export const module = { key: "EventService", fn: EventService }
