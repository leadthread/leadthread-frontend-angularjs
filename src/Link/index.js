// Import the "Core" angular module
import "../Core"

// Thrid Party Libraries
import angular from "angular"

// "Link" app imports
import * as Configs from "./Configs"
import * as Constants from "./Constants"
import * as Controllers from "./Controllers"
import * as Directives from "./Directives"
import * as Factories from "./Factories"
import * as Runs from "./Runs"
import * as Services from "./Services"

// Setup the "Link" angular module
const module = angular.module("lt.link", ["lt.core"])

if (Configs) {
	for (const i in Configs) {
		const { inject, fn } = Configs[i]
		const injectable = inject ? [...inject, fn] : fn
		module.config(injectable)
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
