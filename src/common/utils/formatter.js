export default {
	format_stx_integers: (n) => {
		return String(parseFloat(n/1000000).toFixed(6))
	}
}