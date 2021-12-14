namespace lt {
	export class TitleService implements ITitleService {
		static $inject = ["$transitions", "$state", "$window"];
		constructor(protected $transitions: any, protected $state: IStateService, protected $window: ng.IWindowService) {
			this.$window.document.title = "";

			this.$transitions.onEnter({}, (trans: any) => {
				this.setTitle(this.getStateTitle(trans.to()));
			});

			this.resetTitle();
		}

		protected getCurrentStateTitle () {
			return this.getStateTitle(this.$state.current);
		}

		protected getStateTitle (state: lt.IState) {
			var x = state.title;
			if (!x && !_.isString(x) && state.name !== "") {
				console.warn("A title must be set for this route! ("+state.name+")");
				x = "Yaptive";
			}
			return x;
		}

		public getTitle () {
			return this.$window.document.title;
		}

		public setTitle (newTitle: string) {
			this.$window.document.title = newTitle;
		}

		protected resetTitle () {
			this.setTitle(this.getCurrentStateTitle());
		}
	}

	angular.module("lt.core").service("$title", TitleService);
}
