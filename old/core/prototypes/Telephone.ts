declare var PNF: any
declare var phoneUtil: any

namespace lt {
	
	export class Telephone implements ITelephone {
		public country: string;
		protected number: string;

		constructor(number: string, country = "US") {
			this.setNumber(number);
		}

		setNumber(number: string): void {
			if (_.isString(number) && number.length > 0) {
				this.number = number;

				if (this.filter().length < 10) {
					console.warn("The phone number must be at least 10 digits in length");
				}
			} else {
				throw "Cannot create an instance of Telephone with an empty phone number";
			}
		};

		filter(): string {
			var string = this.number;
			if (_.isString(string)) {
				string = string.replace(/[^0-9+]/, "");
			}
			return string;
		};

		toE164(): string {
			var string = this.filter();
			if (_.isString(string)) {
				var phoneNumber = phoneUtil.parse(string, this.country);
				string = phoneUtil.format(phoneNumber, PNF.E164);
			}
			return string;
		};

		toNANP(): string {
			var x = this.toE164();
			var u = x.slice(0, -10);

			if (u === "+1") {
				var y = x.slice(-4);
				var w = x.slice(-7, -4);
				var v = x.slice(-10, -7);
				return "("+v+") "+w+"-"+y;
			} else {
				return x;
			}
		};

		toPretty(): string {
			return this.toNANP();
		};

		toString(): string {
			return this.filter();
		};

		valueOf(): string {
			return this.filter();
		};

		toIphoneSafe(): string {
			var str = this.filter();
			return str.substr(str.length - 10);
		};
	}
}
