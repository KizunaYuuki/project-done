<template>
    <div class="container ">
        <form class="row " @submit.prevent="saveForm">
            <div class="border col-sm-6">
                <h4 class="text-center" style="padding: 10px; color: blue;">Thông tin chương trình khuyến mãi</h4>
                <hr />
                <div class="row">
                    <div class="col-sm-6">
                        <label for="inputEmail4" class="form-label">Tên khuyến mãi</label>
                        <input type="text" class="form-control" v-model="namePromotion" id="inputEmail4" required>
                    </div>
                    <div class="col-sm-6">
                        <label for="inputEmail4" class="form-label">Giá trị khuyến mãi (%)</label>
                        <div class="input-group">
                            <input type="number" min="0" ref="inputPrice" v-model="pricePromotion" @change="changeNumber"
                                class="form-control" aria-label="Dollar amount (with dot and two decimal places)" required>
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                    <div class="col-sm-6 row" style="width: 100%; margin-bottom: 10px;">
                        <div class="col-sm-2" style="width: 50%;">
                            <label for="inputAddress" class="form-label">Thời gian bắt đầu</label>
                            <input type="datetime-local" v-model="dateBegin" @change="show" class="form-control"
                                id="inputAddress" required>
                        </div>
                        <div class="col-sm-2" style="width: 50%;">
                            <label for="inputAddress2" class="form-label">Thời gian kết thúc</label>
                            <input type="datetime-local" v-model="dateEnd" @change="show" class="form-control"
                                id="inputAddress2" required>
                        </div>
                    </div>
                    <div class="col-sm-12">
                        <div class="form-floating">
                            <textarea class="form-control" v-model="des" placeholder="Leave a comment here"
                                id="floatingTextarea2" style="height: 100px"></textarea>
                            <label for="floatingTextarea2">Mô tả khuyến mãi</label>
                        </div>
                    </div>
                    <div class="col-sm-12">
                        <h6 for="inputState" class="">Chọn sản phẩm theo tên</h6>
                        <div style="display: flex;">
                            <input class="form-control" list="datalistOptions" ref="nameBook" id="exampleDataList"
                                placeholder="Nhập tên sách">
                            <datalist id="datalistOptions">
                                <option v-for="item in books" :key="item._id" :value="item._id">{{ item.bookName }} | {{
                                    item.author
                                }}</option>
                            </datalist>
                            <button @click="pushBook" style="margin-left: 10px;" type="button" class="btn btn-primary"
                                data-bs-whatever="@getbootstrap"><i class="fas fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    <h6 for="inputState" class="">Chọn sản phẩm khuyến mãi theo thể loại</h6>
                    <div v-for="item in catalog_Api" :key="item._id" v-bind:value="item">
                        <input class="form-check-input" type="checkbox" :value="item.genreName" :id="item.genreName"
                            @change="pushAllList($event.target)">
                        <label class="form-check-label" for="flexCheckDefault">
                            {{ item.genreName }}
                        </label>
                        <div style="display: flex;flex-wrap: wrap;">
                            <div v-for="items in item.subGenre" :key="items" class="form-check" style="margin-left: 15px;">
                                <input class="form-check-input" type="checkbox" :id="items" :value="items"
                                    @change="pushList($event.target)">
                                <label class="form-check-label" for="flexCheckDefault">
                                    {{ items }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Danh sách Books -->
            <div class=" border  col-sm-6">
                <h4 class="text-center" style="padding: 10px; color: blue;">Danh sách các sản phẩm khuyến mãi</h4>
                <hr />
                <v-table fixed-header>
                    <thead class="table-active">
                        <tr>
                            <th>STT</th>
                            <th>Tên sách</th>
                            <th>Tác giả</th>
                            <th>Giá gốc (&#8363;)</th>
                            <th>Giá khuyến mãi (&#8363;)</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="( item, index) in bookList" :key="index">
                            <th>{{ index + 1 }}</th>
                            <th>{{ item.bookName }}</th>
                            <th>{{ item.author }}</th>
                            <th>{{ item.originalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}
                            </th>
                            <th>{{ calculate(item.originalPrice).toLocaleString('vi-VN', {
                                style: 'currency', currency:
                                    'VND'
                            })
                            }}
                            </th>
                            <th><span type="button" @click="popBookList(item)" class="badge bg-danger">X</span></th>
                        </tr>
                    </tbody>
                </v-table>
            </div>
            <!-- <hr style="margin: 5px;" /> -->
            <v-btn block type="submit" class="mt-2" color="primary"
                style="width: fit-content; margin: 0 auto;font-size: larger;font-weight: 600; padding: 10px;">Lưu</v-btn>
        </form>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { useDataStore } from '../stores/dataStores'
import PromotionsService from '../services/promotions.service'
export default {
    props: {
        info: Object,
        flag: Number
    },
    data() {
        return {
            dateBegin: null,
            dateEnd: null,
            pricePromotion: Number,
            valueNumber: Number,
            select_Catalog: {},
            namePromotion: '',
            des: '',
            bookList: [],
            selectList: [],
            selectGene: {},
            catalog_Api: useDataStore().getGenes,
            books: useDataStore().getBooks.filter(item => item.author !== undefined),
        }
    },
    methods: {
        show() {
            if (this.dateBegin < this.dateEnd)
                console.log(1)
            if (this.dateBegin > this.dateEnd)
                console.log(0)
            console.log(this.dateBegin)
            console.log(this.dateEnd)
        },
        pushList(e) {
            if (e.checked) {
                var selectBook = this.books.filter(item => item.genreName.includes(e.value))
                for (var i of selectBook) {
                    if (!this.bookList.includes(i)) {
                        this.bookList.push(i)
                        this.selectList.push(i._id)
                        console.log(this.selectList)
                    }
                }
            }
            else {
                var test = this.bookList.filter(item => item.genreName.includes(e.value))
                test.forEach(book => {
                    let flag = 0
                    for (var i of book.genreName) {
                        const checkbox = document.getElementById(i);
                        if (checkbox.checked) {
                            flag = 1
                        }
                        console.log(checkbox.checked)
                    };
                    if (flag == 0)
                        this.bookList = this.bookList.filter(item => item !== book)
                    this.selectList = this.selectList.filter(id => id !== book._id)
                })
            }
            // console.log(this.bookList)
            console.log(this.selectList)

        },
        pushAllList(e) {
            var subGene = this.catalog_Api.filter(item => item.genreName.includes(e.value))
            console.log(subGene)
            if (e.checked) {
                for (var i of subGene[0].subGenre) {
                    const checkbox = document.getElementById(i);
                    console.log(i)
                    checkbox.checked = true
                    this.pushList(checkbox)
                }
            }
            else {
                for (var i of subGene[0].subGenre) {
                    const checkbox = document.getElementById(i);
                    // console.log(i.name)
                    checkbox.checked = false
                    this.pushList(checkbox)
                }
            }
            // console.log(subGene)
        },
        pushBook() {
            if (this.$refs.nameBook.value === "") {
                toast.error("Bạn chưa nhập giá trị!", {
                    transition: toast.TRANSITIONS.SLIDE,
                });
            }
            else {
                var test = this.books.filter(item => item._id === this.$refs.nameBook.value)
                if (test.length == 0) {
                    toast.error("Sách " + this.$refs.nameBook.value + " không tồn tại!", {
                        transition: toast.TRANSITIONS.SLIDE,
                    });
                }
                else if (test.length > 0) {
                    for (var i of test) {
                        if (!this.bookList.includes(i)) {
                            this.bookList.push(i)
                            this.selectList.push(i._id)
                            // toast.success("Sách " + this.$refs.nameBook.value + " đã được thêm vào thành công!", {
                            //     transition: toast.TRANSITIONS.SLIDE,
                            // });
                        }
                    }
                }
            }
            // console.log(test)
            // console.log(this.bookList)
            console.log(this.selectList)
        },
        changeNumber() {
            this.valueNumber = this.pricePromotion / 100;
            console.log(this.valueNumber)
        },
        calculate(s) {
            var number = s * this.valueNumber;
            return s - number;
        },
        popBookList(e) {
            this.bookList = this.bookList.filter(item => item !== e)
            this.selectList = this.selectList.filter(id => id !== e._id)
        },
        async saveForm() {
            if (this.dateBegin >= this.dateEnd) {
                toast.error("Thời gian kết thúc phải lớn hơn thời gian bắt đầu", {
                    transition: toast.TRANSITIONS.SLIDE,
                });
            }
            else if (this.bookList.length == 0) {
                toast.error("Phải có ít nhất một sản phẩm khuyến mãi trong danh sách", {
                    transition: toast.TRANSITIONS.SLIDE,
                });
            }
            else {
                var promotion = new Object
                promotion.promotionName = this.namePromotion
                promotion.promotionPrice = this.pricePromotion
                promotion.promotionBegin = this.dateBegin
                promotion.promotionEnd = this.dateEnd
                promotion.promotionDes = this.des
                promotion.productList = this.selectList
                console.log(promotion)
                if (this.flag === 1) {
                    var update = await PromotionsService.update(this.info, promotion)
                    if (update) {
                        toast.success("Cập nhật chương trình khuyến mãi thành công", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                    }
                    else {
                        toast.error("Cập nhật thất bại", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                    }
                }
                else {
                    var kq = await PromotionsService.create(promotion)
                    if (kq) {
                        toast.success("Thêm chương trình khuyến mãi thành công", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                        this.namePromotion = ''
                        this.pricePromotion = null
                        this.dateBegin = null
                        this.dateEnd = null
                        this.des = ''
                        this.selectList = []
                        this.bookList = []
                    }
                    else {
                        toast.error("Thêm thất bại", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                    }
                }
            }
            var data = await PromotionsService.getAll()
            useDataStore().updatePromotions(data)
            console.log(this.bookList.length)
            console.log(this.selectList.length)
        }
    },
    mounted() {
        if (this.flag === 1) {
            var promotion = useDataStore().getPromotionList.filter(item => item._id === this.info)
            promotion = promotion[0]
            this.namePromotion = promotion.promotionName
            this.pricePromotion = promotion.promotionPrice
            this.changeNumber()
            this.dateBegin = promotion.promotionBegin
            this.dateEnd = promotion.promotionEnd
            this.des = promotion.promotionDes
            this.selectList = promotion.productList
            for (var i of this.selectList) {
                var book = useDataStore().getBooks.filter(book => book._id === i)
                this.bookList.push(book[0])
            }
            console.log(this.bookList)
        }
    }
}
</script>