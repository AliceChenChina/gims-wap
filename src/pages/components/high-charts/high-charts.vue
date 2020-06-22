<template>
  <div class="x-bar" id="high-charts">
    <div :id="id" :yData="yData" class="charts"></div>
  </div>
</template>
<style>
  .charts {
    width: 100%;
    height: 460px;
  }

  /*用于修改highcharts tooltip在绘图区域外显示*/
  #high-charts .highcharts-container {
    overflow: initial !important;
  }
</style>
<script>
  import HighCharts from 'highcharts'

  export default {
    props: {
      id: {
        type: String
      },
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
        foundName1: "",
        foundName2: ""
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
          colors: ['#B09079', '#8990A9'],//颜色
          tooltip: {                     //提示框
            shared: true,
            crosshairs: true,
            dateTimeLabelFormats: {     //设置日期格式
              day: '%Y-%m-%d'
            },
            valueSuffix: '%',      //设置单位
            valueDecimals: 2,      //保留小位数2位

          },
          xAxis: {                  //X坐标
            title: {
              text: ''
            },
            categories: this.xAxis,
            visible: false,
            crosshair: {
              dashStyle: 'Solid',
              width: 1,
              color: "#8990A9",
            },
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
              lineWidth: 1,
              linecap: '',
            },
            series: {
              label: {
                //connectorAllowed: false
              },
              marker: {
                enabled: false
              },
              //pointStart: 2010
            }
          },
          series: [{
            //name: this.yData[0].productName,
            name: this.foundName1,
            data: [],
            marker: {
              //enabled:false
            },
            states: {
              hover: {
                // enabled:false
              }
            },
          }, {
            //name: this.yData[1].productName,
            name: this.foundName2,
            data: [],
            marker: {
              //enabled:false
            },
            states: {
              hover: {
                // enabled:false
              }
            },
          }],
          formatter: function () {
            return this.point.name + this.percentage + '%';
          }
        };

        return option
      },
      initChart() {
        this.chart = HighCharts.chart(this.id, this.formatOption());
      },
      formatData(data) {
        let product = [];
        data.forEach(function (item, index) {
          //增加转为数字
          product[index] = parseFloat(item.value[1])
        });
        return product
      },
      changeChart(foundData, hsData) {
        HighCharts.setOptions({
          series: [{
            name: '',
            data: ["0.00%", "2.96%", "1.88%", "2.38%", "3.54%", "2.53%", "-5.05%", "-1.66%", "1.08%", "3.39%", "5.34%", "2.67%", "-1.59%", "2.31%", "2.60%", "5.27%", "3.75%", "2.45%", "4.47%", "8.30%", "10.25%", "10.82%", "12.19%", "14.14%", "12.41%", "9.81%", "11.69%", "7.86%", "12.05%", "10.97%", "9.38%", "2.31%", "3.03%", "-0.14%", "1.88%", "1.52%", "0.94%", "-1.59%", "1.88%", "2.81%", "-4.91%", "-6.06%", "-5.48%", "-0.58%", "-2.38%", "1.15%", "-2.53%", "0.07%"],
            marker: {
              enabled: false
            }
          }, {
            name: '',
            data: ["0.00%", "2.96%", "1.88%", "2.38%", "3.54%", "2.53%", "-5.05%", "-1.66%", "1.08%", "3.39%", "5.34%", "2.67%", "-1.59%", "2.31%", "2.60%", "5.27%", "3.75%", "2.45%", "4.47%", "8.30%", "10.25%", "10.82%", "12.19%", "14.14%", "12.41%", "9.81%", "11.69%", "7.86%", "12.05%", "10.97%", "9.38%", "2.31%", "3.03%", "-0.14%", "1.88%", "1.52%", "0.94%", "-1.59%", "1.88%", "2.81%", "-4.91%", "-6.06%", "-5.48%", "-0.58%", "-2.38%", "1.15%", "-2.53%", "0.07%"],
            marker: {
              enabled: false
            }
          }]
        })
      }
    },
    updated() {
      var that = this;
      that.initChart();
    },
    watch: {
      yData(val) {
        this.yData = val;
        this.foundName1 = this.yData[0].productName;
        this.foundName2 = this.yData[1].productName;
        let foundData = this.formatData(val[0].data);
        let hsData = this.formatData(val[1].data);
        var that = this;
        setTimeout(function () {

          that.chart.series[0].setData(foundData);
          that.chart.series[1].setData(hsData);
          console.log('that.chart.series1',foundData);
          console.log('that.chart.series2',hsData);
        }, 50);

      }
    }
  }
</script>
