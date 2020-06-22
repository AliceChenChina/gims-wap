<template>
  <view-box ref="viewBox" class="message noFooter">
    <Header title="消息中心" />
    <scroller ref="scroller" lock-x height="-44" @on-scroll-bottom="loadMore">
      <div>
        <div v-for="(items,index) in dataList" :key="index">              
          <group class="noBorder"> 
            <cell :title="items.month" class="title"></cell>
            <ul class="message-list">
              <li v-for="item in items.data" :key="item.id">
                <router-link to="" :class="{active: item.state}">
                  <img src="@/assets/images/message_hover.png" class="user" v-if="item.state" />
                  <img src="@/assets/images/message.png" class="user" v-else />
                  <div class="message-content">
                    <p class="time" v-text="item.createdTime"></p>
                    <p class="title" v-text="item.title"></p>
                    <p class="noEllipsisDesc"><span v-text="item.receiverName+','"></span><i v-text="item.content"></i></p>
                  </div>
                </router-link>
              </li>
            </ul>
          </group> 
        </div>
      </div>
      <p class="showMore" v-if="loadMoreState">上拉显示更多</p>
      <div class='loadingWrapper' v-if="loading">
          <img src="@/assets/images/loading.gif"/>
      </div>
      <NoData></NoData>
      <div v-if='noMoreData' class="noMoreData">暂无更多数据</div>
    </scroller>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import NoData from '@/pages/common/noData'
  export default {
    name: 'message',
    components: {
      Header,
      Footer,
      NoData
    },
    data () {
      return {
        messageList: [
          {
            month: '3月份',
            data: [
              {title: '客户分配提醒', time: '2017-03-24 10:00:00', state: true, name: '沈进', message: '，已分配至您的客户名单中，请及时跟踪'},
              {title: '客户分配提醒', time: '2017-03-24 10:00:00', state: true, name: '沈进', message: '，已分配至您的客户名单中，请及时跟踪'},
              {title: '客户分配提醒', time: '2017-03-24 10:00:00', state: false, name: '沈进', message: '，已分配至您的客户名单中，请及时跟踪'}
            ]
          },
          {
            month: '4月份',
            data: [
              {title: '客户分配提醒', time: '2017-03-24 10:00:00', state: false, name: '沈进', message: '，已分配至您的客户名单中，请及时跟踪'},
              {title: '客户分配提醒', time: '2017-03-24 10:00:00', state: false, name: '沈进', message: '，已分配至您的客户名单中，请及时跟踪'},
              {title: '客户分配提醒', time: '2017-03-24 10:00:00', state: false, name: '沈进', message: '，已分配至您的客户名单中，请及时跟踪'}
            ]
          }
        ],
        pageNum:1,
        dataList:[],
        tempData:[], //全局变量
        loadMoreState: false, //判断是否加载下拉更多
        noMoreData:false, //没有更多数据
        loading:false,//loading图案
      }
    },
    created(){
       this.fetchList();
    },
    methods: {
      fetchList(){
        this.loading=true;
        this.func.ajaxPost(this.api.message.query,{pageNumber:this.pageNum,pageSize:7},res=>{
          if(res.data.code==200){
            this.loading=false;
            let records=res.data.data.records;
            //没有数据的展示
            if(records.length==0&&this.pageNum==1){
              $(".noData").show();
            }else{
              $(".noData").hide();
            }
            //暂无更多数据的显示问题
            if(records.length==0&&this.pageNum!=1){
              this.noMoreData=true;
            }
            //下载更多数据
            if(records.length==0){
              this.loadMoreState=false;
            }else{
              this.loadMoreState=true;
            } 
            records=this.tempData.concat(records);
            this.tempData=records;
            records.forEach(element => {
              element.month=new Date(element.createdTime.replace(/-/g,'/')).getMonth()+1+'月份';
              if(element.status==1){
                element.state=true;
              }else{
                element.state=false;
              }
            });
            let dataList=this.utils.formatKeyPacketData(records,'month');
            this.dataList=dataList;
          }
        },true)
      },
      //下拉加载更多
      loadMore(){
        if(this.loadMoreState){
          this.pageNum=this.pageNum+1;
          this.fetchList();
        }
      }
    }
  }
</script>
