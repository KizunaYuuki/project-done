<template>
    <Form @submit="paymentClick" :validation-schema="orderSchema" class="container my-4">
        <div class="row rounded-2" style="background-color: #ffffff;">
            <!-- Nội dung bên trái: Thông tin khách hàng và địa chỉ giao hàng -->
            <div class="col col-sm-6">
                <!-- Thanh điều hướng  -->
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <div class="collapse navbar-collapse" id="navbarNav">
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
                                        <router-link class="nav-link active" to="/Inform">Thông tin vận chuyển - Đặt
                                            hàng</router-link>
                                    </small>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <!-- Tiêu đề -->
                <div class="container">
                    <div class="p-2 fs-5">
                        Thông tin đơn hàng
                    </div>
                </div>
                <!-- Thẻ, chứa thông tin người dùng (Tên, email, nút đăng xuất), nếu người dùng chưa đăng nhập sẽ không hiển thị -->
                <div v-if="name !== null" class="container mb-2">
                    <ul class="list-group px-2">
                        <li class="list-group-item fw-bolder">
                            <div><router-link to='#' class="me-2 fa-solid fa-user pe-2"></router-link>{{ name }}
                                <!-- <a href="#" class="text-decoration-none mx-2 text-danger">Đăng xuất</a> -->
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- Input thông tin người dùng -->
                <div class="container">
                    <div class="p-2">
                        <!-- Địa chỉ giao hàng, nếu đã đăng nhập -->
                        <div v-if="name !== null" class="form-group form-floating mb-4">
                            <select class="form-select" aria-label="" @change="addressSelect" v-model="addressIndex">
                                <option selected :value=-1>Chọn địa chỉ</option>
                                <option v-for="(address, index) in addressList" :value="index" :key="address._id">
                                    {{ address?.streetName }}, {{ address.ward }}, {{ address.district }}, {{ address.city
                                    }}</option>
                            </select>
                            <label class="fs-6" for="floatingInput">Địa chỉ</label>
                        </div>
                        <!-- Tên khách hàng -->
                        <div class="form-group form-floating mb-6">
                            <Field type="email" name="userName" class="form-control" placeholder="Họ tên"
                                v-model="order.userName" />
                            <label class="fs-6" for="useName">Họ tên</label>
                            <ErrorMessage name="userName" class="error-feedback" />
                        </div>
                        <!-- Số điện thoại  -->
                        <div class="form-group form-floating mb-6">
                            <Field type="text" name="phone" class="form-control" placeholder="Số điện thoại"
                                v-model="order.phone" />
                            <label class="fs-6" for="phone">Số điện thoại</label>
                            <ErrorMessage name="phone" class="error-feedback" />
                        </div>
                        <!-- Địa chỉ - input-->
                        <div class="form-group form-floating mb-6">
                            <Field type="text" name="reAddress" class="form-control" placeholder="Địa chỉ"
                                v-model="order.reAddress" />
                            <label class="fs-6" for="reAddress">Địa chỉ</label>
                            <ErrorMessage name="reAddress" class="error-feedback" />
                        </div>
                        <!-- Chọn Tỉnh, Quận, Huyện theo Select -->
                        <AddressVue class="my-4" :drop-index-city="indexCity" :drop-index-district="indexDistrict"
                            :drop-index-ward="indexWard" @addressEmit="(address) => {
                                addressEmit = address;
                                addressSelect();
                            }" />
                    </div>
                </div>
            </div>
            <!-- Nội dung bên phải: Thông tin thông tin sản phẩm, giảm giá -->
            <div class="col col-sm-6 border-start">
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

                <!-- Nút Giỏ hàng-->
                <div v-if="Cart.length !== 0" class="d-flex justify-content-end mt-4 px-5 py-4">
                    <button style="font-size: 14px;" @click="paymentClick" class="btn btn-primary">Thanh
                        toán</button>
                </div>
            </div>
        </div>
    </Form>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import AddressVue from '../components/Address.vue';
