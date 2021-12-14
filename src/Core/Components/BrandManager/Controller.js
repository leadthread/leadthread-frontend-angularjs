import _ from "lodash"

import ComponentController from "../Controller"

export default class Controller extends ComponentController {
	static $inject = ["$popup", "BrandFactory", "$stateParams"]

	//Bindings
	brands
	brand
	onBrandChange
	selected

	constructor($popup, BrandFactory, $stateParams) {
		super()
	}

	run = () => {
		this.selectBrand(_.find(this.brands, { id: this.selected }))
	}

	form(brand) {
		var form = [
			{
				type: "input",
				subtype: "text",
				label: "Company Name",
				key: "name",
				value: _.get(brand, "name"),
				required: true,
			},
			{
				type: "input",
				subtype: "text",
				label: "Domain",
				key: "domain",
				value: _.get(brand, "domain"),
				required: false,
			},
			{
				type: "color",
				subtype: null,
				label: "Company Color",
				key: "color",
				value: _.get(brand, "color", "#666666"),
				required: true,
			},
			{
				type: "color",
				subtype: null,
				label: "Logo Background Color",
				key: "logo_background_color",
				value: _.get(brand, "logo_background_color", "#FFFFFF"),
				required: true,
			},
			{
				type: "image",
				subtype: "logo",
				label: "Logo",
				key: "logo",
				value: _.get(brand, "logo"),
				required: true,
			},
			{
				type: "image",
				subtype: "favicon",
				label: "Favicon",
				key: "favicon",
				value: _.get(brand, "favicon"),
				required: false,
			},
			// {type: "input", subtype: "text",    label: "Homepage URL",          key: "homepage_url",          value: _.get(brand, "homepage_url"),                     required: false},
		]

		return this.$popup
			.form(form, (brand ? "Edit" : "New") + " Brand", false, "lg")
			.then((x) => {
				let a
				if (brand) {
					a = brand
					for (let prop in x) {
						let y = x[prop]
						a[prop] = y
					}
				} else {
					a = this.BrandFactory.create(x)
				}

				return a
			})
			.then((brand) => {
				brand.company_id = this.$stateParams.companyId
				brand.logo_id = _.get(brand, "logo.id", null)
				brand.favicon_id = _.get(brand, "favicon.id", null)
				return brand
			})
	}

	edit(brand) {
		return this.form(brand).then(this.save)
	}

	create() {
		return this.form()
			.then(this.save)
			.then((brand) => {
				this.brands.push(brand)
				this.selectBrand(brand)
			})
	}

	destroy(brand) {
		brand.destroy().then(() => {
			_.remove(this.brands, { id: brand.id })
			this.selectBrand(_.find(this.brands, _.get(this, "brands[0].id")))
		})
	}

	save(brand) {
		return brand.save()
	}

	selectBrand(brand) {
		if (brand) {
			this.brand = brand
			this.selected = this.brand.id
			this.onBrandChange()(this.brand)
		}
	}
}
