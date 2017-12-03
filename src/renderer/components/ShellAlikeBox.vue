<template>
        <div class="shell-wrap">
            <ul class="shell-body" id="shell_container" v-smooth-scroll>
                <li v-for="item in items" v-html="item"></li>
            </ul>
        </div>
</template>

<script>
    import Vue from 'vue';
    export default {
        name: 'shell-alike-box',
        computed: {
            items: {
                get () {
                    return this.$store.state.ShellHistory.output;
                }
            }
        },
        mounted () {
            this.scrollToEnd();
        },
        updated () {
            this.scrollToEnd();
        },
        methods: {
            scrollToEnd: function () {
                // let container = this.$el.querySelector('#shell_container');
                // container.scrollTop = container.scrollHeight;
            }
        }
    };

    Vue.directive('smooth-scroll', {
        bind: function (el) {
            let observer = new MutationObserver(scrollToBottom);
            let config = {childList: true};
            observer.observe(el, config);

            function animateScroll (duration) {
                let start = el.scrollTop;
                let end = el.scrollHeight;
                let change = end - start;
                let increment = 20;

                function easeInOut (currentTime, start, change, duration) {
                    // by Robert Penner
                    currentTime /= duration / 2;
                    if (currentTime < 1) {
                        return change / 2 * currentTime * currentTime + start;
                    }
                    currentTime -= 1;
                    return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
                }

                function animate (elapsedTime) {
                    elapsedTime += increment;
                    let position = easeInOut(elapsedTime, start, change, duration);
                    el.scrollTop = position;
                    if (elapsedTime < duration) {
                        setTimeout(function () {
                            animate(elapsedTime);
                        }, increment);
                    }
                }
                animate(0);
            }

            function scrollToBottom () {
                let duration = 1000;
                animateScroll(duration);
            }
        }
    });
</script>
<style>
    .shell-wrap {
        width: 500px;
        height: 70px;
        margin: 0 auto -50px auto;
        box-shadow: 0 0 30px rgba(0,0,0,0.4);

        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    .shell-body {
        height: 70px;
        margin: 0;
        padding: 5px;
        list-style: none;
        background: #141414;
        color: #45D40C;
        font: 0.8em 'Andale Mono', Consolas, 'Courier New';
        line-height: 1.6em;
        overflow-y: scroll;

        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    .shell-body li:before {
        content: '>';
        position: absolute;
        left: 0;
        top: 0;
    }

    .shell-body li {
        word-wrap: break-word;
        position: relative;
        padding: 0 0 0 15px;
    }

    ::-webkit-scrollbar-track
    {
        // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: transparent;
    }

    ::-webkit-scrollbar
    {
        width: 5px;
        background-color: transparent;
    }

    ::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #555;
    }
</style>