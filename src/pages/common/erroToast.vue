<template>
    <div>
    </div>
</template>

<script>
    export default {
        name: 'erroToast',
        methods:{
            alertToast(){
            }
        }
    }
</script>

<style>
.m-toast-pop {display: none; position: fixed; width: 100%;top: 0;bottom: 0;right: 0;overflow: auto;text-align: center;}      
.m-toast-inner {position: absolute;left:50%;top:50%;width: 100%; transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);text-align: center;}
.m-toast-inner-text{display: inline-block;margin: 0 22px; padding: 19px 21px;font-size: 16px;color: #FFFFFF;letter-spacing: 0;line-height: 22px;background: rgba(0,0,0,0.72);border-radius: 10px;}   
</style>