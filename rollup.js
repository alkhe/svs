const rollup = require('rollup')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-js')

rollup.rollup({
	entry: './index.js',
	plugins: [
		uglify({}, minify)
	]
}).then(bundle => {
	bundle.write({
		format: 'cjs',
		dest: './lib/svs.js'
	})
	bundle.write({
		format: 'iife',
		moduleName: 'svs',
		dest: './lib/svs-globals.js'
	})
})
