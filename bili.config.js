/** @type {import('bili').Config} */
module.exports = {
	input: 'src/Modalis.js',
	output: {
		extractCSS: false,
		format: 'esm'
	},
	plugins: {
		vue: true
	}
}
