<template>
    <div class="container my-4">
        <div class="row rounded-2" style="background-color: #ffffff;">
            <!-- Nội dung bên trái: Thông tin khách hàng và địa chỉ giao hàng -->
            <div class="col col-sm-6 py-4">
                <!-- Thanh điều hướng  -->
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <!-- Thanh điều hướng nhỏ  -->
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <small>
                                        <router-link class="nav-link" to="/Cart">Giỏ hàng</router-link>
                                    </small>
                                </li>
                                <li class="nav-item">
                                    <small>
                                        <router-link class="nav-link disabled user-select-none" to="">></router-link>
                                    </small>
                                </li>
                                <li class="nav-item">
                                    <small>
                                        <router-link class="nav-link" to="/Inform">Thông tin vận chuyển - Đặt
                                            hàng</router-link>
                                    </small>
                                </li>
                                <li class="nav-item">
                                    <small>
                                        <router-link class="nav-link disabled user-select-none" to="">></router-link>
                                    </small>
                                </li>
                                <li class="nav-item">
                                    <small>
                                        <router-link class="nav-link active" to="/Inform">Thanh toán đơn hàng</router-link>
                                    </small>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <!-- Tiêu đề -->
                <div class="container">
                    <div class="p-2 fs-5">
                        Chọn phương thức thanh toán
                    </div>
                </div>
                <!-- Thẻ, chứa thông tin người dùng (Tên, email, nút đăng xuất), nếu người dùng chưa đăng nhập sẽ không hiển thị -->
                <div v-if="name !== null" class="container">
                    <ul class="list-group px-2">
                        <li class="list-group-item fw-bolder">
                            <div><router-link class="me-2 fa-solid fa-user pe-2" to="#"></router-link>{{ name }}
                                <!-- <a href="#" class="text-decoration-none mx-2 text-danger">Đăng xuất</a> -->
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- Input thông tin người dùng -->
                <div class="container">
                    <div class="px-2">

                        <!-- Chọn phương thức thanh toán -->
                        <div class="form-group form-floating my-4">
                            <select required class="form-select" aria-label="" v-model="order.payment">
                                <option selected value="null">Chọn phương thức thanh toán</option>
                                <option value="Thanh toán khi nhận hàng">Thanh toán khi nhận hàng</option>
                                <option value="Chuyển khoản">Chuyển khoản</option>
                            </select>
                            <label class="fs-6" for="payment">Phương thức thanh toán</label>
                            <PayPalVue :item="dropItem" class="mt-4" v-if="order.payment === 'Chuyển khoản'" />
                        </div>

                        <!-- Nút Giỏ hàng và Chọn phương thức thanh toán -->
                        <div class="d-flex justify-content-end mt-4">
                            <button @click="submitOrder" class="btn btn-primary"
                                v-if="order.payment === 'Thanh toán khi nhận hàng'">Đặt
                                hàng</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nội dung bên phải: Thông tin thông tin sản phẩm, giảm giá -->
            <div class="col col-sm-6 border-start py-4">

                <!-- Danh sách sản phẩm - sách  -->
                <div v-for="item in BookInCart" :key="item._id" class="container">
                    <PayCardsVue :Book="item" :Cart="Cart" />
                </div>

                <!-- Tạm tính, Phi Ship -->
                <div v-if="Cart.length !== 0" class="container px-5">
                    <div class="d-flex justify-content-between py-2">
                        <small class="text-muted">Tính tạm</small>
                        <small v-bind="order.totalProductMoney" class="">{{ (tempCost).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }) }}</small>
                    </div>

                    <!-- Phí Ship  -->
                    <div class="d-flex justify-content-between">
                        <small class="text-muted">Phí Ship</small>
                        <small v-if="tempCost < 500000" class="" v-bind="order.orderTotal">{{
                            (shipFee).toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }) }}</small>
                        <small v-else class="" v-bind="order.orderTotal">{{
                            (0).toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }) }}</small>
                    </div>

                </div>
                <div class="container px-5 text-danger py-4 fw-bold" v-else>
                    Không có Sản phẩm nào trong Giỏ hàng
                </div>
                <!-- Tổng tiền -->
                <div v-if="Cart.length !== 0" class="container px-5">
                    <hr />
                    <div class="d-flex justify-content-between">
                        <div class="text-muted fs-6">Tổng tiền</div>
                        <div class="fw-bolder">{{ (getOrderTotal).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }) }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AddressVue from '../components/Address.vue';
