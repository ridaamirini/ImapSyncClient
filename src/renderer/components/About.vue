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
                <el-row :gutter="18">
                      <el-col :span="16">
                            Version: v{{version}}
                      </el-col>
                </el-row>
                 <el-row :gutter="18">
                      <el-col :span="16">
                            Latest version: v{{latest}} &nbsp;
                          <el-button :type="updateAvailable ? 'success' : 'primary'" size="mini" @click="handleUpdate" round>
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
                            ImapSync binary: v{{ imapsyncVersion }}
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
    import imapsyncVersion from '../../../imapsync_binaries/version';

    export default {
        name: 'about',
        props: ['visible', 'updateAvailable'],
      created: function () {
        this.$electron.ipcRenderer.on('update-not-available', () => {
          this.checkingForUpdate = false;

          this.$message({
            showClose: true,
            message: 'You already have the latest version.'
          });
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
              return this.visible;
            },
            set (value) {
                this.hide();
            }
          }
        },
        data () {
          return {
            imapsyncVersion: imapsyncVersion.version,
            checkingForUpdate: false
          };
        },
        methods: {
          hide () {
            this.$emit('about-hide');
          },
          openGithub () {
            this.$electron.shell.openExternal('https://github.com/ridaamirini/ImapSyncClient');
          },
          handleUpdate: function () {
            if (this.updateAvailable) {
              this.hide();
              this.$emit('update-client');

              return;
            }

            this.checkingForUpdate = true;

            this.$electron.ipcRenderer.send('check-update-manually');
          }
        },
        beforeDestroy () {
          this.$electron.ipcRenderer.removeListener('update-not-available');
          this.$electron.ipcRenderer.removeListener('update-available');
        }
    };
</script>
<style>
    span.el-dialog__title {
        color: #A6E22E;
    }
</style>