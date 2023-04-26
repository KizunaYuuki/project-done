<template>
    <div class="container">
        <table class="table table-hover bg-white rounded-2 my-4">
            <thead class="user-select-none">
                <tr class="align-middle">
                    <th class="fs-4 fw-bold text-danger text-center" colspan="6">Giỏ hàng
                        <span class="fs-6">({{
                            BookInCart.length }} sản phẩm)</span>
                        <div v-if="BookInCart.length === 0" class="fs-5"><img
                                src="https://assets.materialup.com/uploads/66fb8bdf-29db-40a2-996b-60f3192ea7f0/preview.png">
                            <div class="text-muted p-2" style="font-size: 12px;">Chưa có sản phẩm trong giỏ hàng của bạn.
                            </div>
                            <div>
                                <router-link class="btn btn-danger" to="/">Mua sắm</router-link>
                            </div>
                        </div>
                    </th>
                </tr>
                <tr v-if="BookInCart.length !== 0" class="bg-light">
                    <th style="width: 50%;" colspan="2" scope="col" class="fw-bold">Sản phẩm</th>
                    <th class="text-center fw-bold" style="width: 15%;" scope="col">Đơn giá</th>
                    <th class="text-center fw-bold" style="width: 15%;" scope="col">Số lượng</th>
                    <th class="text-center fw-bold" style="width: 15%;" scope="col">Tổng</th>
                    <th class="text-center fw-bold" style="width: 5%;" scope="col"></th>
                </tr>
            </thead>
            <tbody v-if="BookInCart.length !== 0">
                <tr v-for="item in BookInCart" :key="item._id">
                    <CartCards :Book="item" :Cart="Cart" @updateCart="update" @updateQuantity="updateTempCost" />
                </tr>
                <!-- Thanh toán  -->
                <tr class="fs-6 text-danger border-white">
                    <td colspan="3"></td>
                    <td class="align-middle text-center fw-bold">Tính tạm</td>
                    <td class="align-middle text-center fw-bold">{{
                        (tempCost).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }) }}</td>
                    <td></td>
                </tr>
                <tr class="fs-6 fw-bold text-danger">
                    <td colspan="3"></td>
                    <td class="align-middle text-center"></td>
                    <td class="align-middle text-center">
                        <router-link to="/Inform" class="link-light btn btn-danger">Thanh toán</router-link>
                    </td>
                    <td colspan=""></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { useDataStore } from '../stores/dataStores';
import axios from 'axios';
import CartCards from '../components/CartCards.vue';
export default {
    components: {
        CartCards
    },
    data() {
        return {
            Cart: [],
            Books: [],
            BookInCart: [],
            tempCost: 0,
        }
    },
    methods: {
        updateTempCost() {
            this.getCartOnCookie();
        },
        async retrieveBookOnCookies() {
            try {
                // Lấy tất cả sách trên DataBase 
                this.Books = useDataStore().getBooks;

                // Lọc những sách có bookPrice, originalPrice và author
                this.Books = this.Books.filter(itemBook => (itemBook.bookPrice && itemBook.originalPrice && itemBook.author));

                // Lấy sách trong có trong giỏ hàng 
                console.log(this.Cart);

                this.BookInCart = []
                for (let i = 0; i < this.Cart.length; i++) {
                    let temp = this.Books.find(Book => Book._id === this.Cart[i].idBook);
                    if (temp) {
                        this.BookInCart.push(temp)
                        console.log(temp);
                    }
                }

                console.log('BookList in cart');
                console.log(this.BookInCart);
                let quantity
                // Tính tạm giá trị các Book trong Cart, chưa tính shipFee 
                this.tempCost = 0
                if (this.BookInCart.length !== 0) {
                    for (let i = 0; i < this.BookInCart.length; i++) {
                        quantity = this.Cart.find(item => item.idBook === this.BookInCart[i]._id).quantityBook
                        console.log(quantity);
                        this.tempCost = this.tempCost + (this.BookInCart[i].bookPrice * parseInt(quantity, 10))
                        // In giá trị tính tạm 
                        console.log('TempCost');
                        console.log(this.tempCost);
                    }
                }
                else {
                    this.tempCost = 0
                }

                console.log(this.tempCost);
            } catch (error) {
                console.log(error);
            }
        },
        // Lấy giỏ hàng trên cookies
        async getCartOnCookie() {
            try {
                await axios
                    .get(`http://localhost:3000/cookies/read`, {
                        withCredentials: true
                    })
                    .then((response) => {
                        this.Cart = response.data
                        console.log(this.Cart);
                        this.retrieveBookOnCookies();
                    })
            } catch (error) {
                console.log(error);
            }
        },
        // Update ui
        async update() {
            this.getCartOnCookie();
        }
    },
    created() {
        this.getCartOnCookie();
    }
}
</script>
