<template>
    <div>
        <el-row>
            <el-col :span="11">
                <el-form :label-position="labelPosition" :rules="rules" ref="formSource" label-width="135px" :model="form">
                    <el-form-item label="E-Mail from" prop="mailbox_from">
                        <el-input v-model="form.mailbox_from" placeholder="from@example.com"></el-input>
                    </el-form-item>
                    <el-form-item label="Password from" prop="password_from">
                        <el-input v-model="form.password_from" type="password" placeholder="Password"></el-input>
                    </el-form-item>
                    <el-form-item label="IMAP Server from" prop="imap_from">
                        <el-input v-model="form.imap_from" placeholder="Server IP or Domain"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="11" :offset="2">
                <el-form :label-position="labelPosition" :rules="rules" ref="formDestination" label-width="130px" :model="form">
                    <el-form-item label="E-Mail to" prop="mailbox_to">
                        <el-input v-model="form.mailbox_to" placeholder="to@example.com"></el-input>
                    </el-form-item>
                    <el-form-item label="Password to" prop="password_to">
                        <el-input v-model="form.password_to" placeholder="Password"></el-input>
                    </el-form-item>
                    <el-form-item label="IMAP Server to" prop="imap_to">
                        <el-input v-model="form.imap_to" placeholder="Server IP or Domain"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="12" class="_shell-box">
                <shell-alike-box></shell-alike-box>
            </el-col>
            <el-col :span="4" :offset="16">
                <el-badge :value="mailboxes.length" :max="9999">
                    <el-button type="success" icon="el-icon-plus" :disabled="isOnProcess" @click="addMailbox">Add</el-button>
                </el-badge>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" v-show="!isOnProcess" icon="el-icon-refresh" @click="migrateMailboxes" :disabled="!(mailboxes.length > 0)">Migrate</el-button>
                <el-button type="danger" v-show="isOnProcess" icon="el-icon-close" @click="abortDialog = true">Abort</el-button>
            </el-col>
        </el-row>
        <el-dialog
                title="Warning"
                :visible.sync="abortDialog"
                width="30%"
                center>
            <span>Do you really want to end the process?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="abortDialog = false">Cancel</el-button>
                <el-button type="danger" @click="abortMigration">Yes, abort!</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ShellAlikeBox from '../ShellAlikeBox.vue';
    import EventBus from '../../store/modules/EventBus.js';

    export default {
        name: 'mailbox-form',
        props: ['password'],
        components: { ShellAlikeBox },
        computed: {
            mailboxes: {
                get () {
                    return this.$store.state.Mailboxes.list;
                }
            }
        },
        updated () {
            EventBus.$emit('isOnProcess', this.isOnProcess);
            this.completeMigration();
        },
        data () {
            return {
                isOnProcess: false,
                labelPosition: 'left',
                total: 0,
                queue: 0,
                finished: 0,
                skipped: 0,
                abortDialog: false,
                form: {
                    mailbox_from: '',
                    password_from: '',
                    imap_from: '',
                    mailbox_to: '',
                    password_to: '',
                    imap_to: ''
                },
                rules: {
                    mailbox_from: [
                        { required: true, message: 'Please enter a source Mailbox', trigger: 'blur' }
                    ],
                    password_from: [
                        { required: true, message: 'Please password', trigger: 'blur' }
                    ],
                    imap_from: [
                        { required: true, message: 'Please enter IMAP source server name or IP address', trigger: 'change' }
                    ],
                    mailbox_to: [
                        { required: true, message: 'Please enter a destination Mailbox', trigger: 'blur' }
                    ],
                    password_to: [
                        { required: true, message: 'Please password', trigger: 'blur' }
                    ],
                    imap_to: [
                        { required: true, message: 'Please enter IMAP destination server name or IP address', trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            validateForm: async function () {
                let result = true;

                this.$refs['formSource'].validate((valid) => {
                    if (!valid) {
                        result = false;
                        return false;
                    }
                });

                this.$refs['formDestination'].validate((valid) => {
                    if (!valid) {
                        result = false;
                        return false;
                    }
                });

                return result;
            },
            addMailbox: async function () {
                if (!await this.validateForm()) return false;

                this.$store.commit('addMailbox', Object.assign({}, this.form));

                this.$refs['formSource'].resetFields();
                this.$refs['formDestination'].resetFields();
            },
            migrateMailboxes () {
                this.isOnProcess = true;
                this.total = this.mailboxes.length;
                this.$store.commit('addLine', 'Migration started ...');

                this.$notify({
                    title: 'Migration',
                    message: 'Migration started',
                    type: 'info'
                });

                for (let index in this.mailboxes) {
                    this.$store.commit('addLine', 'Request to migrate (' + this.mailboxes[index].mailbox_from + ' => ' + this.mailboxes[index].mailbox_to + ')');

                    let mailbox = this.mailboxes[index];

                    this.$http.post('http://localhost:8080/imapsync', {
                            host1: mailbox.imap_from,
                            user1: mailbox.mailbox_from,
                            password1: mailbox.password_from,
                            host2: mailbox.imap_to,
                            user2: mailbox.mailbox_to,
                            password2: mailbox.password_to
                    }).then((response) => {
                        let uuid = response.data.uuid;
                        this.$store.commit('addLine', 'Started to migrate (' + this.mailboxes[index].mailbox_from + ' => ' + this.mailboxes[index].mailbox_to + ') <=> ' + uuid + ' [Emitted]');

                        let queueChecker = setInterval(() => {
                            this.$http.get('http://localhost:8080/imapsync/queue/' + uuid)
                                .then((response) => {
                                    if (response.data.status === 'successful') {
                                        clearInterval(queueChecker);
                                        this.$store.commit('addLine', '==== LOG (' + this.mailboxes[index].mailbox_from + ' => ' + this.mailboxes[index].mailbox_to + ') ====');
                                        this.$store.commit('addLine', response.data.log);
                                        this.$store.commit('addLine', '==== Ended ====');
                                        this.$store.commit('addLine', this.mailboxes[index].mailbox_from + ' => ' + this.mailboxes[index].mailbox_to + ' <=> ' + uuid + ' [Finished]');
                                        this.$store.commit('removeMailbox', index);
                                        this.finished++;
                                    }
                                    else if (response.data.status === 'error') {
                                        clearInterval(queueChecker);
                                        this.$store.commit('addLine', 'Failed to migrate (' + this.mailboxes[index].mailbox_from + ' => ' + this.mailboxes[index].mailbox_to + ') <=> ' + uuid + ' [Skipped]');
                                        this.skipped++;
                                    }
                                }).catch((error) => {
                                    clearInterval(queueChecker);
                                    this.$store.commit('addLine', 'Failed to migrate (' + this.mailboxes[index].mailbox_from + ' => ' + this.mailboxes[index].mailbox_to + ') <=> ' + uuid + ' [Skipped]');
                                    this.skipped++;
                                    console.log(error);
                                });
                        }, 3000);
                    }).catch((error) => {
                        this.$store.commit('addLine', 'Failed to migrate (' + this.mailboxes[index].mailbox_from + ' => ' + this.mailboxes[index].mailbox_to + ') [Skipped]');
                        this.skipped++;
                        console.log(error);
                    });
                }
            },
            abortMigration () {
                this.isOnProcess = false;
                this.abortDialog = false;
                this.$store.commit('addLine', 'Migration aborted ...');
                this.$notify({
                    title: 'Migration',
                    message: 'Migration aborted',
                    type: 'error'
                });
            },
            completeMigration () {
                if (this.queue === 0 && this.finished === 0 && this.skipped === 0) return false;

                this.$store.commit('addLine', 'Total: ' + this.total + ' | Queue: ' + this.queue + ' | Finished: ' + this.finished + ' | Skipped: ' + this.skipped);

                if (this.mailboxes.length === 0) {
                    this.isOnProcess = false;
                    this.abortDialog = false;
                    this.resetCounter();
                }
            },
            resetCounter () {
                // Reset counter
                this.total = 0;
                this.finished = 0;
                this.skipped = 0;
                this.queue = 0;
            }
        }
    };
</script>
<style>
    ._shell-box {
        margin-top: -5px;
    }
</style>