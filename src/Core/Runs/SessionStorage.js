export const inject = ["$sessionStorage"]

export const fn = ($sessionStorage) => {
	$sessionStorage.clear()
}
