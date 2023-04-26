<template >
    <div v-if="this.load" class="mt-2">
        <div class="container mb-2 bg-white rounded ps-5">
            <div class="text-uppercase fw-semibold"> Chi tiết đơn hàng</div>
            <div class="row">
                <div class="col">
                    <div>Mã đơn hàng: {{ getIdOrder }}</div>
                    <div>{{ this.orderDetail[0].orderStatus }}</div>

                    <div>Ngày mua: {{ showDate(this.orderDetail[0].orderDate) }} {{ showTime(this.orderDetail[0].orderDate)
                    }}</div>
                    <div v-show="show">Ngày nhận: {{ showDate(this.orderDetail[0].reDate) }} {{
                        showTime(this.orderDetail[0].reDate) }}</div>
                    <div>Tổng tiền: {{ this.orderDetail[0].orderTotal.toLocaleString('vi-VN',
                        { style: 'currency', currency: 'VND' }) }}</div>
                </div>
                <div class="col">
                    <button class="btn btn-danger " @click="openDialog"
                        :disabled="cancelButtonOrder(this.orderDetail[0].orderStatus)">Huỷ đơn
                        hàng</button>
                </div>
                <v-dialog v-model="dialog" persistent max-width="400">
                    <v-card>
                        <v-card-title class="headline">Bạn có muốn hủy đơn hàng không?</v-card-title>
                        <v-card-text>
                            Hành động này không thể hoàn trả
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="green darken-1" text @click="dialog = false; cancelOrder()">Vâng</v-btn>
                            <v-btn color="red darken-1" text @click="dialog = false">Không</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>

        </div>

        <div class="container mb-2 bg-white rounded ps-5">
            <div class="row">
                <div class="col-sm">
                    <div class="text-uppercase fw-semibold">Thông tin người nhận</div>
                    <div>{{ this.orderDetail[0].userName }}</div>
                    <div>{{ this.orderDetail[0].phone }}</div>
                    <div>{{ this.orderDetail[0].reAddress }}</div>
                </div>
                <div class="col-sm">
                    <div class="text-uppercase fw-semibold">Phương thúc thanh toán</div>
                    <div>{{ this.orderDetail[0].payment }}</div>
                </div>
            </div>
        </div>
        <div class="container bg-white rounded ps-5">
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">
                            Hình ảnh
                        </th>
                        <th class="text-left">
                            Tên sản phẩm
                        </th>
                        <th class="text-left">
                            Giá bán
                        </th>
                        <th class="text-left">
                            Só lượng
                        </th>
                        <th class="text-left">
                            Thành tiền
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="items in this.orderDetail[0].productList">
                        <td><img :src="getImageArray(items._idBook)" width="60" class="rounded" alt="..."></td>

                        <td>{{ findBookNameById(items._idBook) }}</td>


                        <td>{{ items.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}
                            <div v-show="false"> {{
                                calcDisconnt(items.price, findOriginalPrice(items._idBook), items.quantity) }} </div>
                            <div class="text-decoration-line-through fw-light" style="font-size: small;"
                                v-if="items.price != findOriginalPrice(items._idBook)"> {{
                                    findOriginalPrice(items._idBook).toLocaleString('vi-VN', {
                                        style: 'currency', currency:
                                            'VND'
                                    }) }}</div>
                        </td>
                        <td>{{ items.quantity }}</td>
                        <td>{{ calc(items.price, items.quantity).toLocaleString('vi-VN', {
                            style: 'currency', currency:
                                'VND'
                        })
                        }}</td>

                    </tr>

                </tbody>
            </v-table>
            <div class="d-flex justify-content-end">Thành tiền {{
                this.orderDetail[0].totalProductMoney.toLocaleString('vi-VN',
                    { style: 'currency', currency: 'VND' }) }}</div>
            <div class="d-flex justify-content-end">Phí vận chuyển {{ this.orderDetail[0].shipFee.toLocaleString('vi-VN',
                { style: 'currency', currency: 'VND' }) }}</div>
            <div class="d-flex justify-content-end">Chiết khấu {{ (discount / 100).toLocaleString('vi-VN',
                { style: 'currency', currency: 'VND' }) }}</div>
            <div class="d-flex justify-content-end">Tổng số tiền {{ this.orderDetail[0].orderTotal.toLocaleString('vi-VN',
                { style: 'currency', currency: 'VND' }) }}</div>
        </div>
    </div>
</template>
<script>

import axios from 'axios'
import { useDataStore } from '@/stores/dataStores'
import orderService from "../services/orders.service"
import BooksService from '@/services/books.service'

export default {
    data: () => {
        return {
            id: "",
            orderDetail: {},
            book: useDataStore().getBooks,
            isDisable: false,
            ImgaeArray: [],
            linkImage: "",
            show: true,
            dialog: false,
            orderList: null,
            load: false,
            discount: 0 - 0,
        }
    },
    mounted() {
        this.loadOrderData()
    },
    methods: {
        openDialog() {
            this.dialog = true;
        },

        calc(price, quantity) {
            return price * quantity
        },
        showDate(data) {
            var date = new Date(data)
            var dateString = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '-');
            var yearString = date.toLocaleDateString('en-GB', { year: 'numeric' });

            if (yearString == '1970')
                this.show = false

            return dateString
        },
        showTime(data) {
            var time = new Date(data)
            const formatter = new Intl.DateTimeFormat('vi-VN', {
                hour: 'numeric',
                minute: 'numeric',

            }); // Định dạng thời gian thành dạng "12:34:56 PM"

            return formatter.format(time); // Lấy thời gian đã được định dạng
        },

        getImageArray(id) {

            this.ImgaeArray = useDataStore().getImages.filter(image => image._idBook === id);
            this.linkImage = this.ImgaeArray.filter(image => image._idBook === id)[0].linkImage;

            return this.linkImage

        },
        async loadOrderData() {
            if (useDataStore().getOrderList == "") {
                this.orderList = await orderService.getAll();
                useDataStore().getAPIOrder(this.orderList);
                console.log("phai axios")
            }
            this.orderDetail = useDataStore().getOrderList
            console.log("get ok")
            this.load = true
            console.log(this.orderList)


        },
        findBookNameById(id) {

            this.book = useDataStore().getBooks
            //console.log(this.book)
            const foundBook = this.book.find(item => item._id === id);
            //  console.log(foundBook)
            if (foundBook) {
                return foundBook.bookName;
            }
            return "Book not found";
        },
        async cancelOrder() {
            await orderService.update(this.orderDetail[0]._id, { orderStatus: "Đã hủy" })

            for (let i = 0; i <= this.orderDetail[0].productList.length - 1; i++) {
                let quantity = this.orderDetail[0].productList[i].quantity //so luong cua 1 loai sach trong don hang
                let _idBook = this.orderDetail[0].productList[i]._idBook
                let bookStock = this.book.find(book => book._id == _idBook).bookStock //so luong kho cua sach theo id sach ben tren
                let undoStock = bookStock + quantity    // khoi phuc so luong 
                await BooksService.update(_idBook, { bookStock: undoStock })
                console.log(undoStock)

            }
            this.load = false
            this.orderList = await orderService.getAll();
            useDataStore().getAPIOrder(this.orderList);
            this.orderDetail = useDataStore().getOrderList
            this.load = true
            // this.$router.push({ name: "order" })
        },
        cancelButtonOrder(data) {
            if (data == "Chờ xác nhận")
                return false
            else
                return true
        },
        findOriginalPrice(data) {
            const foundBook = this.book.find(item => item._id === data);
            //  console.log(foundBook)
            if (foundBook) {
                return foundBook.originalPrice
            }
            return "Book not found";
        },
        calcDisconnt(price, originalPrice, quantity) {
            this.discount = (originalPrice - price) * quantity + this.discount
            return this.discount
        }


    },

    computed: {
        getIdOrder() {
            this.id = this.$route.params.id
            this.orderDetail = useDataStore().getOrderList.filter(items => items._id == this.id)
            return this.id
        }
    }
}
</script>