<template>
    <view-box ref="viewBox" class="noFooter">
        <Header title="评测试题" /> 
        <div class="scrollerMain questions">
            <div class="progress">
              <span class="start" v-text="step"></span>
              <x-progress :percent="percent" :show-cancel="false"></x-progress>
              <span class="end" v-text="total"></span>
          </div>  
          <div class="questions-list">
            <h1 class="title" v-text="formData.title"></h1>
            <ul v-if="formData.data && formData.data.length > 0">
                <li :class="{active: item.check}" v-for="(item, index) in formData.data" @click="checkerBox(index)"><span v-text="item.title"></span><em></em></li>
            </ul>
            <div class="nav-btn">
                <x-button :disabled="!previousState" @click.native="previous" class="previous">上一题</x-button>
                <x-button :disabled="!nextState" @click.native="next" class="next" v-if="step < total">下一题</x-button>
                <x-button @click.native="save" class="success" v-else>完成</x-button>
            </div>
        </div>      
    </div> 
</view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
export default {
    name: 'questions',
    components: {
        Header,
        Footer
    },
    created(){
       //获取数据
       let paperType=this.$route.query.paperType;
       this.func.ajaxPost(this.api.customer.GetRiskPaper, {paperType:paperType}, res => {
        if (res.data.code === 200) {
           this.RiskPaperData=res.data.data;
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    data () {
        return {
            step: 1,
            percent: 10,
            total: 10,
            previousState: false,
            nextState: true,
            formData: {},
            RiskPaperData:[],
            listData: [
            {
                title: '家庭可支配年收入1',
                select: [],
                data: [
                {check: false, title: '50万元以下'},
                {check: false, title: '50万-100万'},
                {check: false, title: '100万-200万'},
                {check: false, title: '200万元-500万'},
                {check: false, title: '500万-1000万'}
                ]
            },
            {
                title: '家庭可支配年收入2',
                select: [],
                data: [
                {check: false, title: '50万元以下'},
                {check: false, title: '50万-100万'},
                {check: false, title: '100万-200万'},
                {check: false, title: '200万元-500万'},
                {check: false, title: '500万-1000万'}
                ]
            },
            {
                title: '家庭可支配年收入3',
                select: [],
                data: [
                {check: false, title: '50万元以下'},
                {check: false, title: '50万-100万'},
                {check: false, title: '100万-200万'},
                {check: false, title: '200万元-500万'},
                {check: false, title: '500万-1000万'}
                ]
            },
            {
                title: '家庭可支配年收入4',
                select: [],
                data: [
                {check: false, title: '50万元以下'},
                {check: false, title: '50万-100万'},
                {check: false, title: '100万-200万'},
                {check: false, title: '200万元-500万'},
                {check: false, title: '500万-1000万'}
                ]
            },
            {
                title: '家庭可支配年收入5',
                select: [],
                data: [
                {check: false, title: '50万元以下'},
                {check: false, title: '50万-100万'},
                {check: false, title: '100万-200万'},
                {check: false, title: '200万元-500万'},
                {check: false, title: '500万-1000万'}
                ]
            },
            {
                title: '家庭可支配年收入6',
                select: [],
                data: [
                {check: false, title: '50万元以下'},
                {check: false, title: '50万-100万'},
                {check: false, title: '100万-200万'},
                {check: false, title: '200万元-500万'},
                {check: false, title: '500万-1000万'}
                ]
            },
            {
                title: '家庭可支配年收入7',
                select: [],
                data: [
                {check: false, title: '50万元以下'},
                {check: false, title: '50万-100万'},
                {check: false, title: '100万-200万'},
                {check: false, title: '200万元-500万'},
                {check: false, title: '500万-1000万'}
                ]
            },
            {
                title: '家庭可支配年收入8',
                select: [],
                data: [
                {check: false, title: '50万元以下'},
                {check: false, title: '50万-100万'},
                {check: false, title: '100万-200万'},
                {check: false, title: '200万元-500万'},
                {check: false, title: '500万-1000万'}
                ]
            },
            {
                title: '家庭可支配年收入9',
                select: [],
                data: [
                {check: false, title: '50万元以下'},
                {check: false, title: '50万-100万'},
                {check: false, title: '100万-200万'},
                {check: false, title: '200万元-500万'},
                {check: false, title: '500万-1000万'}
                ]
            },
            {
                title: '家庭可支配年收入10',
                select: [],
                data: [
                {check: false, title: '50万元以下'},
                {check: false, title: '50万-100万'},
                {check: false, title: '100万-200万'},
                {check: false, title: '200万元-500万'},
                {check: false, title: '500万-1000万'}
                ]
            }
            ]
        }
    },
    mounted(){
        //初始化试题
        this.init()
    },
    methods: {
        //初始化试题
        init(){
            this.select(1)
            this.total = this.listData.length
        },
        //题目跳转
        select(step, type){
            if(!type && step != 1 && this.formData.select && this.formData.select.length == 0){
               this.utils.alert('请选择后继续！')
               return 
            }
            this.step = step
            this.percent = step / this.total * 100
            this.formData = this.listData[step-1]
        },
        //上一题
        previous(){
            this.nextState = true
            if(this.step > 1){
                this.select(this.step - 1, true)
            }else{
                this.previousState = false
                this.utils.msg('已经是第一题了')
            }
        },
        //下一题
        next(){
            this.previousState = true
            if(this.step < this.total){
                this.select(this.step + 1)
            }else{
                this.nextState = false
                this.utils.msg('已经是最后一题了')
            }
        },
        //选题
        checkerBox(index){
            let check = this.formData.data[index].check
            this.formData.data[index].check = !check
            if(!check){
                this.formData.select.push(1)
            }else{
                this.formData.select.splice(index, 1)
            }
        },
        //保存
        save(){
            this.select(this.total) 
            if(this.formData.select && this.formData.select.length == 0){
               this.utils.alert('请选择后继续！')
               return 
            }
           this.utils.goToUrl('/customer/evaluation')
        }
    }
}
</script>
