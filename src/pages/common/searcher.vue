

<template>
  <div class="flex jcsb w100P">
      <form  @submit.prevent="$emit('on-submit', value)" action="." class="fx-auto bd1e6e6e6 bd-radius2">
        <div class="h32 w100P rel pl30" >
          <i class="weui-icon-search weui-icon-search1" v-show="isFocus || currentValue"></i>
          <input
            class="bd-none w100P searchInput"
            style="height: 20px;line-height: 20px"
            v-model="currentValue"
            ref="input"
            type="search"
            autocomplete="off"
            id="search_input"
            @focus="onFocus"
            @blur="onBlur"
            @compositionstart="onComposition($event, 'start')"
            @compositionend="onComposition($event, 'end')"
            @input="onComposition($event, 'input')"/>
          <a
            href="javascript:"
            class="weui-icon-clear abs top8 r0 pl10 pr10"
            @click="clear"
            v-show="currentValue"></a>
          <label
            for="search_input"
            class="abs lh32 left50P transLx50P top0"
            v-show="!isFocus && !currentValue" >
            <i class="weui-icon-search"></i>
            <span class="fz12 C999">{{ placeholder}}</span>
          </label>
        </div>
      </form>
      <p
        class="fz14 ml16 textBlue"
        @click="cancel">取消
      </p>
  </div>
</template>

<i18n>
  cancel_text:
  en: cancel
  zh-CN: 取消
  placeholder:
  en: Search
  zh-CN: 搜索
</i18n>

<script>
  export default {
    name: 'search',
    props: {
      required: {
        type: Boolean,
        default: false
      },
      placeholder: String,
      cancelText: String,
      value: {
        type: String,
        default: ''
      },
      results: {
        type: Array,
        default () {
          return []
        }
      },
      autoFixed: {
        type: Boolean,
        default: true
      },
      top: {
        type: String,
        default: '0px'
      },
      position: {
        type: String,
        default: 'fixed'
      },
      autoScrollToTop: Boolean
    },
    created () {
      if (this.value) {
        this.currentValue = this.value
      }
    },
    computed: {
      fixPosition () {
        if (this.isFixed) {
          return this.position === 'absolute' ? 'absolute' : 'fixed'
        }
        return 'static'
      }
    },
    methods: {
      emitEvent () {
        this.$nextTick(() => {
          this.$emit('input', this.currentValue)
          this.$emit('on-change', this.currentValue)
        })
      },
      onComposition ($event, type) {
        if (type === 'start') {
          this.onInput = true
        }
        if (type === 'end') {
          this.onInput = false
          this.emitEvent()
        }
        if (type === 'input') {
          if (!this.onInput) {
            this.emitEvent()
          }
        }
      },
      clear () {
        this.currentValue = ''
        this.emitEvent()
        this.isFocus = true
        this.setFocus()
        if (this.autoFixed && !this.isFixed) {
          this.isFixed = true
        }
        this.$emit('on-clear')
      },
      cancel () {
        this.isCancel = true
        this.currentValue = ''
        this.emitEvent()
        this.isFixed = false
        this.$emit('on-cancel')
      },
      handleResultClick (item) {
        this.$emit('result-click', item) // just for compatibility
        this.$emit('on-result-click', item)
        this.isCancel = true
        this.isFixed = false
      },
      touch () {
        this.isCancel = false
        if (this.autoFixed) {
          this.isFixed = true
        }
        this.$emit('on-touch')
      },
      setFocus () {
        console.log('this', this.$refs);
        this.$refs.input.focus()
      },
      setBlur () {
        console.log('this', this.$refs);
        this.$refs.input.blur()
      },
      onFocus () {
        this.isFocus = true
        this.$emit('on-focus')
        this.touch()
      },
      onBlur () {
        this.isFocus = false
        this.$emit('on-blur')
      }
    },
    data () {
      return {
        onInput: false,
        currentValue: '',
        isCancel: true,
        isFocus: false,
        isFixed: false
      }
    },
    watch: {
      isFixed (val) {
        if (val === true) {
          this.setFocus()
          this.isFocus = true
          if (this.autoScrollToTop) {
            setTimeout(() => {
              window.scrollTo(0, 0)
            }, 150)
          }
        } else {}
      },
      value (val) {
        this.currentValue = val
      }
    }
  }
</script>

<style lang="less">
  .weui-icon-search1 {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  .searchInput {
    margin-top: 6px;
  }


</style>
