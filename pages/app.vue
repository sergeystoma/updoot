<template>
    <div
        :class="[
            'app',
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

        }
    };
</script>
