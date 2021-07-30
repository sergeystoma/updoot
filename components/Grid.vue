<template>
    <div
        ref="grid"
        :class="
            [
                'grid',
                'grid--' + layout
            ]"
    >
        <masonry
            :key="'masonry-' + layout"
            :cols="masonryColumns"
            :gutter="{ default: '30px' }"
        >
            <Thing
                v-for="item in saved"
                :key="item.name"
                :item="item"
                :width="width"
                :height-limit="heightLimit"
                @observe="observe"
            />
        </masonry>
    </div>
</template>

<style lang="scss">
    @import "~assets/styles/mixins.scss";

    .grid {
        position: relative;
        top: -15px;

        width: 375px;
        max-width: 100%;

        margin: auto;

        @include respond-above(sm) {
            top: -12px;

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

        &.grid--fluid {
            @include respond-above(lg1) {
                max-width: 100%;
                width: 375px + 30px + 375px + 30px + 375px + 30px + 375px;
            }

            @include respond-above(lg2) {
                max-width: 100%;
                width: 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px;
            }

            @include respond-above(lg3) {
                max-width: 100%;
                width: 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px;
            }

            @include respond-above(lg4) {
                max-width: 100%;
                width: 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px;
            }

            @include respond-above(lg5) {
                max-width: 100%;
                width: 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px;
            }

            @include respond-above(lg6) {
                max-width: 100%;
                width: 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px + 30px + 375px;
            }
        }

        @include font-main();

        a {
            @include font-main();

            text-decoration: none;
        }
    }
</style>

<script>
    import Vue from 'vue';
    import Masonry from 'vue-masonry-css';

    import Thing from './Thing.vue';

    Vue.use(Masonry);

    export default {
        components: {
            Thing,
        },
        data() {
            return {
                observer: null,
                width: null,
                heightLimit: null,
            };
        },
        computed: {
            saved() {
                return this.$store.getters.saved || [];
            },

            layout() {
                return this.$store.state.layout;
            },

            masonryColumns() {
                if (this.layout === 'one') {
                    return {
                        default: 1,
                        1220: 1,
                        800: 1,
                    };
                }

                if (this.layout === 'two') {
                    return {
                        default: 2,
                        1220: 2,
                        800: 1,
                    };
                }

                if (this.layout === 'fixed') {
                    return {
                        default: 3,
                        1220: 2,
                        800: 1,
                    };
                }

                return {
                    default: 9,
                    3650: 8,
                    3245: 7,
                    2840: 6,
                    2435: 5,
                    2030: 4,
                    1625: 3,
                    1220: 2,
                    800: 1,
                };
            },
        },
        mounted() {
            this.observer = new IntersectionObserver(this.observed, {
                rootMargin: '400px 400px 400px 400px',
            });

            this.observers = {};

            this.updateWidth();

            window.addEventListener('resize', this.updateWidth, false);
        },
        beforeDestroy() {
            if (this.observer) {
                this.observer.disconnect();
            }
        },
        methods: {
            observed(entries) {
                entries.forEach((entry) => {
                    const callback = this.observers[entry.target];

                    if (callback) {
                        callback(entry.isIntersecting);
                    }
                });
            },

            observe(options) {
                if (options.observe) {
                    this.observers[options.$el] = options.observed;
                    this.observer.observe(options.$el);
                } else {
                    delete this.observers[options.$el];
                    this.observer.unobserve(options.$el);
                }
            },

            updateWidth() {
                if (this.layout === 'one' && this.$refs.grid) {
                    this.width = this.$refs.grid.offsetWidth;
                    this.heightLimit = window.innerHeight * 0.8;
                } else {
                    this.width = null;
                }
            },
        },
    };
</script>