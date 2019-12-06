<template>
    <div class="grid">
        <masonry
            :cols="{ default: 3, 1220: 2, 800: 1 }"
            :gutter="{ default: '30px' }"
        >
            <Thing
                v-for="item in saved" 
                :key="item.name"
                :item="item"
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
            };
        },
        computed: {
            saved() {
                return this.$store.getters.saved || [];
            },
        },
        mounted() {
            this.observer = new IntersectionObserver(this.observed, {
                rootMargin: '400px 400px 400px 400px',
            });

            this.observers = {};
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
        },
    };
</script>