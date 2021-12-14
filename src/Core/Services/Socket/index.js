/* global Pusher:false */
export const key = "$socket"

export const inject = ["$pusher", "$rootScope", "PUSHER"]

export const fn = ($pusher, $rootScope, PUSHER) => {
	var listening = {}
	var pusher = null

	function connect() {
		if (!pusher) {
			pusher = $pusher(new Pusher(PUSHER.KEY))
		}
		return pusher
	}

	function subscribe(channel) {
		connect()
		if (!listening[channel]) {
			listening[channel] = { count: 1 }
			listening[channel].channel = pusher.subscribe(channel)
			listening[channel].channel.bind_all(function (name, data) {
				$rootScope.$broadcast(name, data)
			})
		} else {
			listening[channel].count++
		}

		return listening[channel]
	}

	function unsubscribe(channel) {
		connect()
		if (listening[channel]) {
			listening[channel].count--
			if (listening[channel].count <= 0) {
				pusher.unsubscribe(channel)
				delete listening[channel]
			}
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe,
	}
}
