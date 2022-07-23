import axios from 'axios';
import Fuse from 'fuse.js';
import decode from 'unescape';
import sanitizeHtml from 'sanitize-html';
import aes from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

// When enabled, use naive filtering/searching algorithm instead of Fuse.js.
const useNaiveFilter = false;

export const state = () => ({
    /**
     * Show NSFW images or show blurred content.
     */
    showNsfw: false,

    /**
     * Just a loading indicator.
     */
    loading: false,

    /**
     * Saved posts.
     */
    saved: [],

    /**
     * Loading in progress posts.
     */
    caching: null,

    /**
     * Is main menu visible.
     */
    menuVisible: false,

    /**
     * Current search terms.
     */
    search: null,

    /**
     * Current Fuse instance. In the state because there are reactive things depending on it.
     */
    fuseInstance: null,

    /**
     * Filters NSFW content: null - No filtering, 1 - No NSFW, 2 - Only NSFW.
     */
    filterNsfw: null,

    /**
     * Available subreddits.
     */
    availableSubreddits: [],

    /**
     * Filter by subreddits.
     */
    subreddits: [],

    /**
     * Selected layout type.
     */
    layout: 'fixed',

    /**
     * State encryption token.
     */
    tokenHash: '',
});

/**
 * Saves state in the session.
 */
function saveSettings(state) {
    localStorage.setItem('settings', JSON.stringify({
        showNsfw: state.showNsfw,
        filterNsfw: state.filterNsfw,
        subreddits: state.subreddits,
        layout: state.layout,
    }));
}

/**
 * Restores state from a session.
 */
function restoreSettings(state) {
    // On load, restore state from session storage.
    let savedSettings = localStorage.getItem('settings') || sessionStorage.getItem('settings');

    try {
        savedSettings = JSON.parse(savedSettings);
    } catch (e) {
        savedSettings = null;
    }

    state.showNsfw = savedSettings && savedSettings.showNsfw != null ? savedSettings.showNsfw : state.showNsfw;
    state.filterNsfw = savedSettings && savedSettings.showNsfw != null ? savedSettings.filterNsfw : state.filterNsfw;
    state.subreddits = savedSettings && savedSettings.showNsfw != null ? savedSettings.subreddits : state.subreddits;

    state.layout = savedSettings && savedSettings.layout ? savedSettings.layout : 'fixed';
}

/**
 * Ensure flags and pre-compute data.
 */
function preprocess(saved) {
    var now = (new Date().getTime()) / 1000;

    saved.forEach((s) => {
        s.visible = true;
        s.saved = true;

        if (s.pinned == null) {
            s.pinned = false;
        }

        s.searchable = `${s.title} ${s.text} ${s.author} ${s.subreddit}`.toUpperCase();

        // Cleanup title.
        s.title = decode(s.title);

        // Clean up body HTML.
        s.html = sanitizeHtml(decode(s.html), {
            allowedTags: ['a'],
            allowedAttributes: {
                'a': ['href', 'target']
            },
            transformTags: {
                'a': sanitizeHtml.simpleTransform('a', { target: '_blank' }, true),
            },
        });

        // Normalize body text.
        if (s.html && s.html.length === 0) {
            s.html = null;
        }

        // Normalize title.
        if (s.title && s.title.length === 0) {
            s.title = null;
        }

        // Decode the URL, there could be html entities.
        s.url = s.url ? decode(s.url) : null;

        // Clean up self references.
        if (s.domain && s.domain.startsWith('self.')) {
            s.domain = null;
        }

        // Calculate relative dates.
        if (s.created_utc) {
            const diff = now - s.created_utc;

            let relative = null;

            if (diff <= 1) {
                relative = '1s';
            } else if (diff < 60) {
                relative = `${diff.toFixed(0)}s`;
            } else if (diff < 60 * 60) {
                relative = `${Math.floor(diff / 60)}m`;
            } else if (diff < 60 * 60 * 24) {
                relative = `${Math.floor(diff / 60 / 60)}h`;
            } else if (diff < 60 * 60 * 24 * 30) {
                // Getting into approximate territory.
                relative = `${Math.floor(diff / 60 / 60 / 24)}d`;
            } else if (diff < 60 * 60 * 24 * 30 * 12) {
                // Getting into approximate territory.
                relative = `${Math.floor(diff / 60 / 60 / 24 / 30)}mo`;
            } else {
                // Getting into approximate territory.
                relative = `${Math.floor(diff / 60 / 60 / 24 / 30 / 12)}y`;
            }

            s.relativeTime = relative;
        }
    });
}

/**
 * Post process state after updating saved posts.
 */
