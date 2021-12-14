import _ from "lodash"

export const key = "ReportCard"

export const inject = []

export const fn = () => {
	var ReportCard = function (title) {
		this.title = title
		this.rows = []
		this.onClick = null
		this.opened = undefined
	}

	ReportCard.prototype.addClickHandler = function (handle) {
		if (!_.isFunction(handle)) {
			this.onClick = function () {
				return handle
			}
		} else {
			this.onClick = handle
		}
	}

	ReportCard.prototype.addRow = function (row) {
		if (!row.type) {
			row.type = "RowDefault"
		}
		this.rows.push(row)
	}

	ReportCard.prototype.addSubTitleRow = function (row) {
		row.type = "RowSubTitle"
		this.addRow(row)
	}

	return ReportCard
}
