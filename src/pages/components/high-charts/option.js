/**
 * Created by dingliwen on 2018/11/9.
 */
module.exports = {
  chart: {
    //marginBottom:100,
    spacingRight: 0,
    spacingLeft : 0,
    spacingTop:10,
    type:'line',
  },
  //版权信息
  credits: {enabled: false},
  title:{
    text:"",
  },
  colors:['#B09079','#8990A9'],//颜色
  tooltip:{
    backgroundColor:"#8990A9",
    borderColor:"#8990A9",
    style: {
      color: '#ffffff',
    },
    footerFormat:"",
    shared: true,
  },
  xAxis:{
    title: {
      text: ''
    },
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    visible:false,
    crosshair: {
      dashStyle:'Solid',
      width:1,
      color:"#8990A9",
    }
  },
  yAxis: {
    title: {
      text: ''
    },
    gridLineColor:"#F7F2EF",
  },
  legend: {
    enabled:false,
  },
  plotOptions: {
    line:{
      lineWidth:1,
      linecap:'',
    },
    series: {
      label: {
        //connectorAllowed: false
      },
      //pointStart: 2010
    }
  },
  series: [{
    name: '本基金',
    data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
    marker:{
      enabled:false
    }
  }, {
    name: '沪深300',
    data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
    marker:{
      enabled:false
    }
  }],
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        }
      }
    }]
  }
}
