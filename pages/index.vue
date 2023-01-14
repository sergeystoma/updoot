<template>
    <div class="container">
        <div
            class="hero"
            :style="{
                height: fullscreenHeight ? `${fullscreenHeight}px` : null,
            }"
        >
            <div class="hero__content">
                <img
                    class="hero__logo"
                    src="/hero.jpg"
                    alt="Looking for that special recipe that you lost and couldn't find again because you have 1000 saved posts and comments..."
                >

                <h1>Updoot<small>.app</small></h1>

                <h2>Lightweight Reddit saved posts and comments manager and organizer</h2>

                <ul class="hero__features">
                    <li>Safely connect to your Reddit account</li>
                    <li>Search for anything using our smart search so you can find stuff even if someone spelled it "pnckes"</li>
                    <li>Unclutter and unsave no longer necessary posts, or change your mind and save them back</li>
                    <li>Temporarily pin posts to the top of your list</li>
                </ul>

                <button
                    v-if="!loggedIn"
                    class="hero__login button button--hero button--large"
                    @click.prevent="login"
                >
                    Sign in with Reddit
                </button>

                <button
                    v-if="loggedIn"
                    class="hero__login button button--hero button--large"
                    @click.prevent="loadApp"
                >
                    Go to the app
                </button>

                <button
                    v-if="loggedIn"
                    class="hero__logout button button--hero button--large"
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
            &copy; 2022
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
            <a href="https://www.termsfeed.com/privacy-policy/f0bfd7e40e92346fa5b05c5f0fe51a2b">Privacy Policy</a>
            and
            <a href="https://www.termsfeed.com/terms-conditions/5b2690df517070518303bd8e32c80b91">Terms of Use</a>.
            <a href="https://github.com/sergeystoma/updoot/issues">Issues &amp; Support.</a>
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

        background: var(--color-background-main);
    }

    .hero__content {
        position: relative;

        padding: 0 10px;
        margin-top: -50px;

        text-align: left;

        @media (min-width: 768) {
            padding: 0px;
            margin: 0;
        }
    }

    .hero__logo {
        position: absolute;

        display: none;

        content: var(--index-page-logo);

        @media (min-width: 768px) {
            display: block;

            width: 400px;
            height: 707px;

            left: 55%;
            top: 50%;
            transform: translate(0, 0%);

            opacity: 0.4;
        }

        @media (min-width: 1024px) {
            display: block;

            width: 400px;
            height: 707px;

            left: -410px;
            top: 50%;
            transform: translate(0, -50%);

            opacity: 1;
        }
    }

    h1 {
        margin: 0;

        @include font-header();
        font-size: 48px;

        color: var(--color-landing-text);

        small {
            font-size: 24px;
        }

        @media (min-width: 768) {
           font-size: 72px;

           small {
                font-size: 32px;
            }
        }
    }

    h2 {
        margin-top: 20px;
        margin-bottom: 20px;

        @media (min-width: 768px) {
            margin-bottom: 50px;
        }

        @media (min-height: 750px) {
            margin-bottom: 80px;
        }

        @media (min-height: 850px) {
            margin-bottom: 100px;
        }

        @include font-header();
        font-size: 24px;

        color: var(--color-landing-text);
    }

    .hero__features {
        position: relative;

        max-width: 700px;
        margin: 0;
        padding: 0;

        columns: 2;

        @include font-main();
        font-size: 15px;

        color: var(--color-landing-hero-text);

        margin-bottom: 30px;

        z-index: 1;

        @media (min-width: 768px) {
            font-size: 18px;

            margin-bottom: 50px;
        }

        @media (min-height: 750px) {
            margin-bottom: 80px;
        }

        @media (min-height: 850px) {
            margin-bottom: 100px;
        }

        li {
            display: block;

            margin: 0;
            padding: 0;

            margin-bottom: 20px;
        }
    }

    .hero__login {
        background: var(--color-button-background);
        color: var(--color-button-text);
    }

    .hero__logout {
        margin-left: 10px;

        border: 1px solid var(--color-landing-text);
        background: transparent;

        @include font-main();
        font-size: 16px;

        color: var(--color-landing-text);
    }

    .hero__consent {
        max-width: 400px;

        @include font-main();
        font-size: 16px;

        color: var(--color-text-main);
    }

    footer {
        position: absolute;

        padding: 0 10px;

        left: 0;
        bottom: 10px;
        width: 100%;

        @include font-main();
        font-size: 14px;

        color: var(--color-landing-text);

        text-align: center;

        @media (min-width: 768px) {
            font-size: 16px;

            bottom: 40px;
        }

        a {
            color: var(--color-landing-text);

            text-decoration: none;
        }

        svg {
            display: inline-block;

            height: 1em;

            vertical-align: -0.25em;

            fill: var(--color-landing-text);
        }
    }
</style>

<script>
    import axios from 'axios';

    export default {
        components: {
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
