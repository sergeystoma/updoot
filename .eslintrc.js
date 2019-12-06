module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
    },
    extends: ['plugin:vue/recommended', 'eslint:recommended'],
    rules: {
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/html-indent': [
            'error',
            4,
        ],
        'vue/no-v-html': 'off',
        'vue/script-indent': [
            'error',
            4,
            {
                baseIndent: 1,
                switchCase: 0,
                ignores: [],
            },
        ],
    },
    globals: {
        $nuxt: true,
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
