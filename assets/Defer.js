export default function (count = 20) {
    return {
        data() {
            return {
                displayPriority: 0,
            };
        },

        mounted() {
            this.runDisplayPriority();
        },

        computed: {
            numShuffles() {
                return this.$store.state.numShuffles;
            },

            layout() {
                return this.$store.state.layout;
            },

            showNsfw() {
                return this.$store.state.showNsfw;
            },

            filterNsfw() {
                return this.$store.state.filterNsfw;
            },
        },

        watch: {
            // Watch the store values that cause the most intense operations 
            // when they change so mounting posts can be deferred. The display 
            // priority val has to be reset each time deferring is needed.
            numShuffles: {
                deep: false,
                handler() {
                    this.resetDisplayPriority();
                },
            },

            layout: {
                deep: false,
                handler() {
                    this.resetDisplayPriority();
                },
            },

            showNsfw: {
                deep: false,
                handler() {
                    this.resetDisplayPriority();
                },
            },

            filterNsfw: {
                deep: false,
                handler() {
                    this.resetDisplayPriority();
                },
            },
        },

        methods: {
            runDisplayPriority() {
                const step = () => {
                    requestAnimationFrame(() => {
                        this.displayPriority++;
                        if (this.displayPriority < count) {
                            step();
                        }
                    });
                }
                step();
            },

            defer(priority) {
                return this.displayPriority >= priority;
            },

            resetDisplayPriority() {
                this.displayPriority = 0;
                this.runDisplayPriority();
            }
        },
    };
}
