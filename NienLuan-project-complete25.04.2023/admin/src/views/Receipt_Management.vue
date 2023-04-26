<template>
    <div class="container " style="padding: 30px; ">
        <h3 class="text-center font-weight-bold" style="color: crimson;">QUẢN LÝ NHẬP HÀNG</h3>
        <hr />
        <v-card>
            <v-tabs v-model="tab" centered stacked>
                <v-tab value="tab-1">
                    <p>Phiếu nhập hàng</p>
                </v-tab>
                <v-tab value="tab-2">
                    <p>Nhà cung cấp</p>
                </v-tab>
                <!-- <v-tab value="tab-3">
                Nearby
            </v-tab> -->
            </v-tabs>

            <v-window v-model="tab">
                <v-window-item value="tab-1">
                    <v-card style="padding: 10px;">
                        <Receipt_ListVue />
                    </v-card>
                </v-window-item>
                <v-window-item value="tab-2">
                    <v-card style="padding: 10px;">
                        <Supplier_List />
                    </v-card>
                </v-window-item>
            </v-window>
        </v-card>
    </div>
</template>

<script>
import { useDataStore } from '../stores/dataStores';
import Supplier_List from '../components/Supplier_List.vue';
import Receipt_ListVue from '../components/Receipt_List.vue';

export default {
    components: {
        Receipt_ListVue, Supplier_List
    },
    data() {
        return {
            list: useDataStore().getReceiptList,
            radio: '',
            info: 0,
            tab: null,
        }
    },
    methods: {
        async getReceipts() {
            var data = await ReceiptsService.getAll()
            useDataStore().updateReceipt(data)
        }
    },
    mounted() {
        // this.getReceipts()
    }
}
</script>