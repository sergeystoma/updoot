const redis = require('redis');
const session = require('express-session');

const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();

const config = {
    mode: 'universal',

    // Environment.
    env: {
    },

    // API routes.
    serverMiddleware: [
        session({
            store: new RedisStore({
                client: redisClient
            }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
        }),
        {
            path: 'api/login',
            handler: '~/api/login.js',
        },
        {
            path: 'api/logout',
            handler: '~/api/logout.js',
        },
        {
            path: 'api/oauth',
            handler: '~/api/oauth.js',
        },
        {
            path: 'api/me',
            handler: '~/api/me.js',
        },
        {
            path: 'api/saved',
            handler: '~/api/saved.js',
        },
        {
            path: 'api/unsave',
            handler: '~/api/unsave.js',
        },
        {
            path: 'api/save',
            handler: '~/api/save.js',
        },
        {
            path: 'api/pin',
            handler: '~/api/pin.js',
        },
        {
            path: 'api/unpin',
            handler: '~/api/unpin.js',
        },
    ],

    // Headers of the page
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || '',
            },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            {
                rel: 'stylesheet',
                href: '//fonts.googleapis.com/css?family=Calistoga|Source+Sans+Pro&display=swap',
            },
            {
                rel: 'stylesheet',
                href: '//cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css',
            }
        ],
    },

    // Customize the progress-bar color
    loading: { color: '#fff' },

    // Global CSS
    css: [],

    // Plugins to load before mounting the App
    plugins: [],

    // Nuxt.js dev-modules
    buildModules: [
        // Doc: https://github.com/nuxt-community/eslint-module
        '@nuxtjs/eslint-module',
        // Doc: https://github.com/nuxt-community/stylelint-module
        '@nuxtjs/stylelint-module',
    ],

    // Nuxt.js modules
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa',

        [
            '@nuxtjs/google-analytics',
            {
                id: 'UA-154128321-1',
            },
        ],
    ],

    // Axios module configuration
    // See https://axios.nuxtjs.org/options
    axios: {},

    // Build configuration
    build: {
        // You can extend webpack config here
        extend(/* config, ctx */) {},
    },
};

module.exports = config;
