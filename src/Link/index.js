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
const module = angular.module("lt.link", ["templates", "lt.core"])

for (const i in Configs) {
	const { inject, fn } = Configs[i]
	module.config([...inject, fn])
}

for (const i in Constants) {
	const { key, value } = Constants[i]
	module.constant(key, value)
}

for (const i in Controllers) {
	const { key, inject, fn } = Constants[i]
	module.controller(key, [...inject, fn])
}

for (const i in Directives) {
	const { key, inject, fn } = Directives[i]
	module.directive(key, [...inject, fn])
}

for (const i in Factories) {
	const { key, inject, fn } = Factories[i]
	module.factory(key, [...inject, fn])
}

for (const i in Runs) {
	const { inject, fn } = Runs[i]
	module.run([...inject, fn])
}

for (const i in Services) {
	const { key, inject, fn } = Services[i]
	module.factory(key, [...inject, fn])
}
