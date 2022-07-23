<template>
    <div class="toolbar">
        <div class="toolbar__controls">
            <div class="toolbar__input">
                <input
                    v-model="search"
                    type="text"
                    class="toolbar__search"
                    :placeholder="searchPlaceholder"
                    @input="updateSearch"
                >

                <span
                    v-show="hasBubble"
                    class="toolbar__bubble"
                >
                    <span>{{ savedCount }}</span>
                </span>
            </div>

            <button
                :class="[
                    'toolbar__reload',
                    {
                        'toolbar__reload--loading': loading
                    }
                ]"
                aria-label="Reload"
                @click.prevent="reload"
            >
                <i
                    v-if="!loading"
                    class="fas fa-redo"
                />
                <i
                    v-if="loading"
                    class="fas fa-circle-notch"
                />
            </button>

            <button
                class="toolbar__menu"
                aria-label="Menu"
                @click.prevent="showMenu"
            >
                <i class="fas fa-bars" />
            </button>
        </div>
    </div>
</template>

<style lang="scss">
    @import "~assets/styles/mixins.scss";

    .toolbar {
        position: relative;

        height: 60px;

        background: var(--color-background-main);

        border-bottom: 1px solid var(--color-background-faded);

        z-index: 1;
    }

    button {
        color: var(--color-button-dark-text);
        background: transparent;
        border: none;
    }

    .toolbar__controls {
        display: flex;

        width: 375px;
        height: 60px;
        max-width: 100%;

        padding-left: 5px;

        margin: auto;

        justify-content: center;
        align-items: center;

        @include respond-above(sm) {
            padding-left: 0;

            max-width: 400px;
        }

        @include respond-above(md) {
            max-width: 100%;
            width: 375px + 30px + 375px;
        }

        @include respond-above(lg) {
            max-width: 100%;
            width: 375px + 30px + 375px + 30px + 375px;
        }
    }

    .toolbar__input {
        position: relative;

        flex: 1 0 auto;
    }

    .toolbar__search {
        display: inline-block;

        width: 100%;
        height: 40px;
        padding: 0 20px;

        @include font-main();
        font-size: 18px;
        line-height: 40px;

        border-radius: 10px;
        border: none;

        color: var(--color-button-dark-text);
        background: var(--color-background-faded);

        &:focus {
            outline: none;
        }
    }

    .toolbar__bubble {
        position: absolute;
        display: flex;

        justify-content: center;
        align-items: center;

        padding: 0 8px;

        height: calc(100% - 12px);
        top: 6px;
        right: 6px;
        border-radius: 9px;

        background: var(--color-button-light-background);
        color: var(--color-button-text);

        span {
            @include font-main();
            font-size: 16px;
            line-height: 1;
        }
    }

    .toolbar__reload, .toolbar__menu {

        flex: 0 0 auto;

        margin-left: 10px;

        width: 40px;
        height: 40px;

        border: none;
        background: none;

        cursor: pointer;
    }

    .toolbar__menu {
        position: relative;

        margin-left: 0;

        &:after {
            content: '';

            position: absolute;

            width: 8px;
            height: 8px;

            right: 3px;
            top: 3px;

            border-radius: 8px;

            background: #dd5368;
        }
    }

    @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
    }

    .toolbar__reload {
        margin-left: 12px;

        &.toolbar__reload--loading {
            i {
                opacity: 0.4;

                animation-name: spin;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-timing-function: linear;
            }
        }
    }
</style>

<script>
    import debounce from 'debounce';

    export default {
        data() {
            return {
                search: '',
            };
        },
        computed: {
            loading() {
                return this.$store.state.loading;
            },

            saved() {
                return this.$store.getters.saved || [];
            },

            savedCount() {
                return this.saved.length;
            },

            cachingCount() {
                return this.$store.state.caching ? this.$store.state.caching.length : null;
            },

            hasBubble() {
                return this.search && this.search.length > 1;
            },

            searchPlaceholder() {
                if (this.savedCount === 0) {
                    if (this.loading) {
                        return 'Search (still loading)...';
                    } else {
                        return 'Search...';
                    }
                } else {
                    if (this.loading) {
                        if (this.cachingCount != null) {
                            return `Search ${this.savedCount} posts while refreshing (${this.cachingCount} so far...)`;
                        } else {
                            return `Search ${this.savedCount} (and still loading) saved posts...`;
                        }
                    } else {
                        return `Search ${this.savedCount} saved posts`;
                    }
                }
            },
        },
        mounted() {
            this.doSearchDebounce = debounce(this.doSearch, 250);
        },
        methods: {
            showMenu() {
                this.$store.dispatch('showMenu', true);
            },

            updateSearch() {
                this.doSearchDebounce();
            },

            doSearch() {
                this.$store.dispatch('setSearch', this.search);
            },

            reload() {
                this.$store.dispatch('reload');
            },
        },
    };
</script>