function postprocess(state) {
    // Sort by pinned status.
    // We are sorting on load to avoid things jumping up and down in the list.
    state.saved = state.saved.filter(s => s.pinned).concat(state.saved.filter(s => !s.pinned));

    // Collect available subreddits.
    state.availableSubreddits = [...new Set(state.saved.map(x => x.subreddit))].sort();

    // Rebuild an index.
    const options = {
        keys: [
            {
                name: 'title',
                weight: 4,
            },
            {
                name: 'text',
                weight: 3,
            },
            'subreddit',
            'author'
        ],
        minMatchCharLength: 2,
        useExtendedSearch: true,
        ignoreLocation: true,
    };

    state.fuseInstance = new Fuse(state.saved, options);
}

/**
 * Checks if the strings contains all tokens.
 */
function checkTokens(s, tokens) {
    for (let i = 0; i < tokens.length; i += 1) {
        if (!s.includes(tokens[i])) {
            return false;
        }
    }

    return true;
}

export const getters = {
    /**
     * Gets the list of posts filtered by currently active filters and search terms.
     */
    saved(state) {
        let posts = state.saved;

        // Apply search.
        if (state.fuseInstance && state.search && state.search.length > 1) {
            if (useNaiveFilter) {
                const tokens = state.search.split(' ').map(x => x.trim().toUpperCase()).filter(x => x.length > 0);

                posts = state.saved.filter((s) => {
                    if (checkTokens(s.searchable, tokens)) {
                        return true;
                    }

                    return false;
                });
            } else {
                posts = state.fuseInstance.search(state.search).map(r => r.item);
            }
        }

        // Apply filters.
        if (state.filterNsfw === 1) {
            posts = posts.filter(p => !p.nsfw);
        } else if (state.filterNsfw === 2) {
            posts = posts.filter(p => p.nsfw);
        }

        // Filter by subreddit.
        const validSubreddits = state.subreddits.filter(s => state.availableSubreddits.includes(s));

        if (validSubreddits.length > 0) {
            posts = posts.filter(p => validSubreddits.includes(p.subreddit));
        }

        return posts;
    },
};

export const mutations = {
    SET_LOADING(state, status) {
        state.loading = status;
    },

    SET_TOKEN_HASH(state, hash) {
        state.tokenHash = hash;
    },

    SET_SAVED(state, { saved, reset, firstTime }) {
        preprocess(saved);

        if (firstTime) {
            // Update posts right away while we are hydrating the cache.
            if (reset) {
                state.saved = saved;
            } else {
                state.saved.push(...saved);
            }

            postprocess(state);
        } else {
            // Accumulate posts in the cache first.
            if (reset) {
                state.caching = saved;
            } else {
                state.caching.push(...saved);
            }
        }
    },

    SET_CACHING_START(state) {
        state.caching = [];
    },

    SET_SAVED_DONE(state, { firstTime }) {
        if (!firstTime) {
            // Swap the loaded state and the cache.
            state.saved = state.caching;

            state.caching = null;

            postprocess(state);
        }

        // Save in the browser cache.
        try {
            const encryptedData = aes.encrypt(JSON.stringify(state.saved), state.tokenHash);

            const formattedCache = encryptedData.toString();

            localStorage.setItem('CACHED_POSTS', formattedCache);
        } catch (e) {
            // Nothing.
        }
    },

    SET_MENU(state, status) {
        state.menuVisible = status;
    },

    SET_SEARCH(state, text) {
        state.search = text;
    },

    SET_FILTER_NSFW(state, status) {
        state.filterNsfw = status;

        saveSettings(state);
    },

    SET_SHOW_NSFW(state, status) {
        state.showNsfw = status;

        saveSettings(state);
    },

    ADD_SUBREDDIT(state, name) {
        state.subreddits.push(name);

        saveSettings(state);
    },

    REMOVE_SUBREDDIT(state, name) {
        state.subreddits = state.subreddits.filter(x => x !== name);

        saveSettings(state);
    },

    CLEAR_SUBREDDITS(state) {
        state.subreddits = [];

        saveSettings(state);
    },

    RESTORE_SETTINGS(state) {
        restoreSettings(state);
    },

    SET_ITEM_SAVED(_, { item, saved }) {
        item.saved = saved;
    },

    SET_ITEM_PINNED(_, { item, pinned }) {
        item.pinned = pinned;
    },

    SET_LAYOUT(state, type) {
        state.layout = type;

        saveSettings(state);
    },
};

