<template>
    <div id="wrapper">
        <h1 class="noselect logo">
            <span style="color:#30bfbf;">imap</span><span style="color: #A6E22E;">sync</span>
            <span style="color:#F9266C"> <i class="fa fa-heart-o fa-beat" aria-hidden="true"></i></span>
            <span class="pull-right" style="font-size: 20px;">
                <el-button-group>
                  <el-button type="primary" icon="el-icon-info" @click="aboutShow = true"></el-button>
                  <el-button type="primary" icon="el-icon-share" disabled></el-button>
                  <el-button type="primary" icon="el-icon-upload2" title="Coming soon" disabled></el-button>
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

        <about v-on:about-hide="aboutShow = false" :visible.sync="aboutShow"></about>
    </div>
</template>

<script>
    import QueueTable from './QueueTable/QueueTable.vue';
    import MailboxForm from './Add/MailboxForm.vue';
    import About from './About.vue';

    export default {
        name: 'main-component',
        components: { QueueTable, MailboxForm, About },
        data () {
            return {
                aboutShow: false,
                multipleMailboxes: false
            };
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