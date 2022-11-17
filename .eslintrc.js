module.exports = {
	parser: 'vue-eslint-parser',
	plugins: ['prettier'],
	extends: [
		'plugin:vue/vue3-recommended',
		'plugin:prettier/recommended',
		'plugin:unicorn/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
	],
	parserOptions: {
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
			},
		},
	},
	rules: {
		'vue/multi-word-component-names': [0],
		quotes: [1, 'single'],
		indent: [0],
		'unicorn/filename-case': [0],
		'unicorn/prefer-module': [0],
		'unicorn/explicit-length-check': [0],
		'unicorn/prevent-abbreviations': [
			0,
			{
				allowList: {
					props: true,
				},
			},
		],
		'unicorn/no-null': [0],
		'unicorn/numeric-separators-style': [0],
		'unicorn/no-this-assignment': [0],
		'unicorn/prefer-add-event-listener': [0],
		'unicorn/no-array-reduce': [0],
		'import/no-unresolved': [2],
		'import/no-named-as-default': [0],
		'import/order': [
			2,
			{
				alphabetize: {
					caseInsensitive: true,
					order: 'asc',
				},
				'newlines-between': 'always',
				groups: [
					'builtin',
					'external',
					['internal', 'parent', 'sibling', 'index'],
				],
				pathGroups: [
					{
						pattern: '~/**',
						group: 'internal',
						patternOptions: {
							nocomment: true,
						},
						position: 'after',
					},
				],
			},
		],
	},
}
