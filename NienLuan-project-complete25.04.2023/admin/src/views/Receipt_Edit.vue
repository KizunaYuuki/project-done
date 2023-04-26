<template>
    <h3 class="text-center font-weight-bold" style="padding: 10px;color: crimson;">SỬA PHIẾU NHẬP HÀNG</h3>
    <hr>
    <Receipt_Form :info="id" :flag="1" />
</template>

<script>
import Receipt_Form from '../components/Receipt_Form.vue';
import { useDataStore } from '../stores/dataStores';
import ReceiptsService from '../services/receipts.service';

export default {
    components: {
        Receipt_Form
    },
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {
            receipt: Object
        }
    },
    methods: {
        async getReceipt() {
            this.receipt = await ReceiptsService.get(this.id)
            // this.receipt = this.receipt[0]
            console.log(this.id)
            console.log(this.receipt)
        }
    },
    created() {
        // this.receipt =  ReceiptsService.get(this.id)
    },
    mounted() {
        // this.receipt = useDataStore().getReceiptList.filter(item => item.id === this.id)
        // this.getReceipt()


    }
}
</script>