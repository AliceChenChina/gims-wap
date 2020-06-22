<template>
	<div id="app">
		<transition name="fade">
			<keep-alive :include="keepAliveList">
				<router-view/>
			</keep-alive>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'App',
  mounted () {
   window.addEventListener('resize', this.scrollIntoView)
  },
	data() {
		return {
			// 保持keep-alive的页码
			keepAliveList: ['customer']
		}
	},
  methods: {
    scrollIntoView(time = 0) {////防止键盘吧当前的输入框挡住;PS:不能再使用vuex官方不再维护的Scroller组件，两者的resize事件会冲突，导致无法离开输入框视图
      setTimeout(() => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
          setTimeout(() => {
            document.activeElement.scrollIntoViewIfNeeded()
          }, time)
        }
      })
    },
  },
  beforeDestroy () {
    if (this._debounce) {
      this._debounce.cancel()
    }
    window.removeEventListener('resize', this.scrollIntoView)
  },

}

</script>


