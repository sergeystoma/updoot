<template>
    <div class="container">
        <div 
            class="hero" 
            :style="{
                height: fullscreenHeight ? `${fullscreenHeight}px` : null,
            }"
        >
            <div class="hero__content">
                <Hero class="hero__logo" />

                <h1>Updoot<small>.app</small></h1>

                <h2>Lightweight saved posts and comments organizer for Reddit</h2>

                <button
                    v-if="!loggedIn"
                    class="hero__login button button--large" 
                    @click.prevent="login"
                >
                    Sign in with Reddit
                </button>

                <button
                    v-if="loggedIn"
                    class="hero__login button button--large" 
                    @click.prevent="loadApp"
                >
                    Go to the app
                </button>

                <button
                    v-if="loggedIn"
                    class="hero__logout button button--large"
                    @click.prevent="logout"
                >
                    Sign out
                </button>

                <p class="hero__consent">
                    By signing in and using Updoot.app you agree to our terms of use and the use of cookies for the app functionality and analytics.
                </p>
            </div>            
        </div>

        <footer>
            &copy; 2019 
            Made with
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 640 512"
            ><path d="M512 32H112c-8.8 0-16 7.2-16 16v256c0 44.2 35.8 80 80 80h224c44.2 0 80-35.8 80-80v-16h32c70.6 0 128-57.4 128-128S582.6 32 512 32zm-80 272c0 17.6-14.4 32-32 32H176c-17.6 0-32-14.4-32-32V80h288v224zm80-64h-32V80h32c44.1 0 80 35.9 80 80s-35.9 80-80 80zm55.8 240H40.2c-37.3 0-50.2-48-32-48h591.7c18.1 0 5.2 48-32.1 48z" /></svg>
            and a lack of
            <svg
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512"
            ><path d="M288 29V16a16 16 0 0 0-16-16H160a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h58.12l-82.2 93.94A32 32 0 0 0 128 163v13a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16h-58.13l82.21-93.94A32 32 0 0 0 288 29zm-88 227H32a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h99.34L9.53 440.06A32.09 32.09 0 0 0 0 462.86V488a24 24 0 0 0 24 24h184a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H92.66l121.81-120.06a32.09 32.09 0 0 0 9.53-22.8V280a24 24 0 0 0-24-24zm232-32H320a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h58.12l-82.2 93.94A32 32 0 0 0 288 387v13a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16h-58.13l82.21-93.94A32 32 0 0 0 448 253v-13a16 16 0 0 0-16-16z" /></svg>.
            <a href="#">Privacy Policy</a>
            and
            <a href="#">Terms of Use</a>
        </footer>
    </div>
</template>

<style lang="scss">
    @import "~assets/styles/mixins.scss";

    .hero {
        position: relative;

        min-height: 100vh;

        display: flex;
        justify-content: center;
        align-items: center;

        overflow: hidden;

        &:before {
            content: '';

            position: absolute;

            left: 50%;
            top: 0;

            width: 100vw;
            height: 100vh;

            border-radius: 30% 70% 70% 30% / 46% 47% 53% 54%;

            z-index: -1;

            background: rgba(29, 30, 47, 0.06);

            background-color: #21D4FD;
            background-image: linear-gradient(19deg, #21D4FD 0%, #B721FF 100%);

            opacity: 0.25;

            transform: translate(-50%, -30%) rotate(30deg);
        }

        &:after {
            content: '';

            position: absolute;

            left: 0%;
            top: 0;

            width: 100vw;
            height: 100vw;

            border-radius: 25% 75% 28% 72% / 70% 23% 77% 30%;

            z-index: -1;

            background: rgba(29, 30, 47, 0.06);

            background-color: #08AEEA;
            background-image: linear-gradient(0deg, #08AEEA 0%, #2AF598 100%);

            opacity: 0.1;

            transform: translate(-20%, -20%) rotate(-30deg);
        }
    }

    .hero__content {
        position: relative;

        text-align: left;
    }

    .hero__logo {
        position: absolute;

        @media (min-width: 1024px) {
            left: -32px;
            top: -300px;

            width: 300px;
        }

        @media (min-width: 1200px) {
            left: -410px;
            top: -120px;

            width: 360px;
        }
    }

    h1 {
        margin: 0;

        
        @include font-header();
        font-size: 72px;

        color: #000;

        small {
            font-size: 32px;
        }
    }

    h2 {
        margin-bottom: 100px;

        @include font-header();
        font-size: 24px;

        color: #000;
    }

    .hero__login {
    }

    .hero__logout {
        margin-left: 10px;

        border: 1px solid #242424;
        background: transparent;

        @include font-main();
        font-size: 16px;

        color: #242424;
    }

    .hero__consent {
        max-width: 400px;

        @include font-main();
        font-size: 16px;
    }

    footer {
        position: absolute;

        left: 0;
        bottom: 40px;
        width: 100%;

        @include font-main();
        font-size: 16px;

        color: #000;

        text-align: center;

        a {
            color: #000;

            text-decoration: none;
        }

        svg {
            display: inline-block;

            height: 1em;
            
            vertical-align: -0.25em;
        }
    }
</style>

<script>
    import Hero from '../components/Hero.vue';
    import axios from 'axios';

    export default {
        components: {
            Hero,
        },
        data() {
            return {
                fullscreenHeight: null,

                loggedIn: false,
            };
        },
        mounted() {
            // Update full screen page height.
            this.updateHeight();
            window.addEventListener('resize', this.updateHeight, false);

            // Check if we are logged in.
            this.checkLoggedIn();
        },
        methods: {
            /**
             * Updates the component height so it is always matches the actual screen height, since 100vh on 
             * iOS includes the height of the toolbar.
             */
            updateHeight() {
                this.fullscreenHeight = window.innerHeight;
            },

            /**
             * Checks if there is a currently active login session.
             */
            checkLoggedIn() {
                axios.get('/api/me').then((me) => {
                    if (me && me.data && me.data.name) {
                        this.loggedIn = true;
                    }
                });
            },

            /**
             * Initiate login.
             */
            login() {
                this.$store.dispatch('login');
            },

            /**
             * Go to the app.
             */
            loadApp() {
                window.location.href = '/app';
            },

            /**
             * Logout.
             */
            logout() {
                this.$store.dispatch('logout')
            },
        },
    };
</script>