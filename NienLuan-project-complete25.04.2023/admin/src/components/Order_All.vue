<template>
    <div class="row">
        <div style="padding: 5px;" class="col-sm-8">
            <v-text-field list="datalistOptions2" ref="search" append-inner-icon="mdi-magnify"
                label="Tìm kiếm theo số điện thoại, tên người nhận hoặc mã đơn hàng" @change="search"
                style="width: 100%;"></v-text-field>
            <datalist id="datalistOptions2">
                <option v-for="item in orderList" :key="item._id" :value="item._id">{{ item.phone }} | {{ item.userName
                }}</option>
            </datalist>
        </div>
        <v-select class="col-sm-4" label="Trạng thái" v-model="selectStatus" @update:model-value="find"
            :items="['Tất cả', 'Chờ xác nhận', 'Lấy hàng', 'Đang giao', 'Đã nhận', 'Đã hủy', 'Hoàn trả']"></v-select>
    </div>
    <h4 class="text-center" style="color: blue; text-transform: uppercase;">Danh sách đơn hàng</h4>
    <h6>Số lượng đơn hàng: {{ orderList.length }}</h6>
    <v-table fixed-header height="300px">
        <thead class="table-active">
            <tr>
                <th>STT</th>
                <th>Mã đơn hàng</th>
                <th>Ngày đặt hàng</th>
                <th>Tên người nhận hàng</th>
                <th>Số điện thoại</th>
                <th>Hình thức thanh toán</th>
                <th>Tổng thanh toán</th>
                <th>Trạng thái</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="( item, index) in orderList" :key="item._id">
                <th>{{ index + 1 }}</th>
                <th> <v-dialog transition="dialog-bottom-transition" width="auto">
                        <template v-slot:activator="{ props }">
                            <a v-bind="props">{{ item._id }}</a>
                        </template>
                        <template v-slot:default="{ isActive }">
                            <v-card>
                                <v-toolbar color="primary" title="Chi tiết đơn hàng"></v-toolbar>
                                <v-card-text>
                                    <div style="padding: 20px;">
                                        <div class="row">
                                            <div class="col">
                                                <p>Mã đơn hàng: {{ item._id }}</p>
                                                <p>Ngày đặt hàng: {{ formatDate(item.orderDate, 0) }}</p>
                                                <p style="display: flex;">Hình thức thanh toán:
                                                <p style="color: green;"> {{ item.payment }}</p>
                                                </p>
                                                <p style="display: flex;">Trạng thái đơn hàng:
                                                <p style="color: blue;"> {{ item.orderStatus }}</p>
                                                </p>
                                            </div>
                                            <div class="col">
                                                <p>Tên người nhận hàng: {{ item.userName }}</p>
                                                <p>Số điện thoại: {{ item.phone }}</p>
                                                <p>Địa chỉ nhận hàng: {{ item.reAddress }}</p>
                                                <p v-if="new Date(item.reDate) > new Date('2010-01-01T00:00:00.000+00:00')">
                                                    Ngày nhận: {{
                                                        formatDate(item.reDate, 0) }}</p>
                                            </div>
                                        </div>
                                        <h5>Thông tin đặt hàng</h5>
                                        <v-table fixed-header height="300px">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Số lượng</th>
                                                    <th>Giá bán (&#8363;)</th>
                                                    <th>Thành tiền</th>
                                                </tr>
                                            </thead>
        <tbody>
            <tr v-for="(index, i) in item.productList" :key="index._idBook">
                <th>{{ i + 1 }}</th>
                <th>{{ getName(index._idBook) }}</th>
                <th>{{ index.quantity }}</th>
                <th>{{ index.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</th>
                <th></th>
            </tr>
            <tr>
                <th colspan="4">Tổng tiền hàng</th>
                <th>{{ item.totalProductMoney.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}
                </th>
            </tr>
            <tr>
                <th colspan="4">Phí vận chuyển</th>
                <th>{{ item.shipFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</th>
            </tr>
            <tr>
                <th colspan="4">Tổng thanh toán</th>
                <th>{{ item.orderTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</th>
            </tr>
        </tbody>
    </v-table>
    </div>
    </v-card-text>
    <v-card-actions class="justify-end">
        <v-btn variant="text" @click="isActive.value = false">Close</v-btn>
    </v-card-actions>
    </v-card>
    </template>
    </v-dialog>
    </th>
    <th>{{ formatDate(item.orderDate, 0) }}</th>
    <th>{{ item.userName }}</th>
    <th>{{ item.phone }}</th>
    <th>{{ item.payment }}</th>
    <th>{{ item.orderTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</th>
    <th>{{ item.orderStatus }}</th>
    </tr>
    </tbody>
    </v-table>
</template>

<script>
import { useDataStore } from '../stores/dataStores';
import { format } from 'date-fns';
export default {
    data() {
        return {
            orderList: useDataStore().getOrderList,
            selectStatus: '',
        }
    },
    methods: {
        find() {
            if (this.selectStatus === 'Tất cả') {
                this.orderList = useDataStore().getOrderList
            }
            else {
                this.orderList = useDataStore().getOrderList.filter(item => item.orderStatus === this.selectStatus)
            }
        },
        search() {
            if (this.$refs.search.value === '') {
                this.orderList = useDataStore().getOrderList
            }

            else {
                this.orderList = this.orderList.filter(item => item._id === this.$refs.search.value)
            }
        },
        getName(id) {
            var book = useDataStore().getBooks.filter(book => book._id === id)
            book = book[0]
            return book.bookName
        },
        formatDate(time, flag) {
            if (flag === 0) {
                return format(new Date(time), 'yyyy-MM-dd HH:mm')
            }
            return format(new Date(time), 'yyyy-MM-dd')
        }
    },
    mounted() {

    }
}
</script>