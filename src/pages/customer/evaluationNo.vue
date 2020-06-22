<template>
    <view-box ref="viewBox" class="noFooter">
        <Header title="风险评测" />
        <div class="scrollerMain evaluation">
            <div class="evaluation-no-header">
                <img src="@/assets/images/evaluation_no.png">
            </div>
            <p class="desc">一分钟了解您的风险承受力，<br>
            获得更好的投资服务，更科学的资产配置方案</p>
            <div class="nav-btn">
                <x-button type="warn" link="/customer/questions">开始评测</x-button>
            </div>
        </div>
</view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
export default {
    name: 'evaluationNo',
    components: {
        Header,
        Footer
    },
    data () {
        return {}
    },
    mounted(){},
    methods: {}
}
</script>
