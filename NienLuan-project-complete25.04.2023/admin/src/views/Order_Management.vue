<template>
    <h3 class="text-center font-weight-bold" style="padding: 30px; color: crimson;">QUẢN LÝ ĐƠN HÀNG</h3>
    <hr />
    <v-card>
        <v-tabs v-model="tab" centered stacked>
            <v-tab value="tab-1">
                <v-badge v-if="info > 0" color="red" dot style="width: 12.5rem;">
                    <p>Xác nhận đơn hàng</p>
                </v-badge>
                <p v-else>Xác nhận đơn hàng</p>
            </v-tab>
            <v-tab value="tab-2">
                <p>Đơn hàng hoàn trả</p>
            </v-tab>
            <v-tab value="tab-3">
                <p>Tất cả đơn hàng</p>
            </v-tab>
            <v-tab value="tab-4">
                <p>Chi phí vận chuyển</p>
            </v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <v-window-item value="tab-1">
                <v-card style="padding: 10px;">
                    <Order_Confirmation v-if="dataLoaded" @info="infoNumber" />
                </v-card>
            </v-window-item>
            <v-window-item value="tab-2">
                <v-card style="padding: 10px;">
                    <Order_ReturnsVue v-if="dataLoaded" />
                </v-card>
            </v-window-item>
            <v-window-item value="tab-3">
                <v-card style="padding: 10px;">
                    <Order_All v-if="dataLoaded" />
                </v-card>
            </v-window-item>
            <v-window-item value="tab-4">
                <v-card style="padding: 10px;">
                    <ShipFee />
                </v-card>
            </v-window-item>
        </v-window>
    </v-card>
</template>

<script>
import Order_All from '../components/Order_All.vue';
import Order_Confirmation from '../components/Order_Confirmation.vue';
import Order_ReturnsVue from '../components/Order_Returns.vue';
import ShipFee from '../components/ShipFee.vue'
import OrdersService from '../services/orders.service'
import { useDataStore } from '../stores/dataStores';
export default {
    components: {
        Order_Confirmation, Order_ReturnsVue, Order_All, ShipFee
    },
    data() {
        return {
            info: 0,
            tab: null,
            dataLoaded: false
        }
    },
    methods: {
        infoNumber(e) {
            this.info = e
            // console.log(this.info)
        },
        async getOrderAll() {
            var order = await OrdersService.getAll()
            useDataStore().updateOrders(order)
            this.dataLoaded = true
        }
    },
    mounted() {
        this.getOrderAll()
    }
}
</script>