import PayCardsVue from '../components/PayCards.vue';
import PayPalVue from '../components/PayPal.vue';
import { useDataStore } from '../stores/dataStores';
import BooksService from '@/services/books.service';
import ShipFeeService from '@/services/shipFee.service';
import AddressesService from '@/services/addresses.service';
import OrdersService from '@/services/orders.service';
import axios from 'axios';
import { toast } from 'vue3-toastify';
export default {
    components: {
        AddressVue,
        PayCardsVue,
        PayPalVue,
    },
    data() {

        // Đinh nghĩa thông báo nổi 
        const notifyOrderComplete = () => { // Đặt hàng thành công
            toast("Đã Đặt Hàng Thành Công", {
                autoClose: 3000,
                limit: 1,
                type: toast.TYPE.SUCCESS,
                multiple: false,
                hideProgressBar: true
            });
            this.notify = function () {
                return 0;
            };
        };

        return {
            ImageArray: [],
            name: localStorage.getItem('name'), // Tên user, nếu người dùng có đăng nhập 
            shipFee: this.getShipFee(),
            tempCost: 0,
            bookList: [],
            BookInCart: [], // Lưu những book có trong giỏ hàng 
            Cart: [], // Lưu số lượng, id sách được đặt hàng
            addressList: [],
            addressDefault: {},
            addressuser: -1, // index của addressList
            addressEmit: {},

            // order: {
            //     type: Object,
            //     required: true,
            //     reDate: new Date(0),
            //     orderDate: new Date(),
            //     orderStatus: 'Chờ xác nhận',
            //     userId: localStorage.getItem('_id'),
            //     payment: null
            // },
            order: {},

            addressIndex: -1,
            // Giá trị drop vào component AddressVue
            indexCity: undefined,
            indexDistrict: undefined,
            indexWard: undefined,
            addressAxios: Object,
            notifyOrderComplete: notifyOrderComplete,
            dropItem: undefined,
        }
    },

    computed: {
        // Tổng giá trị đơn hàng
        getOrderTotal() {
            // Nếu Tổng giá trị sản phẩm >= 500000 thì miễn phí ship 
            if (this.tempCost >= 500000)
                return this.tempCost;
            else
                return this.shipFee + this.tempCost;
        }
    },
    methods: {
        // Điền thông tin vào name, phone, reAddress
        addressSelect() {
            // Xoá dữ liệu nếu select "Chọn địa chỉ"
            if (this.addressIndex === -1) {
                this.order.userName = '';
                this.order.phone = '';
                this.order.reAddress = '';
            } else {
                this.order.userName = this.addressList[this.addressIndex].name;
                this.order.phone = this.addressList[this.addressIndex].phone;
                // Lưu địa chỉ tạm
                let tempAddress = this.addressList[this.addressIndex];
                this.order.reAddress = `${tempAddress?.streetName}, ${tempAddress.ward}, ${tempAddress.district}, ${tempAddress.city}`
                console.log(this.addressEmit);
                // Tìm giá trị indexCity, indexDistrict,... để đồng bộ với component AddressVue
                if (tempAddress.city) {
                    for (let x = 0; x < this.addressAxios.length; x++) {
                        // console.log(this.addressAxios[i]);
                        // Tìm indexCity dựa theo tên city 
                        if (tempAddress.city === this.addressAxios[x].Name) {
                            this.indexCity = x;
                            console.log(this.addressAxios[x].Name);
                            if (tempAddress.district) {
                                for (let y = 0; y < this.addressAxios[x].Districts.length; y++) {
                                    // Tìm indexCity dựa theo tên district
                                    if (tempAddress.district === this.addressAxios[x].Districts[y].Name) {
                                        this.indexDistrict = y;
                                        console.log(this.addressAxios[x].Districts[y].Name);
                                        if (tempAddress.ward) {
                                            for (let z = 0; z < this.addressAxios[x].Districts[y].Wards.length; z++) {
                                                // Tìm indexCity dựa theo tên ward
                                                if (tempAddress.ward === this.addressAxios[x].Districts[y].Wards[z].Name) {
                                                    this.indexWard = z;
                                                    console.log(this.addressAxios[x].Districts[y].Wards[z].Name);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this.addressEmit.ward) {
                this.order.reAddress = `${this.addressEmit.ward}, ${this.addressEmit.district}, ${this.addressEmit.city}`;
                this.addressEmit = Object;
            }
        },
        // Tổng giá trị đơn hàng 
        orderTotal(tempCost, shipFee) {
            if (tempCost >= 500000)
                return tempCost;
            else
                return tempCost + shipFee;
        },

        // Lấy địa chỉ của người dùng nếu có đăng nhập 
        async getAddressList() {
            // Lấy dữ liệu để đồng Bộ
            await axios
                .get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
                .then((response) => {
                    this.addressAxios = response.data
                    console.log(this.addressAxios)
                })
            // Lấy địa chỉ của người dùng 
            let addressList = await AddressesService.getAll();
            addressList = addressList.filter(address => address._idUser === localStorage.getItem('_id'))
            this.addressList = addressList;
            return addressList;
        },

        // Lấy shipFee 
        async getShipFee() {
            try {
                let temp = await ShipFeeService.getAll();
                this.shipFee = temp[0].shipFee;
                console.log('shipFee ' + this.shipFee)
                // this.order.shipFee = this.shipFee
                return this.shipFee
            }
            catch (error) {
                console.log(error);
            }
        },

        // Lấy sách có trong giỏ hàng
        async retrieveBookOnCart() {
            try {
                // Lấy tất cả sách từ store, để lấy giá khuyến mãi 
                this.bookList = useDataStore().getBooks
                // Lọc những sách có bookPrice, originalPrice và author
                this.bookList = this.bookList.filter(itemBook => (itemBook.bookPrice && itemBook.originalPrice && itemBook.author))
                console.log('useData');
                console.log(this.bookList);
                console.log(this.Cart);
                // Lấy sách trong có trong giỏ hàng 
                this.order.productList = []
                for (let i = 0; i < this.Cart.length; i++) {
                    let temp = this.bookList.find(Book => Book._id === this.Cart[i].idBook);
                    let tempProduct = {}
                    if (temp) {
                        // Tạo đối tượng để thêm sản phẩm vào productList 
                        tempProduct = {
                            _idBook: temp._id,
                            quantity: parseInt(this.Cart[i].quantityBook, 10),
                            price: temp.bookPrice,
                        }
                        this.order.productList.push(tempProduct)
                        this.BookInCart.push(temp)
                    }
                }
                // console.log('BookList in cart');
                // console.log(this.BookInCart);
                let quantity
                // Tính tạm giá trị các Book trong Cart, chưa tính shipFee 
                for (let i = 0; i < this.BookInCart.length; i++) {
                    quantity = this.Cart.find(item => item.idBook === this.BookInCart[i]._id).quantityBook
                    console.log(quantity);
                    this.tempCost = this.tempCost + (this.BookInCart[i].bookPrice * parseInt(quantity, 10))
                    // console.log(this.BookInCart[i].bookPrice);
                }
                // console.log(this.tempCost);
                this.order.totalProductMoney = this.tempCost
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
                        console.log('Cart on cookies');
                        console.log(this.Cart)
                        // Lấy sách 
                        this.retrieveBookOnCart();
                        return response.data
                    })
            } catch (error) {
                console.log(error);
            }
        },

        // submit order
        async submitOrder() {
            try {
                // Nếu không có sách trong giỏ hàng thì không được đặt hàng
                if (this.BookInCart.length === 0) {
                    // alert('Không có sản phẩm nào trong giỏ');
                    this.notifyOrderEmpty()
                    return 0;
                }
                this.order.orderTotal = this.orderTotal(this.tempCost, this.shipFee);
                console.log(this.order);
                let total = await OrdersService.create(this.order)
                if (total === undefined)
                    alert('Tạo đơn hàng không thành công');
                else {
                    // Kiểm tra order
                    console.log(total);
                    // Cập nhật bookStock cho book
                    let book = Object
                    let quantityBook
                    for (let i = 0; i < this.BookInCart.length; i++) {
                        quantityBook = this.Cart.find(book => book.idBook === this.BookInCart[i]._id).quantityBook
                        let book = await BooksService.get(this.BookInCart[i]._id);
                        // console.log(quantityBook);
                        book = {
                            bookStock: (parseInt(book.bookStock, 10) - parseInt(quantityBook, 10))
                        }
                        await BooksService.update(this.BookInCart[i]._id, book)
                        // Thông báo đặt hàng thành công
                        this.notifyOrderComplete()
                    }
                    // Destroy cookies giỏ hàng - cart sau khi đặt hàng thành công
                    this.deleteCart();
                    // Chuyển hướng đến trang ...
                    // this.$router.push('/Inform');
                    // window.location.href = "/Inform"; // Do không có đủ thời gian nên tạm sử dụng load trang

                    setTimeout(() => {
                        // this.$router.push('/Inform');
                        window.location.href = "http://localhost:3001/Inform";
                    }, "2000");
                }
            }
            catch (error) {
                console.log(error);
            }
        },

        // Xoá cookie giỏ hàng 
        async deleteCart() {
            try {
                axios
                    .get(`http://localhost:3000/cookies/clear`, {
                        withCredentials: true
                    })
                    .then((response) => {
                        console.log(response.data)
                    })
            } catch (error) {
                console.log(error);
            }
        },
    },

    created() {
        this.order = useDataStore().getOrder;
        // Nếu chưa có đơn hàng trong store, trở về trang inform
        if (useDataStore().getOrderTotal === 0) {
            // this.$router.push('/Inform');
            window.location.href = "http://localhost:3001/Inform";

        }
        this.name = localStorage.getItem('name');
        this.Cart = this.getCartOnCookie();
        this.retrieveBookOnCart();
        this.getAddressList();
    }
}
</script>