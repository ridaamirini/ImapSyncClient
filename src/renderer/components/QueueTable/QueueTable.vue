<template>
     <el-table
            :data="mailboxes"
            style="width: 100%"
            empty-text="Not Data"
            height="250">
        <el-table-column
                fixed
                align="center"
                type="index"
                label="#"
                width="80">
        </el-table-column>
        <el-table-column
                prop="mailbox_from"
                label="Mailbox from"
                width="120">
        </el-table-column>
        <el-table-column
                align="center"
                label="Password from"
                width="120">
            <queue-table-password slot-scope="scope" :password="scope.row.password_from"></queue-table-password>
        </el-table-column>
        <el-table-column
                prop="imap_from"
                label="IMAP Server from"
                width="150">
        </el-table-column>
        <el-table-column
                prop="mailbox_to"
                label="Mailbox to"
                width="120">
        </el-table-column>
        <el-table-column
                label="Password to"
                width="120">
            <queue-table-password slot-scope="scope" :password="scope.row.password_to"></queue-table-password>
        </el-table-column>
        <el-table-column
                prop="imap_to"
                label="IMAP Server to"
                width="150">
        </el-table-column>
        <el-table-column
                fixed="right"
                align="center"
                label="-"
                width="50">
            <template slot-scope="scope">
                <el-button
                        @click.native.prevent="deleteRow(scope.$index)"
                        :disabled="locked"
                        type="text"
                        icon="el-icon-delete">
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import QueueTablePassword from './QueueTablePassword.vue';
    import EventBus from '../../store/modules/EventBus.js';

    export default {
        name: 'queue-table',
        components: { QueueTablePassword },
        mounted () {
            EventBus.$on('isOnProcess', this.processHandler);
        },
        methods: {
            deleteRow (index) {
                this.$store.commit('removeMailbox', index);
            },
            processHandler (data) {
                this.locked = data;
            }
        },
        data () {
            return {
                locked: false,
                mailboxes: this.$store.state.Mailboxes.list
            };
        }
    };
</script>

<style>
</style>