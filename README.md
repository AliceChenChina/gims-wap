# finance

> finance

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
# 为了兼容IOS13系统，scroller组件源码做了修改
位置：node_modules => vux_xscroll => build => cmd => simulate-scroll.js 
修改的内容为： 
getScrollTop: function() {
          var transY = window.getComputedStyle(this.container)[transform].match(/[-\d\.*\d*e\-\d]+/g);
          return transY ? Math.round(transY[5]) === 0 ? 0 : -Math.round(transY[5]) : 0;
        }
