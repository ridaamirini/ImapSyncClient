<template>
    <div>
        <el-dialog
                title="About"
                :visible.sync="isVisible"
                :close-on-press-escape="true"
                :close-on-click-modal="true"
                width="50%"
                center>
            <span>
                <el-row :gutter="12">
                      <el-col :span="8">
                            Author: Rida Amirini
                      </el-col>
                </el-row>
                <el-row :gutter="12">
                      <el-col :span="8">
                            Version: v{{version}}
                      </el-col>
                </el-row>
                 <el-row :gutter="18">
                      <el-col :span="16">
                            Latest version: v{{latest}} &nbsp;
                          <el-button :type="updateAvailable ? 'success' : 'primary'" size="mini" @click="handelUpdate" round>
                              {{ updateAvailable ? 'Update' : 'Check for update'}}
                              <span v-if="checkingForUpdate" class="el-icon-loading"></span>
                            </el-button>
                      </el-col>
                </el-row>
                <el-row :gutter="12">
                      <el-col :span="12">
                            GitHub: <el-button type="primary" size="mini" @click="openGithub" round>ImapSync Client @GitHub</el-button>
                      </el-col>
                </el-row>
                <el-row :gutter="12">
                      <el-col :span="12">
                            API Status: <span class="api-status"><i :class="apiStatus"></i></span>
                      </el-col>
                </el-row>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="hide()" round>Please close the door!</el-button>
           </span>
        </el-dialog>
    </div>
</template>
<script>
    import revsion from '../../../revision';
    import auth from '../../../auth';
    import { checkForUpdates } from '../../main/updater';

    export default {
        name: 'about',
        props: ['visible', 'updateAvailable'],
        created () {
          this.$electron.ipcRenderer.on('update-not-available', () => {
            this.checkingForUpdate = false;
          });

          this.$electron.ipcRenderer.on('update-available', () => {
            this.checkingForUpdate = false;
          });
        },
        computed: {
          version () {
            return revsion.version;
          },
          latest () {
            return this.$store.state.Version.latest;
          },
          isVisible: {
            get () {
              if (this.visible) this.checkApiHealth();
              return this.visible;
            },
            set (value) {
                this.hide();
            }
          }
        },
        data () {
          return {
            apiStatus: 'el-icon-loading',
            health: {
              'OK': 'el-icon-circle-check',
              'NOTOK': 'el-icon-circle-close',
              'LOADING': 'el-icon-loading'
            },
            checkingForUpdate: false
          };
        },
        methods: {
          hide () {
            this.$emit('about-hide');
          },
          checkApiHealth () {
            this.apiStatus = this.health.LOADING;

            setTimeout(() => {
              this.$http.get('http://' + auth.api + '/imapsync/status')
                .then((response) => {
                  let rep = response.data;

                  if (rep.hasOwnProperty('status') && rep.status.success === true) {
                    this.apiStatus = this.health.OK;
                    return;
                  }

                  this.apiStatus = this.health.NOTOK;
                })
                .catch((error) => {
                  // Something went wrong API Health NOT OK
                  this.apiStatus = this.health.NOTOK;
                });
            }, 1000);
          },
          openGithub () {
            this.$electron.shell.openExternal('https://github.com/ridaamirini/ImapSyncClient');
          },
          handleUpdate: function () {
            if (this.updateAvailable) {
              this.$emit('update-client');

              return;
            }

            this.checkingForUpdate = true;

            checkForUpdates();
          }
        },
        beforeDestroy () {
          this.$electron.ipcRenderer.removeListener('update-not-available');
          this.$electron.ipcRenderer.removeListener('update-not-available');
        }
    };
</script>
<style>
    span.el-dialog__title {
        color: #A6E22E;
    }
    span.api-status {
        font-size: 17px;
    }

    .el-icon-circle-close {
        color: red;
    }

    .el-icon-circle-check {
        color: green;
    }
</style>