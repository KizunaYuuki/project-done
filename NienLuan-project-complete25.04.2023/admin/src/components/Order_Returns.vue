<template>
    <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
        <div style="padding: 5px;">
            <v-text-field list="datalistOptions1" ref="search" append-inner-icon="mdi-magnify"
                label="Tìm kiếm theo số điện thoại, tên người nhận hoặc mã đơn hàng" @change="search"></v-text-field>
            <datalist id="datalistOptions1">
                <option v-for="item in orderList1" :key="item._id" :value="item._id">{{ item.phone }} | {{ item.userName
                }}</option>
            </datalist>
        </div>
        <h4 class="text-center" style="color: blue; text-transform: uppercase;">Đơn hàng hoàn trả</h4>
        <h6>Số lượng đơn hàng hoàn trả: {{ orderList1.length }}</h6>
        <v-table fixed-header height="300px">
            <thead class="table-active">
                <tr>
                    <th>STT</th>
                    <th>Mã đơn hàng</th>
                    <th>Ngày đặt hàng</th>
                    <th>Ngày hoàn trả</th>
                    <th>Tên người nhận hàng</th>
                    <th>Số điện thoại</th>
                    <th>Tổng thanh toán</th>
                    <th>Nhập hàng lại</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="( item, index) in orderList1" :key="item._id">
                    <th>{{ index + 1 }}</th>
                    <th> <v-dialog transition="dialog-bottom-transition" width="auto">
                            <template v-slot:activator="{ props }">
                                <!-- <v-btn color="primary" v-bind="props">From the bottom</v-btn> -->
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
                                                    <p>Ngày hoàn trả: {{ formatDate(item.reDate, 0) }}</p>
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
    <th>{{ formatDate(item.orderDate) }}</th>
    <th>{{ formatDate(item.reDate) }}</th>
    <th>{{ item.userName }}</th>
    <th>{{ item.phone }}</th>
    <th>{{ item.orderTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</th>
    <th><button @click="orderReturn(item)" style="width: max-content;" class="btn btn-primary">Nhập
            hàng</button></th>
    </tr>
    </tbody>
    </v-table>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { format } from 'date-fns';
import { useDataStore } from '../stores/dataStores';
import BooksService from '../services/books.service';
import OrdersService from '../services/orders.service';
export default {
    data() {
        return {
            orderList1: useDataStore().getOrderList.filter(order => order.enter === true),
            dialog: false,
        }
    },
    methods: {
        orderNumber() {
            this.$emit('info', this.orderList1.length)
            console.log(this.orderList1.length)

        },
        getName(id) {
            var book = useDataStore().getBooks.filter(book => book._id === id)
            book = book[0]
            return book.bookName
        },
        async orderReturn(order) {
            for (var j of order.productList) {
                try {
                    var book = await BooksService.get(j._idBook)
                    console.log(book, book.bookStock + j.quantity)
                    var kq = await BooksService.update(j._idBook, { bookStock: book.bookStock + j.quantity })

                    if (kq) {
                        var enter = await OrdersService.update(order._id, { enter: false })
                        toast.success(book.bookName + " nhập lại thành công!", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                    }
                    else {
                        toast.error(book.bookName + " nhập lại thất bại!", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                    }
                }
                catch (err) {
                    console.log(err)
                }
            }
            var data = await BooksService.getAll()
            var data1 = await OrdersService.getAll()
            useDataStore().updateBooks(data)
            useDataStore().updateOrders(data1)
            this.orderList1 = useDataStore().getOrderList.filter(order => order.enter === true)
        },
        search() {
            if (this.$refs.search.value === '') {
                this.orderList1 = useDataStore().getOrderList.filter(order => order.enter === true)
            }

            else {
                this.orderList1 = this.orderList1.filter(item => item._id === this.$refs.search.value)
            }
        },
        formatDate(time, flag) {
            if (flag === 0) {
                return format(new Date(time), 'yyyy-MM-dd HH:mm')
            }
            return format(new Date(time), 'yyyy-MM-dd')
        }
    },
    mounted() {
        // this.orderNumber()
    }
}
</script>