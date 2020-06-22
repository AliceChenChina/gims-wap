<template>
    <view-box ref="viewBox" class="noFooter">
        <Header title="评测结果" /> 
        <div class="scrollerMain evaluation">
            <div class="evaluation-header">
                稳健型
            </div>
            <p class="desc">“适合购买低、较低风险、中等风险产品”</p>
            <div class="nav-btn">
                <x-button type="warn" link="/customer/details?id=1">完成</x-button>
                <x-button type="default"  link="/customer/questions" class="link">重新评测</x-button>
            </div>
            <div class="risk">
                <img src="@/assets/images/sfz_l9.png" class="risk-bg" />
                <router-link to="" class="upload">
                    <img src="@/assets/images/upload.png" class="add" />
                    <p class="add-title">选择纸质问卷附件上传</p>
                </router-link>
            </div>
        </div>      
</view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
export default {
    name: 'evaluation',
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


