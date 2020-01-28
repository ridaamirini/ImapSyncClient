<template>
    <div id="wrapper">
        <h1 class="noselect logo">
            <span style="color:#30bfbf;">imap</span><span style="color: #A6E22E;">sync</span>
            <span style="color:#F9266C"> <i class="fa fa-heart-o fa-beat" aria-hidden="true"></i></span>
            <span class="pull-right" style="font-size: 20px;">
                <el-button-group>
                    <import-csv-button></import-csv-button>
                    <el-button type="primary" icon="el-icon-info" @click="aboutShow = true"></el-button>
                    <el-badge v-if="updateAvailable" class="noselect update-badge" :value="updateAvailable ? 1 : 0" :max="1"></el-badge>
                </el-button-group>
            </span>
        </h1>
        <div class="container">
            <el-row :gutter="24">
                <!--<el-col :span="8" :offset="20" class="noselect">
                  <el-switch
                           style="display: block"
                           v-model="multipleMailboxes"
                           active-color="#13ce66"
                           inactive-color="#ff4949"
                           active-text="Mailboxes">
                   </el-switch>
               </el-col>-->
            </el-row>
            <el-row>
                <el-col :span="24">
                    <queue-table></queue-table>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <mailbox-form></mailbox-form>
                </el-col>
            </el-row>
        </div>

        <about v-on:about-hide="aboutShow = false"
               v-on:update-client="handleUpdate"
               :visible.sync="aboutShow"
               :updateAvailable="updateAvailable"
        ></about>
    </div>
</template>

<script>
    import QueueTable from './QueueTable/QueueTable.vue';
    import MailboxForm from './Add/MailboxForm.vue';
    import About from './About.vue';
    import ImportCsvButton from './ImportCsvButton.vue';
    import { Loading } from 'element-ui';

    export default {
        name: 'main-component',
        components: { QueueTable, MailboxForm, About, ImportCsvButton },
        created () {
          this.$electron.ipcRenderer.on('update-available',
            (event, { version, currentVersion, releaseNotes }) => {
              this.$notify.info({
                title: 'Update',
                iconClass: 'el-icon-bell',
                showClose: true,
                message: 'Hurray! a new update is available. Click me!',
                duration: 6000,
                onClick: this.handleUpdate
              });

              this.updateAvailable = true;

              this.$store.commit('setLatestVersion', version);
            }
          );

          this.$electron.ipcRenderer.send('check-update');
        },
        data () {
            return {
                aboutShow: false,
                multipleMailboxes: false,
                updateAvailable: false
            };
        },
        methods: {
          handleUpdate: function () {
            this.$confirm('The Application will be restarted. Continue?', 'Update', {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'info'
            }).then(() => {
              this.$message({
                type: 'success',
                message: 'Update will be downloaded and install. It might take a while.',
                duration: 3000
              });

              this.$electron.ipcRenderer.send('download-update');

              Loading.service({
                fullscreen: false,
                background: '#272d33',
                text: 'Downloading ...',
                lock: true
              });
            });
          }
        },
        beforeDestroy () {
          this.$electron.ipcRenderer.removeListener('update-available');
          this.$off('update-client');
        }
    };
</script>

<style>
    @import url('http://fonts.googleapis.com/css?family=Roboto:400,100,400italic,500,700,300');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: "Roboto","Helvetica Neue",Helvetica,Arial,sans-serif;
        color: #fafafa;
        line-height: 1.8em;
        font-size: 14px;
        /* overflow: hidden; */
    }

    .titlebar {
        -webkit-user-select: none;
        -webkit-app-region: drag;
    }

    #wrapper {
        background: #272d33;
        height: 100vh;
        padding: 40px 60px;
        width: 100vw;
    }

    .container {
        margin-top: 15px;
    }

    .el-switch__label {
        color: #6b6b6b;
    }

    .el-row {
        margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
    }

    .noselect {
        -webkit-user-select: none;
        user-select: none;
    }

    .logo {
        /*cursor: pointer;*/
    }

    .fa-beat {
        color: red !important;
        animation:fa-beat 5s ease infinite;
    }

    .update-badge {
        z-index: 1000;
    }

    .update-badge sup {
        position: absolute;
        top: -20px;
        right: -10px;
    }

    @keyframes fa-beat {
        0% {
            transform:scale(1);
        }
        5% {
            transform:scale(1.25);
        }
        20% {
            transform:scale(1);
        }
        30% {
            transform:scale(1);
        }
        35% {
            transform:scale(1.25);
        }
        50% {
            transform:scale(1);
        }
        55% {
            transform:scale(1.25);
        }
        70% {
            transform:scale(1);
        }
    }
</style>