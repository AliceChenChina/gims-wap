<template>
    <div class="test">
        <upload title="上传其他附件" module="trade" fileCatalog="other" :finalFuc='finalFuc1' ref="otherFile1"  :maxLength='3'></upload>
    </div>
</template>

<script>
    import upload from '@/pages/product/upload.vue'
    export default {
        components:{
            upload
        },
        data(){
            return{
                value:[]
            }
        },
        methods:{
            finalFuc1:function(){
            }
        }
    }
</script>

<style scoped>
.test{
    width: 100%;
    height: 100%;
    background: white;
    padding:20px;
}
</style>
