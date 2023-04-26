<template>
    <h3 class="text-center font-weight-bold" style="padding: 20px;color: crimson;">QUẢN LÝ BÁN HÀNG</h3>
    <hr>
    <!-- <vue-html2pdf ref="pdf">aa</vue-html2pdf> -->
    <v-container>
        <v-row justify-sm="space-between" style="font-size: larger;">
            <v-col>
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <v-card class="shadow" v-bind="props" :color="isHovering ? 'primary' : undefined"
                            :title="'Doanh thu hôm nay ' + sales.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })"
                            style="width: max-content; color: blueviolet;"></v-card>
                    </template>
                </v-hover>
            </v-col>
            <v-col v-if="confirmOrder.length > 0">
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <router-link :to="{ name: 'Orders' }"><v-card class="shadow" v-bind="props"
                                :color="isHovering ? 'primary' : undefined"
                                :title="confirmOrder.length + ' đơn hàng chờ xác nhận'"
                                style="width: max-content; color: red;"></v-card></router-link>
                    </template>
                </v-hover>
            </v-col>
            <v-col v-if="orderReturn.length > 0">
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <router-link :to="{ name: 'Orders' }"><v-card class="shadow" v-bind="props"
                                :color="isHovering ? 'primary' : undefined"
                                :title="orderReturn.length + ' đơn hàng hoàn trả'"
                                style="width: max-content;color:orange;"></v-card></router-link>
                    </template>
                </v-hover>
            </v-col>
            <v-col>
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <router-link :to="{ name: 'Products' }"><v-card class="shadow" v-bind="props"
                                :color="isHovering ? 'primary' : undefined"
                                :title="'Có tất cả ' + bookAll.length + ' mẫu sách'"
                                style="width: max-content;color:plum;"></v-card></router-link>
                    </template>
                </v-hover>
            </v-col>
            <v-col v-if="bookNew.length > 0">
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <router-link :to="{ name: 'Products' }"><v-card class="shadow" v-bind="props"
                                :color="isHovering ? 'primary' : undefined" :title="bookNew.length + ' sách mới nhập'"
                                style="width: max-content;color:blue;"></v-card></router-link>
                    </template>
                </v-hover>
            </v-col>
            <v-col v-if="bookOut.length > 0">
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <router-link :to="{ name: 'Products' }"><v-card class="shadow" v-bind="props"
                                :color="isHovering ? 'primary' : undefined" :title="bookOut.length + ' sách hết hàng'"
                                style="width: max-content;color:gold;"></v-card></router-link>
                    </template>
                </v-hover>
            </v-col>
            <v-col>
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <v-card class="shadow" v-bind="props" :color="isHovering ? 'primary' : undefined"
                            :title="bookNumber + ' quyển sách trong kho'" style="width: max-content;color:green;"></v-card>
                    </template>
                </v-hover>
            </v-col>
            <v-col v-if="users.length > 0">
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <router-link :to="{ name: 'Clients' }"><v-card class="shadow" v-bind="props"
                                :color="isHovering ? 'primary' : undefined" :title="users.length + ' khách hàng thành viên'"
                                style="width: max-content;color:palegreen;"></v-card></router-link>
                    </template>
                </v-hover>
            </v-col>
            <v-col v-if="supplier.length > 0">
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <router-link :to="{ name: 'Receipts' }"> <v-card class="shadow" v-bind="props"
                                :color="isHovering ? 'primary' : undefined" :title="supplier.length + ' nhà cung cấp'"
                                style="width: max-content;color:purple;"></v-card></router-link>
                    </template>
                </v-hover>
            </v-col>
            <v-col v-if="genres.length > 0">
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <router-link :to="{ name: 'Catalog' }"><v-card class="shadow" v-bind="props"
                                :color="isHovering ? 'primary' : undefined" :title="genres.length + ' thể loại'"
                                style="width: max-content;color:peru;"></v-card></router-link>
                    </template>
                </v-hover>
            </v-col>
        </v-row>
    </v-container>
    <div v-if="waiting" style="margin-top: 20px;">
        <h6>Biểu đồ thống kế trạng thái của {{ orderAll.length }} đơn hàng</h6>
        <div>
            <ChartOrders :data="orderAll" />
        </div>
        <h6 style="margin-top: 20px;">Biểu đồ thống kê kho sách</h6>
        <div>
            <Chart_Stock :data="bookAll" />
        </div>
        <h6 style="margin-top: 20px; ">Biểu đồ thống kê số mẫu sách của {{ genres.length }} thể loại</h6>
        <div style="height: 15rem;">
            <Chart_Genres :genres="genres" :books="bookAll" />
        </div>
        <h6 style="margin-top: 20px;">Biểu đồ thống kê số mẫu sách của {{ supplier.length }} nhà cung cấp</h6>
        <div style="height: 15rem;">
            <Chart_SuppliersVue :suppliers="supplier" :books="bookAll" />
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { format } from 'date-fns';
import { useDataStore } from '../stores/dataStores';
import OrdersService from '../services/orders.service'
import BooksService from '../services/books.service';
import UsersService from '../services/users.service'
import SuppliersService from '../services/suppliers.service';
import GenresService from '../services/genres.service';
import ChartOrders from '../components/Chart_Orders.vue'
import Chart_Stock from '../components/Chart_Stock.vue';
import Chart_Genres from '../components/Chart_Genres.vue';
import Chart_SuppliersVue from '../components/Chart_Suppliers.vue';
export default {
    components: { ChartOrders, Chart_Stock, Chart_Genres, Chart_SuppliersVue, },
    data() {
        return {
            sales: 0,
            confirmOrder: [],
            orderReturn: [],
            bookAll: [],
            bookNew: [],
            bookOut: [],
            users: [],
            supplier: [],
            bookNumber: 0,
            genres: [],
            orderAll: [],
            waiting: false
        }
    },
    methods: {
        async getOrders() {
            var stock = await BooksService.getAll()
            this.bookAll = stock
            for (var j of this.bookAll) {
                this.bookNumber = this.bookNumber + j.bookStock
            }
            this.bookNew = stock.filter(book => book.author === undefined)
            this.bookOut = stock.filter(book => book.bookStock === 0)
            // console.log(this.bookOut)
            this.users = await UsersService.getAll()
            this.supplier = await SuppliersService.getAll()
            this.orderAll = await OrdersService.getAll()
            this.confirmOrder = this.orderAll.filter(item => item.orderStatus === 'Chờ xác nhận')
            this.orderReturn = this.orderAll.filter(item => item.enter === true)
            var orders = this.orderAll.filter(item => item.orderStatus === 'Lấy hàng' || item.orderStatus === 'Chờ xác nhận')
            this.genres = await GenresService.getAll()
            this.waiting = true
            // console.log(orders)
            for (var i of orders) {
                // const localTime = moment.utc(i.orderDate).tz('Asia/Ho_Chi_Minh').format()
                var orderDate = this.formatDate(i.orderDate)
                var now = this.formatDate(new Date())
                // console.log(now)
                // console.log(orderDate)
                if (now === orderDate) {
                    this.sales = Number(this.sales) + Number(i.totalProductMoney)
                    // console.log(this.sales)
                }
            }
            useDataStore().updateSales(this.sales)

        },
        formatDate(time) {
            var today = new Date(time)
            const day = today.getDate(); // Lấy ngày trong tháng (1-31)
            const month = today.getMonth() + 1; // Lấy tháng trong năm (0-11). Cần +1 vì phương thức getMonth() trả về giá trị từ 0 đến 11.
            const year = today.getFullYear(); // Lấy năm (4 chữ số)
            return `${year}-${month}-${day}`
        },

    },
    mounted() {
        this.getOrders()
        // setInterval(() => {
        //     this.sales = 0
        //     this.getOrders()
        // }, 20000);

    }
}
</script>