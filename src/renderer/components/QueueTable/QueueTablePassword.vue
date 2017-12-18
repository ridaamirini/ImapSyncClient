<template>
    <div>
        <span v-if="visibility">
            {{ password }}
        </span>
        <div v-else>
            <span>
                &middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;
            </span>
            <el-button
                    class="eye"
                    type="text"
                    icon="el-icon-view"
                    @click="toggle"
            ></el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'queue-table-password',
        props: ['password'],
        data () {
            return {
                visibility: false
            };
        },
        methods: {
            toggle: function () {
                this.visibility = !this.visibility;

                setTimeout(function () {
                    if (!this.visibility) return;
                    this.visibility = false;
                }.bind(this), 5000);
            }
        }
    };
</script>
<style>
    .eye {
        margin-left: 20px;
    }
</style>