<template>
  <div>
    <div id="yieldCharts" :yData="yData"></div>
  </div>
</template>
<style>
  #yieldCharts {
    width: 100%;
    height: 200px;
  }
</style>
<script>
  import HighCharts from 'highcharts'

  export default {
    props: {
      yData: {
        type: Array,
        default: null
      },
      xAxis: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
      }
    },
    methods: {
      formatOption() {
        let option = {
          chart: {                //设置图表的样式
            //marginBottom:100,
            spacingRight: 0,
            spacingLeft: 0,
            spacingTop: 10,
          },
          //版权信息
          credits: {enabled: false},
          title: {                 //去掉默认标题
            text: "",
          },
          colors: ['#E8C7A7','#F298A0','#507FD6'],//颜色
          tooltip: {                     //提示框
            enabled:false
          },
          xAxis: {                  //X坐标
            title: {
              text: ''
            },
            categories: this.xAxis,
            visible: false,
            lineColor: '#999'
          },
          yAxis: {
            title: {
              text: ''
            },
            gridLineColor: "#F7F2EF",
            tickAmount: 5,
            labels: {
              formatter: function () {
                return this.value + '%'
              }
            },
            lineColor: '#999'
          },
          legend: {
            enabled: false,
          },
          plotOptions: {
            line: {
              lineWidth: 1.2,
              linecap: '',
            },
            series: {
              label: {
              },
              marker: {
                enabled: false
              }
            }
          },
          series: [{
            name: '',
            data: [],
            marker: {
              enabled:false
            },
            states: {
              hover: {
                enabled:false
              }
            },
          }, {
            name: '',
            data: [],
            marker: {
              //enabled:false
            },
            states: {
              hover: {
                enabled:false
              }
            },
          },{
            name: '',
            data: [],
            marker: {
              //enabled:false
            },
            states: {
              hover: {
                enabled:false
              }
            },
          }]
        };

        return option
      },
      initChart() {
        this.chart = HighCharts.chart('yieldCharts', this.formatOption());
      },
    },
    updated() {
      this.initChart();
    },
    watch: {
      yData(val) {
        setTimeout(() => {
          val.forEach((item,index) => {
            this.chart.series[this.chart.series.length-1-index].setData(item);
          })
        }, 500);
      }
    }
  }
</script>
