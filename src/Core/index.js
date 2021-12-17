// Import Styles
import "add-to-homescreen/dist/style/addtohomescreen.css"
import "angular-bootstrap-colorpicker/css/colorpicker.css"
import "angular-ui-bootstrap-datetimepicker/datetimepicker.css"
import "ui-select/dist/select.min.css"

// Import styles
import "../style.less"

// Thrid Party Libraries
import jQuery from "jquery"
import _ from "lodash"
import angular from "angular"
import "angular-ui-bootstrap"
import "angular-file-upload"
import "@uirouter/angularjs"
import "pusher-angular"
import "ngclipboard"
import "angular-video-embed"
import "angular-sanitize"
import "angular-ui-bootstrap-datetimepicker"
import Raven from "raven-js"
import pluginRavenJs from "raven-js/plugins/angular"

// "Core" app imports
import * as Configs from "./Configs"
import * as Constants from "./Constants"
import * as Components from "./Components"
import * as Controllers from "./Controllers"
import * as Directives from "./Directives"
import * as Factories from "./Factories"
import * as Filters from "./Filters"
import * as Runs from "./Runs"
import * as Services from "./Services"

const setupRaven = () => {
	window["$SENTRY_KEY"] =
		window["$SENTRY_KEY"] ||
		"https://f7dd42c4f02342fca4645e6666b55dd9@sentry.io/120107"
	if (window["$SENTRY_KEY"]) {
		Raven.config(window["$SENTRY_KEY"], {
			release: window["$VERSION"],
		})
			.addPlugin(pluginRavenJs)
			.install()
	}
}

const setupConsoleTable = () => {
	if (console.table === undefined) {
		console.table = console.log
	}
}

const setupAlertStringify = () => {
	var origAlert = window.alert
	window.alert = function (value) {
		if (_.isObject(value) || _.isArray(value)) {
			value = JSON.stringify(value)
		}
		origAlert(value)
	}
}

const setupLodashMixins = () => {
	_.mixin({
		inherit: function (child, base, props) {
			child.prototype = _.create(
				base.prototype,
				_.assign(
					{
						_super: base.prototype,
						constructor: child,
					},
					props
				)
			)
			return child
		},
	})
}

// Setup Third Party Code and Helper Functions
setupRaven()
setupConsoleTable()
setupAlertStringify()
setupLodashMixins()

// Setup the "Link" angular module
angular.module("templates", [])
const module = angular.module("lt.core", [
	"pusher-angular",
	"ui.bootstrap",
	"ui.router",
	"ngRaven",
	"angularFileUpload",
	"ngclipboard",
	"zen.video-embed",
	"ngSanitize",
	"ui.bootstrap.datetimepicker",
	// "ngCookies",
	// "ngAnimate",
	// "templates",
	// "colorpicker.module",
	// "monospaced.qrcode",
])

if (Configs) {
	for (const i in Configs) {
		const { inject, fn } = Configs[i]
		const injectable = inject ? [...inject, fn] : fn
		module.config(injectable)
	}
}

if (Components) {
	for (const i in Components) {
		const { key, inject, fn } = Components[i]
		const injectable = inject ? [...inject, fn] : fn
		module.component(key, injectable)
	}
}

if (Constants) {
	for (const i in Constants) {
		const { key, value } = Constants[i]
		module.constant(key, value)
	}
}

if (Controllers) {
	for (const i in Controllers) {
		const { key, inject, fn } = Controllers[i]
		const injectable = inject ? [...inject, fn] : fn
		module.controller(key, injectable)
	}
}

if (Directives) {
	for (const i in Directives) {
		const { key, inject, fn } = Directives[i]
		const injectable = inject ? [...inject, fn] : fn
		module.directive(key, injectable)
	}
}

if (Factories) {
	for (const i in Factories) {
		const { key, inject, fn } = Factories[i]
		const injectable = inject ? [...inject, fn] : fn
		module.factory(key, injectable)
	}
}

if (Filters) {
	for (const i in Filters) {
		const { key, inject, fn } = Filters[i]
		const injectable = inject ? [...inject, fn] : fn
		module.filter(key, injectable)
	}
}

if (Runs) {
	for (const i in Runs) {
		const { inject, fn } = Runs[i]
		const injectable = inject ? [...inject, fn] : fn
		module.run(injectable)
	}
}

if (Services) {
	for (const i in Services) {
		const { key, inject, fn } = Services[i]
		const injectable = inject ? [...inject, fn] : fn
		module.service(key, injectable)
	}
}
