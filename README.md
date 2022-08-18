# Updoot.app

Lightweight Reddit saved posts and comments manager — [Updoot.app](https://updoot.app)

## Prerequisites

* node (above v14 should be fine)
* redis

## Build Setup

```bash
# Ensure that there is a local Redis instance for session storage.

# Install dependencies
$ yarn install

# Serve with hot reload at localhost:3000
$ OAUTH_CLIENT=... OAUTH_SECRET=... OAUTH_REDIRECT=... yarn dev

For example, running localy with a dev server:
$ OAUTH_CLIENT=... OAUTH_SECRET=... OAUTH_REDIRECT=http://localhost:3000/api/oauth SESSION_SECRET=... yarn dev

# OAUTH_CLIENT and OAUTH_SECRET - Reddit API parameters from the app registration (https://ssl.reddit.com/prefs/apps/)
# OAUTH_REDIRECT - OAuth login redirect target, can be a local URL
# SESSION_SECRET - Express.js session key (https://expressjs.com/en/resources/middleware/session.html), a random string

# Build for production and launch server
$ yarn build
$ yarn start

# Generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Internals

TODO: Document architecture, runtime configuration, etc.
