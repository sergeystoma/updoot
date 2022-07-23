<template>
    <div class="menu">
        <div class="menu__content">
            <button
                class="menu__close"
                @click.prevent="close"
            >
                <i class="fas fa-times" />
            </button>

            <div class="menu__section menu__section-header">
                Updates history
            </div>

            <div class="menu__section">
                <p class="news-update">
                    <span class="news-update__date">July 2022</span> &mdash; <span class="news-update__text">Saved posts will now be cached locally in the browser so the search would be available right after loading.</span>
                </p>
            </div>

            <div class="menu__section menu__section-header">
                Layout <small>Mostly affects wide screens only</small>
            </div>

            <div class="menu__section">
                <button
                    :class="[
                        'button',
                        'button--toggle',
                        {
                            'button--toggle-active': layout === 'fixed',
                        }
                    ]"
                    @click.prevent="setLayout('fixed')"
                >
                    Default &mdash; Up to three columns
                </button>

                <button
                    :class="[
                        'button',
                        'button--toggle',
                        {
                            'button--toggle-active': layout === 'one',
                        }
                    ]"
                    @click.prevent="setLayout('one')"
                >
                    One column
                </button>

                <button
                    :class="[
                        'button',
                        'button--toggle',
                        {
                            'button--toggle-active': layout === 'two',
                        }
                    ]"
                    @click.prevent="setLayout('two')"
                >
                    Up to two columns
                </button>

                <button
                    :class="[
                        'button',
                        'button--toggle',
                        {
                            'button--toggle-active': layout === 'fluid',
                        }
                    ]"
                    @click.prevent="setLayout('fluid')"
                >
                    Dynamic
                </button>
            </div>

            <div class="menu__section menu__section-header">
                <span
                    class="menu__nsfw"
                ><i class="fas fa-exclamation-triangle" /> nsfw</span> Handling
            </div>

            <div class="menu__section">
                <button
                    :class="[
                        'button',
                        'button--toggle',
                        {
                            'button--toggle-active': filterNsfw == null,
                        }
                    ]"
                    @click.prevent="setNsfwFilter(null)"
                >
                    Don't filter posts
                </button>

                <button
                    :class="[
                        'button',
                        'button--toggle',
                        {
                            'button--toggle-active': filterNsfw === 1,
                        }
                    ]"
                    @click.prevent="setNsfwFilter(1)"
                >
                    No NSFW posts
                </button>

                <button
                    :class="[
                        'button',
                        'button--toggle',
                        {
                            'button--toggle-active': filterNsfw === 2,
                        }
                    ]"
                    @click.prevent="setNsfwFilter(2)"
                >
                    Only NSFW posts
                </button>
            </div>

            <div class="menu__section">
                <button
                    :class="[
                        'button',
                        'button--toggle',
                        {
                            'button--toggle-active': showNsfw === false
                        }
                    ]"
                    @click.prevent="setShowNsfw(false)"
                >
                    Blur NSFW
                </button>

                <button
                    :class="[
                        'button',
                        'button--toggle',
                        {
                            'button--toggle-active': showNsfw === true,
                        }
                    ]"
                    @click.prevent="setShowNsfw(true)"
                >
                    Unmask content
                </button>
            </div>

            <div class="menu__section menu__section-header">
                <button
                    v-if="anySelected"
                    class="button button--action menu__filter-clear"
                    @click.prevent="clearSubreddits"
                >
                    Clear
                </button>
                Filter by subreddit
            </div>

            <div class="menu__section">
                <input
                    v-model="filterSubreddits"
                    type="search"
                    placeholder="Find a subreddit..."
                    class="menu__filter-subreddit"
                >
            </div>

            <div class="menu__section">
                <button
                    v-for="subreddit in filteredSubreddits"
                    :key="subreddit.name"
                    :class="[
                        'button',
                        'button--toggle',
                        {
                            'button--toggle-active': subreddit.selected,
                        }
                    ]"
                    @click.prevent="toggleSubreddit(subreddit)"
                >
                    {{ subreddit.name }}
                    <span class="button__count">
                        {{ subreddit.count }}
                    </span>
                </button>
            </div>

            <div class="menu__section menu__section-header">
                Support
            </div>

            <div class="menu__section">
                <a
                    href="https://github.com/sergeystoma/updoot/issues"
                    target="_blank"
                    :class="[
                        'button',
                        'button--action',
                    ]"
                >
                    Issues tracker @ GitHub
                </a>
            </div>

            <div class="menu__section menu__section-header">
                Account
            </div>

            <div class="menu__section">
                <button
                    :class="[
                        'button',
                        'button--action',
                    ]"
                    @click.prevent="logout"
                >
                    Sign out
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "~assets/styles/mixins.scss";

    .menu {
        position: absolute;

        left: 0;
        top: 0;

        width: 100%;
        min-height: 100%;

        background: #fff;

        z-index: 2;
    }

    .menu__content {
        position: relative;

        padding: 70px 20px 20px;

        width: 375px;
        max-width: 100%;

        margin: auto;

        background: #fff;

        box-sizing: border-box;

        @include respond-above(sm) {
            max-width: 400px;

            border-radius: 20px;
        }

        @include respond-above(md) {
            max-width: 100%;
            width: 375px + 30px + 375px;
        }

        @include respond-above(lg) {
            max-width: 100%;
            width: 375px + 30px + 375px + 30px + 375px;
        }

        @include font-main();

        a {
            @include font-main();

            text-decoration: none;
        }
    }

    .menu__close {
        position: absolute;

        right: 0px;
        top: 8px;

        width: 40px;
        height: 40px;

        text-align: center;
        font-size: 16px;
        line-height: 40px;

        border: none;
        background: transparent;

        cursor: pointer;

        @include respond-above(sm) {

        }
    }

    .menu__section {
        display: flex;

        flex-wrap: wrap;

        clear: both;

        button {
            flex: 0 0 auto;

            margin: 5px;
        }

        &:not(.menu__section-header) + .menu__section {
            position: relative;

            margin-top: 30px;

            &:before {
                content: '';

                position: absolute;

                left: 8px;
                right: 20%;
                top: -15px;

                height: 1px;

                background: #eaeaea;
            }
        }
    }

    .menu__section-header {
        display: block;

        margin-left: 8px;
        margin-bottom: 15px;

        font-size: 18px;
    }

    .menu__nsfw {
        margin-right: 5px;

        color: $color-text-warning;

        font-size: 16px;
        vertical-align: 1px;

        i {
            font-size: 10px;
            margin-right: -2px;
        }
    }

    .menu__filter-subreddit {
        width: 100%;

        height: 40px;
        padding: 0 20px;

        @include font-main();
        font-size: 18px;
        line-height: 40px;

        border-radius: 10px;
        border: none;

        color: #000 ;
        background: #f1f1f1;

        &:focus {
            outline: none;
        }

    }

    .menu__filter-clear {
        float: right;

        position: relative;

        top: -16px;
    }

    .news-update {
        margin: 5px 0 15px 10px;
    }

    .news-update__date {
        display: inline-block;

        margin-right: 5px;

        color: #ff3f4f;
    }
