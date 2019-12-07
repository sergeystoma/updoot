<template>
    <div class="toolbar">
        <div class="toolbar__controls">
            <input
                v-model="search"
                type="search"
                class="toolbar__search"
                placeholder="Search..."
                @input="updateSearch"
            >

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

        background: #fff;

        border-bottom: 1px solid #f1f1f1;

        z-index: 1;
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

    .toolbar__search {
        flex: 1 0 auto;

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
        margin-left: 0;
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
            opacity: 0.4;

            animation-name: spin;
            animation-duration: 2s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
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