<template>
    <div>
        <view-box class="staff noFooter">
            <Header title="陪谈人员"></Header>
            <li class='noPer' @click='clickNoper'>无人陪谈</li>
            <div class="view-wrapper-test">
                <StaffPersonalItem  ref="lal" :data="staffData"  @select="selectItem"  :title="title"></StaffPersonalItem>
            </div>
        </view-box>
    </div>
</template>

<script>
import Header from '@/pages/common/header'
import StaffPersonalItem from '@/pages/staff/staffPersonaItem'
export default {
    name:'staff',
    components:{
        Header,
        StaffPersonalItem
    },
    data(){
        return{
            title: 'indexListPage.title',
            staffData:[],
        }
    },
    mounted(){
        this.func.ajaxPost(this.api.employee.queryEmployeeVisit,{},res=>{
            if(res.data.code='200'){
                let viewHeight=document.body.clientHeight-94;  
                $('.view-wrapper-test').height(viewHeight);
                let data=res.data.data.records;
                //处理数据处理  
                let staffList=[];
                for(var i=0;i<data.length;i++){
                    const element = data[i];
                    let isExist = false
                    for(let j=0;j<staffList.length;j++){
                        let c=staffList[j];
                        if (c['firstLetter'] == element.firstLetter) {
                            c['data'].push(element);
                            isExist = true
                            break
                        }
                    }
                    if (!isExist) {//不存在
                    staffList.push({
                        firstLetter: element.firstLetter,
                        data: [element]
                    });
                    }
                }
                let ret = [];
                staffList.forEach((cityGroup) => {
                    let group = {}
                    group.name = cityGroup.firstLetter
                    group.items = []
                    cityGroup.data.forEach((item) => {
                    group.items.push(item)
                    })
                    ret.push(group)
                })
                this.staffData=ret;
            }
        })
    },
    methods:{
        selectItem({groupIndex,itemIndex,item}){
            let name=item.name;
            let id=item.empId;
            this.$store.commit("changeOrderRss",{"accompanyPersonName":name,"empJobnumber":id});
            this.$router.go(-1);
        },
        clickNoper(){
           this.$store.commit("changeOrderRss",{"accompanyPersonName":'',"empJobnumber":''});
           this.$router.go(-1);
        }
    }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.view-wrapper-test {
  width:100%;
  .index-list-wrapper {
    height: 100%;
    width: 100%;
    margin: 0 auto;
  }
}
.noPer{
    background:white;
    padding-left:16px;
    padding-right:16px;
    font-size:16px;
    height:50px;
    line-height:50px;
}

</style>