</style>

<script>
    export default {
        data() {
            return {
                filterSubreddits: '',
            };
        },
        computed: {
            filterNsfw() {
                return this.$store.state.filterNsfw;
            },

            showNsfw() {
                return this.$store.state.showNsfw;
            },

            layout() {
                return this.$store.state.layout;
            },

            saved() {
                return this.$store.getters.saved || [];
            },

            subreddits() {
                const all = this.$store.state.availableSubreddits;
                const selected = this.$store.state.subreddits;

                const counts = {};

                this.saved.forEach(s => {
                    if (counts[s.subreddit] == null) {
                        counts[s.subreddit] = 0;
                    }

                    counts[s.subreddit] += 1;
                });

                return all.map(s => ({
                    name: s,
                    count: counts[s],
                    selected: selected.includes(s),
                }));
            },

            filteredSubreddits() {
                if (this.filterSubreddits.length > 0) {
                    const filterBy = this.filterSubreddits.toUpperCase();

                    return this.subreddits.filter(s => s.name.toUpperCase().includes(filterBy));
                }

                return this.subreddits;
            },

            anySelected() {
                return this.subreddits.some(s => s.selected);
            },
        },
        methods: {
            close() {
                this.$store.dispatch('showMenu', false);
            },

            setNsfwFilter(status) {
                this.$store.dispatch('setNsfwFilter', status);
            },

            setShowNsfw(status) {
                this.$store.dispatch('setShowNsfw', status);
            },

            setLayout(type) {
                this.$store.dispatch('setLayout', type);
            },

            toggleSubreddit(subreddit) {
                if (subreddit.selected) {
                    this.$store.dispatch('removeSubreddit', subreddit.name);
                } else {
                    this.$store.dispatch('addSubreddit', subreddit.name);
                }
            },

            clearSubreddits() {
                this.$store.dispatch('clearSubreddits');
            },

            logout() {
                this.$store.dispatch('logout');
            },
        },
    };
</script>
