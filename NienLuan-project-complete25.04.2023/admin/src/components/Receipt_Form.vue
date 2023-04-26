<template>
    <div class="container border">

        <v-form @submit.prevent class="row" style="padding: 10px;">
            <div class="col-sm-6">
                <v-text-field type="date" v-model="dateReceipt" :rules="rules" label="Nhập ngày"
                    variant="solo"></v-text-field>
            </div>
            <div class="col-sm-6 " style="display: flex;align-items: stretch;">
                <div style="width: 100%;">
                    <v-select label="Chọn nhà cung cấp" variant="solo" v-model="supplierName" :rules="rules"
                        v-bind:items="supplierList"></v-select>
                </div>
                <v-dialog transition="dialog-top-transition" width="60%">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" style="width: 0; height: 70%;;font-size: larger;font-weight: 600;"
                            v-bind="props"><i class="fas fa-solid fa-user-plus"></i></v-btn>
                    </template>
                    <template v-slot:default="{ isActive }">
                        <v-card>
                            <v-toolbar color="primary" title="Thêm nhà cung cấp mới"></v-toolbar>
                            <v-form @submit.prevent>
                                <v-card-text>
                                    <div style="display: flex;align-items: center;">
                                        <!-- <div style="font-size: xx-large; margin-right: 20px;"><i
                                                class="fa-solid fa-user-tie"></i></div> -->
                                        <v-text-field ref="nameSupplier" :rules="rules" label="Tên nhà cung cấp"
                                            prepend-icon="fa:fas fa-solid fa-user-tie"></v-text-field>
                                    </div>

                                    <div style="display: flex;align-items: center;">
                                        <!-- <div style="font-size: xx-large; margin-right: 20px;"><i
                                                class="fas fa-solid fa-location-dot"></i></div> -->
                                        <!-- <v-text-field ref="addressSupplier" :rules="rules"
                                            label="Địa chỉ nhà cung cấp"></v-text-field> -->
                                        <v-text-field label="Địa chỉ nhà cung cấp" ref="addressSupplier" :rules="rules"
                                            prepend-icon="fa:fas fa-solid fa-location-dot"></v-text-field>
                                    </div>

                                    <div style="display: flex;align-items: center;">
                                        <!-- <div style="font-size: xx-large; margin-right: 11px;"><i
                                                class="fas fa-solid fa-phone"></i></div> -->
                                        <v-text-field type="number" ref="phone" :rules="rules0"
                                            label="Số liên lạc nhà cung cấp"
                                            prepend-icon="fa:fas fa-solid fa-phone"></v-text-field>
                                    </div>
                                </v-card-text>
                                <v-card-actions class="justify-end">
                                    <v-btn variant="text" @click="isActive.value = false">Đóng</v-btn>
                                    <v-btn variant="text" type="submit" @click="addSupplier">Lưu</v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </template>
                </v-dialog>
            </div>
            <h6>Thêm sản phẩm vào phiếu nhập hàng</h6>
            <div style="padding: 10px; margin: 0 auto; " class="border  rounded ">
                <v-form @submit.prevent="addItem" class="row" style="padding: 10px;">
                    <div class="col-sm-6">
                        <v-text-field list="datalistOptions" variant="solo" ref="nameBook" :rules="rules"
                            label="Tên sản phẩm" v-model="nameBook" @change=""></v-text-field>
                        <datalist id="datalistOptions">
                            <option v-for="item in bookList" :key="item.id" :value="item.bookName">{{ item.bookName }}
                            </option>
                        </datalist>
                    </div>
                    <div class="col-sm-4 row">
                        <div class="col-sm-2" style="width: 50%;">
                            <v-text-field variant="solo" type="number" v-model="number" :rules="rules1"
                                label="Số lượng"></v-text-field>
                        </div>
                        <div class="col-sm-2" style="width: 50%;">
                            <v-text-field variant="solo" type="number" style="margin-bottom: -23px;" :rules="rules2"
                                v-model="price" label="Giá nhập"></v-text-field>
                            <span v-if="price">{{ parseInt(price).toLocaleString('vi-VN', {
                                style: 'currency', currency:
                                    'VND'
                            })
                            }}</span>
                        </div>
                    </div>

                    <v-btn type="submit" class="mt-2" color="primary" style="width: fit-content; margin: 0 auto;">Thêm <i
                            class="fas fa-solid fa-plus"></i></v-btn>
                </v-form>
            </div>
            <v-table fixed-header height="300px">
                <thead class="table-active">
                    <tr>
                        <th>STT</th>
                        <th>Tên sách</th>
                        <th>Số lượng</th>
                        <th>Giá nhập (&#8363;)</th>
                        <th>Thành tiền (&#8363;)</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="( item, index) in list" :key="index">
                        <th style="width: 0;">{{ index + 1 }}</th>
                        <th>{{ item.name }}</th>
                        <th>{{ item.number }}</th>
                        <th>{{ item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</th>
                        <th>{{ item.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</th>
                        <th style="width: 0;"><span type="button" @click="popList(item)" class="badge bg-danger">X</span>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="2">Tổng cộng</th>
                        <th colspan="4">
                            <div class="row">
                                <p class="col-6 " style="color: green;">Số lượng hàng nhập: {{ totalNumber }}</p>
                                <p class="col-6" style="color: green;">Tiền hàng: {{ totalPrice.toLocaleString('vi-VN',
                                    { style: 'currency', currency: 'VND' }) }}</p>
                            </div>
                            <div class="row">
                                <p class="col" style="color: blue;">Thanh toán: {{ payment.toLocaleString('vi-VN',
                                    { style: 'currency', currency: 'VND' }) }}
                                    <v-text-field type="number" v-model="payment" @change="payments"></v-text-field>
                                </p>
                                <p class="col" style="color: red;">Còn nợ: {{ owe.toLocaleString('vi-VN', {
                                    style:
                                        'currency', currency: 'VND'
                                }) }}</p>
                            </div>
                        </th>
                    </tr>
                </tbody>
            </v-table>
            <!-- <hr style="margin: 5px;" /> -->
            <v-btn @click="saveForm" block type="submit" class="mt-2" color="primary"
                style="width: fit-content; margin: 0 auto;font-size: larger;font-weight: 600;">Lưu</v-btn>
        </v-form>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { useDataStore } from '../stores/dataStores';
import ReceiptsService from '../services/receipts.service';
import SuppliersService from '../services/suppliers.service';
import BooksService from '../services/books.service';
export default {
    props: {
        // info: { type: Object, require: true },
        flag: Number,
        info: String
    },
    data() {
        return {
            list: [],
            nameBook: "",
            bookList: [],
            receipt: Object,
            number: 0,
            supplier: Object,
            price: 0,
            dateReceipt: null,
            supplierName: '',
            totalNumber: 0,
            totalPrice: 0,
            payment: 0,
            owe: 0,
            supplierList: [],
            histry: [],
            rules: [
                value => {
                    if (value) return true
                    return 'Bạn chưa nhập giá trị.'
                },
            ],
            rules1: [
                value => {
                    if (value) {
                        if (value > 0)
                            return true
                        return 'Số lượng nhập ít nhất là 1.'
                    }
                    return 'Bạn chưa nhập giá trị.'
                },
            ],
            rules2: [
                value => {
                    if (value) {
                        if (value >= 1000)
                            return true
                        return 'Giá nhập ít nhất là 1000.'
                    }
                    return 'Bạn chưa nhập giá trị.'
                },
            ],
            rules0: [
                value => {
                    if (value?.length == 10) {
                        return true
                    }
                    else if (value?.length < 10 || value?.length > 10) {
                        return 'Bạn chưa nhập đủ 10 số.'
                    }
                    return 'Bạn chưa nhập giá trị.'
                },
            ],
        }
    },
    methods: {
        addItem() {
            if (this.nameBook !== '' && this.number !== 0 && this.price >= 1000) {
                var a = this.list.filter(i => i.name === this.nameBook)
                console.log(a)
                if (a.length === 0) {
                    var item = {
                        name: this.nameBook,
                        number: Number(this.number),
                        price: Number(this.price),
                        total: this.number * this.price
                    }
                    this.totalNumber = Number(this.totalNumber + item.number);
                    this.totalPrice = Number(this.totalPrice + item.total)
                    this.owe = Number(this.totalPrice - this.payment)
                    this.list.push(item)
                    this.nameBook = ''
                    this.number = 0
                    this.price = 0
                    console.log(this.histry)
                }
                else {
                    toast.error("Không thể thêm trùng sách", {
                        transition: toast.TRANSITIONS.SLIDE,
                    });
                }
            }
        },
        payments() {
            this.payment = Number(this.payment)
            this.owe = this.totalPrice - this.payment

        },
        popList(e) {
            console.log(e)
            this.totalNumber = Number(this.totalNumber - e.number);
            this.totalPrice = Number(this.totalPrice - e.total)
            this.owe = Number(this.totalPrice - this.payment)
            this.list = this.list.filter(item => item !== e)
            console.log(this.histry)

        },
        async saveForm() {
            if (this.list.length > 0 && this.dateReceipt !== null && this.supplierName !== '') {
                var data = {}
                data.listProduct = this.list
                data.owe = this.owe
                data.paid = this.payment
                data.totalMoneyReceipt = this.totalPrice
                data.totalNumber = this.totalNumber
                data.dateReceipt = this.dateReceipt
                data.supplierName = this.supplierName
                if (this.flag === 0) {
                    for (var i of this.list) {
                        var bookTest = this.bookList.filter(item => item.bookName === i.name)
                        if (bookTest.length > 0) {
                            this.updateBookStock(i, i.number)
                        }
                        else {
                            var bookNew = { bookName: i.name, bookStock: i.number, receiptPrice: i.price, supplisherName: this.supplierName, receiptDate: this.dateReceipt }
                            var addBook = await BooksService.create(bookNew)
                            console.log(addBook)
                            // console.log(this.dateReceipt)
                        }
                    }
                    var result
                    console.log(data);
                    if (data) {
                        result = await ReceiptsService.create(data)
                    }

                    if (result) {
                        toast.success("Thêm thành công!", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                        this.dateReceipt = null
                        this.supplierName = null
                        this.list = []
                        this.owe = Number(0)
                        this.totalNumber = Number(0)
                        this.totalPrice = Number(0)
                        this.payment = Number(0)
                    }
                    else {
                        toast.error("Thêm thất bại!", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                    }
                }
                else {
                    for (let j of this.list) {
                        var i = this.histry.filter(item => item.name === j.name)
                        console.log(i)
                        if (i.length > 0) {
                            var numberUpdate = j.number - i[0].number
                            console.log(numberUpdate)
                            this.updateBookStock(j, numberUpdate)
                            this.histry = this.histry.filter(item => item !== i[0])
                        }
                        else {
                            var bookTest = this.bookList.filter(item => item.bookName === j.name)
                            console.log(bookTest)
                            if (bookTest.length > 0) {
                                this.updateBookStock(j, j.number)
                            }
                            else {
                                var bookNew = { bookName: j.name, bookStock: j.number, receiptPrice: j.price, supplisherName: this.supplierName, receiptDate: this.dateReceipt }
                                var addBook = await BooksService.create(bookNew)
                                console.log(addBook)
                            }
                        }
                    }
                    console.log(this.histry)
                    for (var i of this.histry) {
                        this.updateBookStock(i, -(i.number))
                    }
                    var result = await ReceiptsService.update(this.info, data)
                    if (result) {
                        toast.success("Cập nhật thành công!", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                        this.histry = this.list.slice()

                    }
                    else {
                        toast.error("Cập nhật thất bại!", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                    }
                    console.log(result)
                }
                var data = await BooksService.getAll()
                useDataStore().updateBooks(data)
            }
            else {
                toast.error("Chưa thêm đủ giá trị!", {
                    transition: toast.TRANSITIONS.SLIDE,
                });
            }
        },
        async updateBookStock(i, number) {
            var bookTest = this.bookList.filter(item => item.bookName === i.name)
            // console.log(bookTest[0]._id)
            if (bookTest.length > 0) {
                var getBook = await BooksService.get(bookTest[0]._id)
                var updateBook = await BooksService.update(getBook._id, { bookStock: getBook.bookStock + number, receiptPrice: i.price, supplisherName: this.supplierName })
            }
        },
        async addSupplier() {
            if (this.$refs.nameSupplier.value !== '' && this.$refs.addressSupplier.value !== '' && this.$refs.phone.value?.length === 10) {
                var kq = await SuppliersService.create({ supplierName: this.$refs.nameSupplier.value, supplierAddress: this.$refs.addressSupplier.value, supplierPhone: this.$refs.phone.value })
                toast.success("Thêm thành công!", {
                    transition: toast.TRANSITIONS.SLIDE,
                });
                console.log(kq)
            }
        },
        async getData(id) {
            var data = await ReceiptsService.get(id)
            console.log(data)
            this.totalNumber = data.totalNumber
            this.totalPrice = data.totalMoneyReceipt
            this.list = data.listProduct
            this.owe = data.owe
            this.payment = data.paid
            this.dateReceipt = data.dateReceipt
            this.supplierName = data.supplierName
            this.histry = this.list.slice()
            console.log(this.histry)
        },
        async getSupplier_Books() {
            this.supplierList = await SuppliersService.getAll()
            this.supplierList = this.supplierList.map(supplier => supplier.supplierName)
            this.bookList = await BooksService.getAll()
            // console.log(this.bookList)
        }
    },
    computed: {

    },
    mounted() {
        // this.supplierList = useDataStore().getSupllierList.map(supplier => supplier.name)
        this.getSupplier_Books()
        if (this.flag === 1) {
            // this.totalNumber = this.info.totalNumber
            // this.totalPrice = this.info.totalMoneyReceipt
            // this.list = this.info.listProduct
            // this.owe = this.info.owe
            // this.payment = this.info.paid
            this.getData(this.info)

        }
        console.log(this.flag)

    }
}
</script>