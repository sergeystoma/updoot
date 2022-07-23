<template>
    <div class="toast">
        <span>{{ message }}</span>
    </div>
</template>

<style lang="scss">
    @import "~assets/styles/mixins.scss";

    .toast {
        position: absolute;

        left: 50%;
        top: 11px;

        transform: translate(-50%, 0);

        padding: 0 15px;

        height: 30px;
        line-height: 30px;
        border-radius: 40px;

        background: var(--color-button-background);
        color: var(--color-button-text);

        @include font-main();
        font-size: 16px;

        white-space: nowrap;
    }
</style>

<script>
    export default {
        props: {
            message: {
                type: String,
                default: '',
            },
        },
    };
</script>
