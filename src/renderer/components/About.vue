<template>
    <div>
        <el-dialog
                title="About"
                :visible.sync="visible"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                width="30%"
                center>
            <span>It should be noted that the content will not be aligned in center by default</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="visible = false" round>Please close this door!</el-button>
           </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'about',
        props: ['visible']
        // @todo Finish About Component
        //  Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: "visible"
    };
</script>