import PayCardsVue from '../components/PayCards.vue';
import PayPalVue from '../components/PayPal.vue';
import { useDataStore } from '../stores/dataStores';
import ShipFeeService from '@/services/shipFee.service';
import AddressesService from '@/services/addresses.service';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import * as yup from "yup";
export default {
    components: {
        AddressVue,
        PayCardsVue,
        PayPalVue,
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const orderSchema = yup.object().shape({
            userName: yup
                .string()
                .required('Họ tên bắt buộc phải có')
                .min(3, 'Họ tên phải có ít nhất 3 ký tự')
                .max(24, 'Họ tên chứa nhiều nhất 24 ký tự'),
            phone: yup
                .string()
                .max(10, 'Số điện thoại có 10 số')
                .min(10, 'Số điện thoại có 10 số')
                .required("Số điện thoại bắt buộc phải có")
                .matches(
                    // /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    /((0)+([0-9])+([0-9]{8})\b)/g,
                    "Số điện thoại không hợp lệ."
                ),
            reAddress: yup
                .string()
                .required("Địa chỉ người nhận bắt buộc phải có"),
        });
        // Đinh nghĩa thông báo nổi 
        const notifyOrderComplete = () => { // Đặt hàng thành công
            console.log(this.Cart);
            if (this.Cart.find(item => item.idBook === this.id)) {
                window.location.href = "/Cart";
            }
            toast("Đã Đặt Hàng Thành Công", {
                autoClose: 2000,
                limit: 1,
                type: toast.TYPE.SUCCESS,
                multiple: false,
                hideProgressBar: true
            });
            this.notify = function () {
                window.location.href = "/Cart";
                return 0;
            };
        };
        const notifyOrderEmpty = () => { // Không có sản phẩm trong đơn hàng
            console.log(this.Cart);
            if (this.Cart.find(item => item.idBook === this.id)) {
                window.location.href = "/Cart";
            }
            toast("Không có Sản phẩm nào trong Giỏ hàng, Click lần nữa để đến Trang Chủ", {
                autoClose: 2000,
                limit: 1,
                type: toast.TYPE.ERROR,
                multiple: false,
                hideProgressBar: true
            });
            this.notifyOrderEmpty = function () {
                window.location.href = "/";
                return 0;
            };
        };
        const notifyOrderInformError = () => { // Không có sản phẩm trong đơn hàng
            toast("Thiếu thông tin về đơn hàng", {
                autoClose: 3000,
                limit: 1,
                type: toast.TYPE.ERROR,
                multiple: false,
                hideProgressBar: true,
            });
        };

        return {
            orderSchema,
            ImageArray: [],
            name: localStorage, // Tên user, nếu người dùng có đăng nhập 
            shipFee: this.getShipFee(),
            tempCost: 0,
            bookList: [],
            BookInCart: [], // Lưu những book có trong giỏ hàng 
            Cart: [], // Lưu số lượng, id sách được đặt hàng
            addressList: [],
            addressDefault: {},
            addressuser: -1, // index của addressList
            addressEmit: {},

            order: {
                type: Object,
                required: true,
                reDate: new Date(0),
                orderDate: new Date(),
                orderStatus: 'Chờ xác nhận',
                userId: localStorage.getItem('_id'),
            },

            addressIndex: -1,
            // Giá trị drop vào component AddressVue
            indexCity: undefined,
            indexDistrict: undefined,
            indexWard: undefined,
            addressAxios: Object,
            notifyOrderComplete: notifyOrderComplete,
            notifyOrderEmpty: notifyOrderEmpty,
            notifyOrderInformError: notifyOrderInformError,
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
            if (tempCost >= 500000) {
                this.shipFee = 0
                return tempCost;
            }
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
                // lưu BookInCart vào store
                useDataStore().setBookInCart(this.BookInCart)
                console.log('BookList in cart');
                console.log(useDataStore().getBookInCart);

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
                        // Lưu Cart vào store 
                        useDataStore().setCart(this.Cart)
                        console.log(useDataStore().getCart);

                        // Lấy sách 
                        this.retrieveBookOnCart();
                        return response.data
                    })
            } catch (error) {
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

        async paymentClick() {
            try {
                // Nếu không có sách trong giỏ hàng thì không được đặt hàng
                if (this.BookInCart.length === 0) {
                    // alert('Không có sản phẩm nào trong giỏ');
                    this.notifyOrderEmpty()
                    return 0;
                }
                this.order.orderTotal = this.orderTotal(this.tempCost, this.shipFee);
                this.order.shipFee = this.shipFee
                // Kiểm tra số điện thoại
                if (this.order.phone) {
                    const paragraph = this.order.phone;
                    const regex = /((0)+([0-9])+([0-9]{8})\b)/g;
                    const found = paragraph.match(regex);

                    console.log(found);
                    if (found === null || this.order.phone.length > 10) {
                        return 0;
                    }
                }

                // Nếu thiều thông tin đơn hàng thì thông báo
                if (this.order.userName === undefined || this.order.phone === undefined || this.order.reAddress === undefined) {
                    this.notifyOrderInformError()
                    return 0;
                }

                // Lưu vào store
                useDataStore().setOrder(this.order);
                let order = useDataStore().getOrder
                if (order === undefined)
                    alert('Lỗi khi chuyển đến thanh toán');
                else {
                    // Lấy dữ liệu chuyển đổi USD/VND từ Google Finance
                    let USDToVND
                    await axios
                        .get(`http://localhost:3000/google-finance`, {
                            withCredentials: true
                        })
                        .then((response) => {
                            const data = response.data;
                            const exchangeRateRegex = /<div class="YMlKec fxKbKc">([\d.,]+)<\/div>/;
                            const exchangeRateMatch = data.match(exchangeRateRegex);
                            if (exchangeRateMatch) {
                                const exchangeRate = exchangeRateMatch[1];
                                USDToVND = parseFloat(exchangeRate, 10) * 1000;
                            }
                            // console.log(JSON.stringify(response.data));
                        })
                    console.log(USDToVND);
                    // Thêm sản phẩm vào dropitem để có thể thanh toán bằng PayPal
                    this.dropItem = []
                    let orderTotal = 0
                    for (let i = 0; i < this.order.productList.length; i++) {
                        let bookName = this.bookList.find(Book => Book._id === this.order.productList[i]._idBook).bookName;

                        this.dropItem.push({
                            name: bookName,
                            description: "",
                            quantity: (this.order.productList[i].quantity),
                            unit_amount: {
                                currency_code: "USD",
                                value: parseFloat(Number.parseFloat(this.order.productList[i].price / USDToVND).toFixed(2))
                            }
                        })
                        orderTotal = Number.parseFloat(parseFloat(orderTotal) + (parseFloat(this.dropItem[i].unit_amount.value) * this.order.productList[i].quantity)).toFixed(2)
                        console.log(orderTotal);
                    }

                    // Tính phí ship
                    let fee = (30000 / USDToVND);
                    console.log(fee);
                    if ((parseFloat(orderTotal) * USDToVND) < 500000) {
                        this.dropItem.push({
                            name: 'Phí Ship',
                            description: "30000VND",
                            quantity: 1,
                            unit_amount: {
                                currency_code: "USD",
                                value: parseFloat(Number.parseFloat(30000 / USDToVND).toFixed(2))
                            }
                        })
                        orderTotal = Number.parseFloat(parseFloat(orderTotal) + parseFloat(30000 / USDToVND)).toFixed(2)
                    }
                    else {
                        this.dropItem.push({
                            name: 'Phí Ship',
                            description: "Miễn phí",
                            quantity: 1,
                            unit_amount: {
                                currency_code: "USD",
                                value: 0
                            }
                        })
                    }

                    // Cập nhật dữ liệu đơn hàng vào store
                    useDataStore().setOrderTotal(Number.parseFloat(orderTotal).toFixed(2))
                    console.log(Number.parseFloat(orderTotal).toFixed(2));
                    useDataStore().setItemsPayPal(this.dropItem);
                    console.log(useDataStore().getItemsPayPal);
                    // Chuyển hướng đến trang Thanh toán
                    this.$router.push('/Pay');
                }
            }
            catch (error) {
                console.log(error);
            }
        },
    },

    created() {
        this.name = localStorage.getItem('name');
        this.Cart = this.getCartOnCookie();
        this.retrieveBookOnCart();
        this.getAddressList();
    }
}
</script>