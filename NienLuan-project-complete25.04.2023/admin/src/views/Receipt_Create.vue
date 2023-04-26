<template>
    <h3 class="text-center font-weight-bold" style="padding: 10px;color: crimson;">THÊM PHIẾU NHẬP HÀNG</h3>
    <hr>
    <Receipt_Form :info="value" :flag="0" />
</template>

<script>
import Receipt_Form from '../components/Receipt_Form.vue';
export default {
    components: {
        Receipt_Form
    },
    data() {
        return {
            value: {}
        }

    }
}
</script>