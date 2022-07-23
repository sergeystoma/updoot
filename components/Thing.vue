<template>
    <div class="thing">
        <transition name="menu-fade">
            <Toast
                v-if="toastVisible"
                :message="toastMessage"
            />
        </transition>

        <div class="thing__header">
            <div class="thing__location">
                <button
                    v-if="item.saved"
                    class="thing__action thing__action--save"
                    aria-label="Saved, tap to unsave"
                    @click.prevent="unsave"
                >
                    <i class="fas fa-bookmark" />
                </button>

                <button
                    v-if="!item.saved"
                    class="thing__action thing__action--save"
                    aria-label="Unsaved, tap to undo"
                    @click.prevent="resave"
                >
                    <i class="far fa-bookmark" />
                </button>

                <button
                    v-if="item.pinned"
                    class="thing__action thing__action--pin"
                    aria-label="Pinned, tap to unpin"
                    @click.prevent="unpin"
                >
                    <i class="fas fa-heart" />
                </button>

                <button
                    v-if="!item.pinned"
                    class="thing__action thing__action--pin"
                    aria-label="Tap to pin"
                    @click.prevent="pin"
                >
                    <i class="far fa-heart" />
                </button>

                <button
                    v-if="canShare"
                    class="thing__action thing__action--share"
                    aria-label="Tap to share"
                    @click.prevent="share"
                >
                    <i class="fas fa-share-square" />
                </button>

                <a
                    :href="'https://reddit.com/' + item.subreddit"
                    target="_blank"
                    class="thing__subreddit"
                >{{ item.subreddit }}</a>
            </div>

            <div class="thing__info">
                <a
                    :href="'https://reddit.com/u/' + item.author"
                    target="_blank"
                    class="thing__author"
                >{{ item.author }}</a>

                <span class="thing__separator">&middot;</span>

                <span
                    v-if="relativeCreated"
                    class="thing__time"
                >{{ relativeCreated }}</span>

                <template v-if="item.domain">
                    <span class="thing__separator">&middot;</span>

                    <a
                        :href="item.url"
                        target="_blank"
                        class="thing__url"
                    >{{ item.domain }}</a>
                </template>
            </div>
        </div>

        <div
            v-if="item.title"
            class="thing__title"
        >
            <a
                :href="'https://reddit.com' + item.permalink"
                target="_blank"
            >
                <span
                    v-if="item.nsfw"
                    class="thing__nsfw"
                ><i class="fas fa-exclamation-triangle" /> nsfw</span>
                {{ item.title }}
            </a>
        </div>

        <div
            v-if="item.html"
            class="thing__body"
        >
            <a
                :href="'https://reddit.com' + item.permalink"
                target="_blank"
                v-html="item.html"
            />
        </div>

        <div
            v-if="preview"
            class="thing__preview"
        >
            <div
                class="preview"
                :style="previewStyle"
            >
                <ThingImage
                    :item="item"
                    :preview="preview"
                    @observe="observe"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import "~assets/styles/mixins.scss";

    .thing {
        position: relative;

        border-top: 5px solid var(--color-thing-separator);
        padding-top: 10px;
        margin-top: 10px;

        @include respond-above(sm) {
            border-top: 2px solid var(--color-thing-separator);
        }
    }

    .thing__location {
        position: relative;

        padding: 5px 85px 2px 5px;

        font-size: 14px;

        color: var(--color-text-faded);

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        a {
            color: var(--color-text-faded);
        }
    }

    .thing__action {
        position: absolute;

        top: 0;

        width: 30px;
        height: 30px;

        padding: 0;
        margin: 0;

        border: none;
        background: none;

        cursor: pointer;

        &.thing__action--save {
            right: 0;
        }

        &.thing__action--pin {
            right: 30px;
        }

        &.thing__action--share {
            right: 60px;
        }
    }

    .thing__info {
        padding: 0px 5px 5px;

        font-size: 14px;

        color: var(--color-text-faded);

        white-space: nowrap;
        text-overflow: ellipsis;

        overflow: hidden;

        a {
            color: var(--color-text-faded);
        }
    }

    .thing__separator {
        margin: 0 3px;

        color: var(--color-text-faded);
    }

    .thing__title {
        padding: 5px 5px;

        font-size: 18px;

        a {
            color: var(--color-text-main);
        }
    }

    .thing__body {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;

        margin: 5px 5px 15px;

        max-height: 21px * 4;

        font-size: 15px;
        line-height: 21px;

        overflow: hidden;
        text-overflow: ellipsis;

        a {
            color: var(--color-text-copy);
        }
    }

    .thing__nsfw {
        margin-right: 5px;

        color: var(--color-text-warning);

        font-size: 16px;
        vertical-align: 1px;

        i {
            font-size: 10px;
            margin-right: -2px;
        }
    }

    .thing__preview {
        padding: 5px;
    }

    .preview {
        position: relative;

        width: 100%;
        height: 0;
    }

    .preview__image {
        position: absolute;

        left: 0;
        top: 0;

        width: 100%;
        height: 100%;

        border-radius: 3px;

        overflow: hidden;

        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
    }

    .grid.grid--one {
        .preview__image {
            background-size: contain;
        }
    }
