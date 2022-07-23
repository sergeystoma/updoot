<template>
    <div
        :class="[
            'app',
            'app-theme--' + theme,
            {
                'no-outlines': hideOutlines,
            }
        ]"
        @keydown="keyDown"
        @mousedown="mouseDown"
    >
        <client-only>
            <Toolbar />
            <Grid />

            <transition name="menu-fade">
                <Menu v-if="menuVisible" />
            </transition>
        </client-only>
    </div>
</template>

<style lang="scss">
    // Colors.

    @mixin light-mode() {
        --color-text-faded: #787797;
        --color-text-main: #0e1111;
        --color-text-copy: #232b2b;
        --color-text-warning: #ff3f4f;
        --color-button-text: #fff;
        --color-button-background: #000;
        --color-button-count: #999;
        --color-attention: #ff3f4f;
        --color-background-faded: #f1f1f1;
        --color-background-main: #fff;
        --color-button-light-background: #161617;
        --color-section-separator: #eaeaea;
        --color-thing-separator: #f0f0f0;
        --color-button-dark-text: #161617;
    }

    @mixin dark-mode() {
        --color-text-faded: #909ca5;
        --color-text-main: #f1eeee;
        --color-text-copy: #dcd4d4;
        --color-text-warning: #ff3f4f;
        --color-button-text: #000;
        --color-button-background: #fff;
        --color-button-count: #999;
        --color-attention: #ff3f4f;
        --color-background-faded: #333;
        --color-background-main: #161617;
        --color-button-light-background: #f1f1f1;
        --color-section-separator: #333;
        --color-thing-separator: #242424;
        --color-button-dark-text: #f1f1f1;
    }

    .app {
        --color-landing-text: #000;
        --color-landing-hero-text: #242424;

        @include light-mode();

        &.app-theme--dark {
            @include dark-mode();
        }

        @media (prefers-color-scheme: dark) {
            @include dark-mode();

            &.app-theme--light {
                @include light-mode();
            }
        }
    }

    .app {
        background: var(--color-background-main);
    }

    body {
        position: relative;
    }

    .no-outlines {
        *, a, button {
            outline: none !important;
        }

        :focus {
            outline: none !important;
        }
    }

    .menu-fade-enter-active, .menu-fade-leave-active {
        transition: opacity .25s;
    }

    .menu-fade-enter, .menu-fade-leave-to {
        opacity: 0;
    }
</style>

<script>
    import Grid from '../components/Grid.vue';
    import Menu from '../components/Menu.vue';
    import Toolbar from '../components/Toolbar.vue';

    export default {
        components: {
            Grid,
            Menu,
            Toolbar,
        },
        data() {
            return {
                hideOutlines: true,
            };
        },
        computed: {
            menuVisible() {
                return this.$store.state.menuVisible;
            },

            theme() {
                return this.$store.state.theme || 'light';
            },
        },
        mounted() {
            this.$store.dispatch('restoreSettings');

            this.$store.dispatch('start').then(() => {
                this.$store.dispatch('loadCached').then(() => {
                    this.$store.dispatch('load');
                });
            });
        },
        methods: {
            /**
             * Hides outlines on mouse actions.
             */
            mouseDown() {
                this.hideOutlines = true;
            },

            /**
             * Shows outlines again when keyboard is engaged.
             */
            keyDown() {
                this.hideOutlines = false;
            },
        },
    };
</script>
