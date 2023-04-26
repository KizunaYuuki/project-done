<template>
    <h3 class="text-center font-weight-bold" style="padding: 20px;color: #356859;">ĐƠN VỊ VẬN CHUYỂN</h3>
    <hr>
    <div style="padding: 5px;" class="">
        <v-text-field list="datalistOptions2" ref="search" append-inner-icon="mdi-magnify"
            label="Tìm kiếm theo số điện thoại, tên người nhận hoặc mã đơn hàng" @change="search"
            style="width: 100%;"></v-text-field>
        <datalist id="datalistOptions2">
            <option v-for="item in orderAll" :key="item._id" :value="item._id">{{ item.phone }} | {{ item.userName
            }}</option>
        </datalist>
    </div>
    <v-table fixed-header height="300px">
        <thead class="table-active">
            <tr>
                <th>STT</th>
                <th>Mã đơn hàng</th>
                <th>Ngày đặt hàng</th>
                <th>Số điện thoại</th>
                <th>Tổng thanh toán</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="( item, index) in orderAll" :key="item._id">
                <th>{{ index + 1 }}</th>
                <th style="width: 0;">{{ item._id }}</th>
                <th style="width: 0;">{{ item.orderDate }}</th>
                <th>{{ item.phone }}</th>
                <th>{{ item.orderTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</th>
                <th>{{ item.orderStatus }}</th>
                <th style="" v-if="item.orderStatus === 'Lấy hàng'"><button class="btn btn-primary"
                        @click="updateStatus(0, item)">Đang giao</button></th>
                <th v-else style=""><button class="btn btn-primary" @click="updateStatus(1, item)">Đã nhận</button><button
                        @click="updateStatus(2, item)" class="btn btn-danger">Hoàn
                        trả</button></th>
            </tr>
        </tbody>
    </v-table>
</template>

<script>
import OrdersService from '../services/orders.service';
import { useDataStore } from '../stores/dataStores';
export default {
    data() {
        return {
            orderAll: []
        }
    },
    methods: {
        async getOrder() {
            var order = await OrdersService.getAll()
            order = order.filter(item => item.orderStatus !== 'Hoàn trả' && item.orderStatus !== 'Đã hủy' && item.orderStatus !== 'Chờ xác nhận' && item.orderStatus !== 'Đã nhận')
            useDataStore().updateShipOrder(order)
            this.orderAll = useDataStore().getShipOrder
            console.log(this.orderAll)
        },
        async updateStatus(e, order) {
            if (e === 0) {
                var kq = await OrdersService.update(order._id, { orderStatus: 'Đang giao' })
            }
            else if (e === 1) {
                var kq = await OrdersService.update(order._id, { orderStatus: 'Đã nhận', reDate: new Date() })
            }
            else {
                var kq = await OrdersService.update(order._id, { orderStatus: 'Hoàn trả', reDate: new Date(), enter: true })
            }
            this.getOrder()
        },
        search() {
            if (this.$refs.search.value === '') {
                this.orderAll = useDataStore().getShipOrder
            }

            else {
                this.orderAll = this.orderAll.filter(item => item._id === this.$refs.search.value)
            }
        }
    },
    mounted() {
        this.getOrder()
    }
}
</script>