</style>

<script>
    import ThingImage from './Image.vue';
    import Toast from '../components/Toast.vue';

    export default {
        components: {
            ThingImage,
            Toast,
        },
        props: {
            item: {
                type: Object,
                default: null,
            },
            width: {
                type: Number,
                default: null,
            },
            heightLimit: {
                type: Number,
                default: null,
            },
        },
        data() {
            return {
                toastVisible: false,
                toastMessage: null,
            };
        },
        computed: {
            canShare() {
                return !!navigator.share;
            },

            showNsfw() {
                return this.$store.state.showNsfw;
            },

            relativeCreated() {
                return this.item.relativeTime;
            },

            preview() {
                if (this.item.nsfw) {
                    if (this.showNsfw) {
                        return this.previewValid(this.item.preview) ? this.item.preview : null;
                    }

                    return this.previewValid(this.item.previewBlurred) ? this.item.previewBlurred : null;
                }

                return this.previewValid(this.item.preview) ? this.item.preview : null;
            },

            previewStyle() {
                let ratio = (this.preview.height * 100) / this.preview.width;

                if (this.layout === 'one' && this.width != null) {
                    const height = this.width * ratio / 100;

                    if (height > this.heightLimit) {
                        ratio = this.heightLimit / this.width * 100;
                    }
                }

                return {
                    paddingTop: `${ratio.toFixed(2)}%`,
                };
            },

            layout() {
                return this.$store.state.layout;
            },

            toast() {
                const t = this.$store.state.toast;
                return t && t.item === this.item.name ? t : null;
            },
        },
        watch: {
            toast: {
                deep: true,
                handler() {
                    this.updateToast();
                },
            },
        },
        beforeDestroy() {
            if (this.toastTimer) {
                clearTimeout(this.toastTimer);
            }
        },
        methods: {
            notEmpty(s) {
                return s && s.length > 0;
            },

            previewValid(preview) {
                return preview && preview.url && preview.width > 0 && preview.height > 0;
            },

            observe(options) {
                this.$emit('observe', options);
            },

            unsave() {
                this.$store.dispatch('unsave', this.item);
            },

            resave() {
                this.$store.dispatch('resave', this.item);
            },

            pin() {
                this.$store.dispatch('pin', this.item);
            },

            unpin() {
                this.$store.dispatch('unpin', this.item);
            },

            share() {
                if (navigator.share) {
                    const url = `https://reddit.com${this.item.permalink}`;

                    navigator.share({
                        title: this.item.title,
                        url,
                    });
                }
            },

            /**
             * Updates toast state.
             */
            updateToast() {
                if (this.toastTimer) {
                    clearTimeout(this.toastTimer);
                }

                if (this.toast) {
                    this.toastVisible = true;
                    this.toastMessage = this.toast.message;

                    this.toastTimer = setTimeout(() => {
                        this.toastVisible = false;
                    }, 2000);
                } else {
                    this.toastVisible = false;
                }
            }
        },
    };
</script>
