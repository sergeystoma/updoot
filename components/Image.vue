<template>
    <a
        :href="'https://reddit.com' + item.permalink"
        target="_blank"       
        class="preview__image"
        :style="{
            backgroundImage: previewImage(preview)
        }"
    />
</template>

<script>
    import decode from 'unescape';

    export default {
        props: {
            item: {
                type: Object,
                default: null,
            },
            preview: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                visible: false,
            };
        },
        mounted() {
            this.$emit('observe', {
                $el: this.$el,
                observe: true,
                observed: this.observed,
            });
        },
        beforeDestroy() {
            this.$emit('observe', {
                $el: this.$el,
                observe: false,
                observed: this.observed,
            });
        },
        methods: {
            previewImage(preview) {
                return this.visible ? `url(${encodeURI(decode(preview.url))})` : 'none';
            }, 

            observed(status) {
                this.visible = status;
            },
        },
    };
</script>