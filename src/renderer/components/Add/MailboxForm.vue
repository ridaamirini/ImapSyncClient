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
            <el-col :span="12" class="progressbar-box">
                <h4>Test 1/4 Mailboxes</h4>
                <el-progress class="progressbar" :text-inside="true" :stroke-width="18" :percentage="0"></el-progress>
            </el-col>
            <el-col :span="4" :offset="4">
                <el-badge :value="mailboxes.length" :max="9999">
                    <el-button type="success" icon="el-icon-plus" @click="addMailbox">Add</el-button>
                </el-badge>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" v-show="!isOnProcess" icon="el-icon-refresh" @click="migrateMailboxes" :disabled="!(mailboxes.length > 0)">Migrate</el-button>
                <el-button type="danger" v-show="isOnProcess" icon="el-icon-close">Abort</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'mailbox-form',
        props: ['password'],
        computed: {
            mailboxes: {
                get () {
                    return this.$store.state.Mailboxes.list;
                }
            }
        },
        data () {
            return {
                isOnProcess: false,
                labelPosition: 'left',
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

                this.$notify({
                    title: 'Migration',
                    message: 'The migration of the mailboxes has started',
                    type: 'info'
                });

                for (let mailbox in this.mailboxes) {
                    this.$http.get('http://lamiral.info/cgi-bin/imapsync', {
                        params: {
                            host1: mailbox.imap_from,
                            user1: mailbox.mailbox_from,
                            password1: mailbox.password_from,
                            host2: mailbox.imap_to,
                            user2: mailbox.mailbox_to,
                            password2: mailbox.password_to
                        }
                    }).then(function (response) {
                        console.log(response);
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }
        }
    };
</script>
<style>
    .progressbar-box {
        margin-top: -5px;
    }
</style>