export const actions = {
    /**
     * Check logged in state on start.
     */
    start({ commit, dispatch }) {
        return dispatch('apiGet', '/api/me').then((me) => {
            commit('SET_TOKEN_HASH', me.token);

            return me.name;
        });
    },

    /**
     * Restore posts from the cached state.
     */
    loadCached({ commit, state }) {
        return new Promise((resolve) => {
            try {
                const encryptedData = localStorage.getItem('CACHED_POSTS');

                if (encryptedData) {
                    const savedData = aes.decrypt(encryptedData, state.tokenHash);

                    if (savedData) {
                        const data = JSON.parse(savedData.toString(encUtf8));

                        commit('SET_SAVED', {
                            saved: data,
                            reset: true,
                            firstTime: true,
                        });
                    }
                }
            } catch (e) {
                // Nothing.
            }

            resolve();
        });
    },

    /**
     * Loads all saved posts.
     */
    load({ state, commit, dispatch }) {
        let after = null;

        const firstTime = state.saved.length === 0;

        function worker() {
            dispatch('apiGet', after ? `/api/saved?after=${encodeURIComponent(after)}` : '/api/saved').then((saved) => {
                commit('SET_SAVED', {
                    saved,
                    reset: after == null,
                    firstTime,
                });

                if (saved.length > 0) {
                    after = saved[saved.length - 1].name;
                    worker();
                } else {
                    commit('SET_SAVED_DONE', {
                        firstTime,
                    });
                    commit('SET_LOADING', false);
                }
            });
        }

        if (!firstTime) {
            commit('SET_CACHING_START');
        }

        commit('SET_LOADING', true);

        worker();
    },

    /**
     * Sends a GET request to API.
     */
    apiGet({ dispatch }, url) {
        return axios.get(url).then((data) => {
            return data.data;
        }).catch((error) => {
            if (error.response.status === 401) {
                dispatch('logout');
            }
        });
    },

    /**
     * Sends a POST request to API.
     */
    apiPost({ dispatch }, url) {
        return axios.post(url).then((data) => {
            return data.data;
        }).catch((error) => {
            if (error.response.status === 401) {
                dispatch('logout');
            } else {
                throw error;
            }
        });
    },

    /**
     * Begin OAuth login.
     */
    login() {
        window.location.href = '/api/login';
    },

    /**
     * Log from the current session.
     */
    logout() {
        axios.post('/api/logout').then(() => {
            window.location.href = '/';
        }).catch(() => {
            window.location.href = '/';
        });
    },

    /**
     * Shows the menu overlay.
     */
    showMenu({ commit }, status) {
        commit('SET_MENU', status);
    },

    /**
     * Set search.
     */
    setSearch({ commit }, text) {
        commit('SET_SEARCH', text);
    },

    /**
     * Set NSFW filter.
     */
    setNsfwFilter({ commit }, status) {
        commit('SET_FILTER_NSFW', status);
    },

    /**
     * Unmask NSFW content.
     */
    setShowNsfw({ commit }, status) {
        commit('SET_SHOW_NSFW', status);
    },

    /**
     * Add a subreddit to filters.
     */
    addSubreddit({ commit }, name) {
        commit('ADD_SUBREDDIT', name);
    },

    /**
     * Removes a subreddit to filters.
     */
    removeSubreddit({ commit }, name) {
        commit('REMOVE_SUBREDDIT', name);
    },

    /**
     * Clears all subreddit filters.
     */
    clearSubreddits({ commit }) {
        commit('CLEAR_SUBREDDITS');
    },

    /**
     * Restores sessions from the previous session.
     */
    restoreSettings({ commit }) {
        commit('RESTORE_SETTINGS');
    },

    /**
     * Unsaves the post.
     */
    unsave({ dispatch, commit }, item) {
        dispatch('apiPost', `/api/unsave?item=${encodeURIComponent(item.name)}`).then(() => {
            commit('SET_ITEM_SAVED', {
                item,
                saved: false,
            });
        }).catch(() => {
        });
    },

    /**
     * Saves the post.
     */
    resave({ dispatch, commit }, item) {
        dispatch('apiPost', `/api/save?item=${encodeURIComponent(item.name)}`).then(() => {
            commit('SET_ITEM_SAVED', {
                item,
                saved: true,
            });
        }).catch(() => {
        });
    },

    /**
     * Unpin the post.
     */
    unpin({ dispatch, commit }, item) {
        dispatch('apiPost', `/api/unpin?item=${encodeURIComponent(item.name)}`).then(() => {
            commit('SET_ITEM_PINNED', {
                item,
                pinned: false,
            });
        }).catch(() => {
        });
    },

    /**
     * Pins the post.
     */
    pin({ dispatch, commit }, item) {
        dispatch('apiPost', `/api/pin?item=${encodeURIComponent(item.name)}`).then(() => {
            commit('SET_ITEM_PINNED', {
                item,
                pinned: true,
            });
        }).catch(() => {
        });
    },

    /**
     * Reload saved posts.
     */
    reload({ dispatch, commit }) {
        dispatch('apiGet', '/api/me').then((me) => {
            commit('SET_TOKEN_HASH', me.token);

            dispatch('load');
        });
    },

    /**
     * Selects layout type.
     */
    setLayout({ commit }, type) {
        commit('SET_LAYOUT', type);
    },
};
