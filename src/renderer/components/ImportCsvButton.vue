<template>
    <el-button type="primary"
               icon="el-icon-upload2"
               title="Import CSV"
               @click="openDialog"
    ></el-button>
</template>

<script>
      import fs from 'fs';
      import { mapMutations } from 'vuex';
      const { dialog } = require('electron').remote;

      export default {
        name: 'import-csv-button',
        data () {
          return {
            dialogOptions: {
              filters: [
                { name: 'CSV', extensions: ['csv', 'txt'] }
              ]
            }
          };
        },
        methods: {
          ...mapMutations(['addMailbox']),
          openDialog () {
            dialog.showOpenDialog(null, this.dialogOptions, this.readFromCsv);
          },
          readFromCsv (paths) {
            if (!paths) return;

            const path = paths[0];
            const csv = fs.readFileSync(path, 'utf-8');

            if (!csv || typeof csv !== 'string') {
              this.$notify({
                title: 'Import CSV',
                message: 'Failed to import mailboxes',
                type: 'error'
              });

              return;
            }

            const csvLines = csv.split('\n');

            for (let i = 0; i < csvLines.length; i++) {
              const line = csvLines[i];

              if (line.match(/^#|^ *$/)) continue;

              const data = line.split(';');

              this.addMailbox({
                imap_from: data[0],
                mailbox_from: data[1],
                password_from: data[2],
                imap_to: data[3],
                mailbox_to: data[4],
                password_to: data[5]
              });
            }

            this.$notify({
              title: 'Import CSV',
              message: 'Mailboxes imported',
              type: 'success'
            });
          }
        }
      };
</script>