import $ from "jquery"

export const key = "$httpPreload"

export const inject = ["$cacheFactory", "$notification"]

export const fn = ($cacheFactory, $notification) => {
	let cache = $cacheFactory("$httpPreload")
	$("#preload > [data-url]").each(function (index, el) {
		try {
			let data = JSON.parse($(el).html())
			cache.put("/api/v1" + $(el).attr("data-url"), { data: data })
		} catch (e) {
			let msg = e
			$notification.error(msg)
			console.error(msg)
			$("body").html(msg)
			throw msg
		}
	})
	return cache
}
