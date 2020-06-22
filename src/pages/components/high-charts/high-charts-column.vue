<template>
  <div>
    <div id="column" :yData = "radioData"></div>
  </div>
</template>
<script>
  import HighCharts from 'highcharts'
  export default {
    data() {
      return {
        lower: [],
        upper: []
      }
    },
    props: {
      radioData:{
        type:Array,
        default: []
      }
    },
    watch: {
      radioData(val) {
        this.init();
          setTimeout( () => {
            this.lower = this.radioData[1].lower;
            this.upper = this.radioData[2].upper;
            this.column.series[0].setData(this.radioData[0].holding);
            this.column.series[1].setData(this.lower); // 低
            this.column.series[2].setData(this.upper); // 高
            this.column.xAxis[0].setCategories(this.radioData[3].holdingName);
            this.renderLabel(this.column); // 绘画标签
          }, 100);
      }
    },
    methods: {
      formatOption(){
        let option = {
          chart: {
            type: 'column'
          },
          title: {
            text: ''
          },
          xAxis: {
            categories: [
            ],
            tickLength: 0,
            gridLineColor: 'transport',
            lineColor:'transport',
            labels:{
              style: {
                fontSize:'14px',
                color: '#666B76'
              }
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            gridLineColor: 'transport',
            labels:{
              enabled: false
            }
          },
          credits: {
            enabled: false
          },
          legend: {
            enabled: false
          },
          tooltip: {
            enabled: false,
            shared: true
          },
          plotOptions: {
            column: {
              grouping: false,
              shadow: false,
              borderWidth: 0
            }
          },
          series: [{
            name: '',
            color: 'rgba(118, 125, 151, 1)',
            data: [],
            pointPadding: 0.3, // 通过 pointPadding 和 pointPlacement 控制柱子位置
            pointPlacement: -0.2,
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
            color: 'rgba(227, 176, 127, 1)',
            data: [],
            pointPadding: 0.3,
            pointPlacement: 0.2,
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
            color: 'rgba(227, 176, 127, 0.6)',
            data: [],
            pointPadding: 0.3,
            pointPlacement: 0.2,
            marker: {
              enabled:false
            },
            states: {
              hover: {
                enabled:false
              }
            },
          }]
        }
        return option;
      },
      init() {
        this.column = HighCharts.chart('column', this.formatOption());
      },
      renderLabel(chart){
        // 重新渲染label标签
        let dataHolding = chart.series[0].points;
        let dataUpper = chart.series[2].points;
        let len = 2;
        dataHolding.forEach(holdingItem => {
          holdingItem.formatData = holdingItem.y + '%';
          if ((holdingItem.y+'').length === 1) {
            len = 4;
          }
          this.render(chart, holdingItem, 'rgba(118, 125, 151, 1)', len);
        })
        dataUpper.forEach((upperItem,index) => {
          if(this.lower[index] === this.upper[index]) {
            upperItem.formatData = `${this.lower[index]}%`;
            len = 2
          }else{
            upperItem.formatData = `${this.lower[index]}%~${this.upper[index]}%`;
            len = -2;
          }
          this.render(chart, upperItem, 'rgba(227, 176, 127, 1)', len)
        })
      },
      render(chart, point, color,len) {
        // 绘画
        return chart.renderer.label(point.formatData, point.plotX-(point.formatData.length)*2+len  , point.plotY + chart.plotTop - 22)
          .css({
            color: color,
            fontFamily:'PingFangSC-Regular',
            fontSize: '10px',
            fontWeight:'bold'
          })
          .attr({
            zIndex: 6
          })
          .add();
      }
    },
  }
</script>
<style>
  #column {
    width:100%;
    height:240px
  }
</style>
