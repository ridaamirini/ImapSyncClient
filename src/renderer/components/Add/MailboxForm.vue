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
                        <el-input v-model="form.password_to" type="password" placeholder="Password"></el-input>
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
                <el-badge v-if="mailboxes.length > 0" class="noselect" :value="mailboxes.length" :max="9999">
                    <el-button type="success" icon="el-icon-plus" :disabled="isOnProcess" @click="addMailbox">Add</el-button>
                </el-badge>

                <el-button v-else type="success" icon="el-icon-plus" :disabled="isOnProcess" @click="addMailbox">Add</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" v-show="!isOnProcess" icon="el-icon-refresh" @click="startMigration" :disabled="!(mailboxes.length > 0)">Migrate</el-button>
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
    import log from 'electron-log';
    import ShellAlikeBox from '../ShellAlikeBox.vue';
    import EventBus from '../../store/modules/EventBus.js';
    import auth from '../../../../auth.json';

    export default {
        name: 'mailbox-form',
        props: ['password'],
        components: { ShellAlikeBox },
        computed: {
            mailboxes: {
                get () {
                    return this.$store.state.Mailboxes.list;
                }
            },
            api () {
                return auth.api;
            }
        },
        updated () {
            EventBus.$emit('isOnProcess', this.isOnProcess);
        },
        data () {
            return {
                isOnProcess: false,
                labelPosition: 'left',
                total: 0,
                queue: [],
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
            async validateForm () {
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
            async addMailbox () {
                if (!await this.validateForm()) return false;

                this.$store.commit('addMailbox', Object.assign({}, this.form));

                this.$refs['formSource'].resetFields();
                this.$refs['formDestination'].resetFields();
            },
             migrateMailboxes () {
                // On Abort stop recursion
                if (!this.isOnProcess) return;

                let index = 0;

                if (this.mailboxes.length === 0 || this.mailboxes[index] === undefined || typeof this.mailboxes[index] !== 'object') return;

                let mailbox = this.mailboxes[index];

                this.$store.commit('addLine', 'Request to migrate (' + mailbox.mailbox_from + ' => ' + mailbox.mailbox_to + ')');

                this.$http.post('http://' + this.api + '/imapsync', {
                    host1: mailbox.imap_from,
                    user1: mailbox.mailbox_from,
                    password1: mailbox.password_from,
                    host2: mailbox.imap_to,
                    user2: mailbox.mailbox_to,
                    password2: mailbox.password_to
                }).then((response) => {
                    let uuid = response.data.uuid;
                    this.$store.commit('addLine', 'Started to migrate (' + mailbox.mailbox_from + ' => ' + mailbox.mailbox_to + ') <=> ' + uuid + ' [Emitted]');

                    let queueChecker = setInterval(() => {
                        this.$http.get('http://' + this.api + '/imapsync/queue/' + uuid)
                            .then((response) => {
                                if (response.data.status === 'queue' && this.queue.map(el => el.uuid).indexOf(uuid) === -1) {
                                  this.queue.push(response.data);
                                  // This code makes no sense to me.
                                  // @fixme https://github.com/ridaamirini/ImapSyncClient/issues/5
                                   /* if (!this.abortMessage()) {
                                      // Abort with queue
                                      clearInterval(queueChecker);
                                      return this.abortMigration();
                                    } */
                                }
                                // Stop on ABORT
                                // Abort without Queue (because of request response directly back without queue)
                                // That means something happens or went wrong
                                if (!this.isOnProcess) {
                                    clearInterval(queueChecker);
                                    this.abortMessage();
                                    return;
                                }
                                if (response.data.status === 'successful') {
                                    clearInterval(queueChecker);

                                    this.$store.commit('addLine', '==== LOG (' + mailbox.mailbox_from + ' => ' + mailbox.mailbox_to + ') ====');
                                    this.$store.commit('addLine', response.data.log);
                                    this.$store.commit('addLine', '==== LOG End ====');
                                    this.$store.commit('addLine', mailbox.mailbox_from + ' => ' + mailbox.mailbox_to + ' <=> ' + uuid + ' [Finished]');
                                    this.$store.commit('removeMailbox', index);
                                    this.queue.splice(this.queue.map(el => el.uuid).indexOf(uuid), 1);

                                    this.finished++;

                                    this.completeMigration();
                                    // Tick next Mailbox
                                    this.migrateMailboxes();
                                }
                                else if (response.data.status === 'error') {
                                    clearInterval(queueChecker);

                                    // Stop on ABORT
                                    if (!this.isOnProcess) return;

                                    this.$store.commit('addLine', 'Failed to migrate (' + mailbox.mailbox_from + ' => ' + mailbox.mailbox_to + ') <=> ' + uuid + ' [Skipped]');
                                    // Remove skipped from Mailbox list
                                    this.$store.commit('removeMailbox', index);
                                    this.queue.splice(this.queue.map(el => el.uuid).indexOf(uuid), 1);

                                    this.skipped++;
                                    this.completeMigration(true);
                                    // Tick next Mailbox
                                    this.migrateMailboxes();
                                }
                            }).catch((error) => {
                            clearInterval(queueChecker);

                            // Stop on ABORT
                            if (!this.isOnProcess) return;

                            this.$store.commit('addLine', 'Failed to migrate (' + mailbox.mailbox_from + ' => ' + mailbox.mailbox_to + ') <=> ' + uuid + ' [Skipped]');
                            // Remove skipped from Mailbox list
                            this.$store.commit('removeMailbox', index);
                            this.queue.splice(this.queue.map(el => el.uuid).indexOf(uuid), 1);

                            this.skipped++;
                            this.completeMigration(true);
                            // Tick next Mailbox
                            this.migrateMailboxes();

                            console.log(error);
                            log.error(error);
                        });
                    }, 3000);
                }).catch((error) => {
                    this.$store.commit('addLine', 'Failed to migrate (' + mailbox.mailbox_from + ' => ' + mailbox.mailbox_to + ') [Skipped]');
                    // Remove skipped from Mailbox list
                    this.$store.commit('removeMailbox', index);

                    this.skipped++;
                    this.completeMigration(true);
                    // Tick next Mailbox
                    this.migrateMailboxes();
                    console.log(error);
                    log.error(error);
                });
            },
            startMigration () {
                this.isOnProcess = true;
                this.total = this.mailboxes.length;
                this.$store.commit('addLine', 'Migration started ...');
                this.$notify({
                    title: 'Migration',
                    message: 'Migration started',
                    type: 'info'
                });

                this.migrateMailboxes();
            },
            abortMigration () {
                this.isOnProcess = false;
                this.abortDialog = false;

                if (this.queue.length === 0) return;

                this.$http.post('http://' + this.api + '/imapsync/abort', {
                    queue: JSON.stringify(this.queue)
                })
                .then((response) => {
                    if (!response) return;
                    this.abortMessage();
                })
                .catch((error) => {
                    this.$store.commit('addLine', 'Something went wrong ?!');
                    console.log(error);
                    log.error(error);
                });

                // Clear queue
                this.queue = [];
            },
            abortMessage () {
              this.$store.commit('addLine', 'Migration aborted ...');
              this.$notify({
                title: 'Migration',
                message: 'Migration aborted',
                type: 'error'
              });
            },
            completeMigration (error = false) {
                this.$store.commit('addLine', 'Total: ' + this.total + ' | Finished: ' + this.finished + ' | Skipped: ' + this.skipped);

                if (this.mailboxes.length === 0) {
                    this.$notify({
                        title: 'Migration',
                        message: error ? 'Migration stopped' : 'Migration finished',
                        type: error ? 'error' : 'success'
                    });

                    if (error) {
                        this.$store.commit('addLine', 'Stopped! Click on console to view the LOG.');
                    }
                    else {
                        this.$store.commit('addLine', 'Finished! Click on console to view the LOG.');
                    }

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
                this.queue = [];
            }
        }
    };
</script>
<style>
    ._shell-box {
        margin-top: -5px;
    }
</style>