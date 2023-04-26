<template>
    <div class="container my-4">
        <!-- Carousel - Hiển thị những sản phẩm đặt biệt hoặc một chương trình giảm giá... need-fix -->
        <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="0" class="active"
                    aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="1"
                    aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="2"
                    aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner rounded-2 shadow-lg">
                <div class="carousel-item active" data-bs-interval="3000">
                    <img src="https://theme.hstatic.net/200000343865/1000938429/14/ms_banner_img4.jpg?v=335"
                        class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item" data-bs-interval="2000">
                    <img src="https://theme.hstatic.net/200000343865/1000938429/14/ms_banner_img5.jpg?v=421"
                        class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item" data-bs-interval="2000">
                    <img src="https://theme.hstatic.net/200000343865/1000938429/14/ms_banner_img2.jpg?v=421"
                        class="d-block w-100" alt="...">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon btn btn-danger" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval"
                data-bs-slide="next">
                <span class="carousel-control-next-icon btn btn-danger" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>

        <!-- Các thành phần - nội dung chính trong trang   -->
        <div id="content">
            <div class="p-2 fs-5 text-center">
                <a href="#sale-product" class="text-decoration-none px-2 btn">Khuyến mãi</a>
                <a href="#new-product" class="text-decoration-none px-2 btn">Sản phẩm mới</a>
                <a href="#product" class="text-decoration-none px-2 btn">Sản Phẩm</a>
            </div>
        </div>

        <!-- Sale  -->
        <div id="sale-product" class="">
            <div class="p-2 fs-5 rounded-2 text-center" style="background-color: #e55e5e;">
                <div class="text-white text-decoration-none fw-bold">Sản Phẩm khuyến mãi</div>
            </div>
            <div class="px-0 py-2" v-if="SaleBooks">
                <v-row class="p-0 m-0" :equal="{ sm: true, md: false }">
                    <keep-alive>
                        <v-col v-for="item in SaleBooks" :key="item._id" class="d-flex align-center justify-center">
                            <Cards :book="item" />
                        </v-col>
                    </keep-alive>
                </v-row>
            </div>
        </div>

        <!-- New  -->
        <div id="new-product" class="">
            <div class="p-2 fs-5 rounded-2 text-center" style="background-color:  #e3fcf7;">
                <div class="text-decoration-none fw-bold" style="color: #162f28;">Sản phẩm mới</div>
            </div>
            <div class="px-0 py-2" v-if="NewBooks">
                <v-row class="m-0 p-0" :equal="{ sm: true, md: false }">
                    <keep-alive>
                        <v-col v-for="item in NewBooks" :key="item._id" class="d-flex align-center justify-center">
                            <Cards :book="item" />
                        </v-col>
                    </keep-alive>
                </v-row>
            </div>
        </div>

        <!-- Sản phẩm -->
        <div id="product" class="">
            <div class="p-2 fs-5 rounded-2 text-center" style="background-color:  #55a1e7;">
                <div class="text-white text-decoration-none fw-bold">Sản Phẩm</div>
            </div>
            <div class="px-0 py-2" v-if="Books">
                <v-row class="p-0 m-0" :equal="{ sm: true, md: false }">
                    <keep-alive>
                        <v-col v-for="item in Books" :key="item._id" class="d-flex align-center justify-center">
                            <Cards :book="item" />
                        </v-col>
                    </keep-alive>
                </v-row>
            </div>
        </div>
    </div>
</template>

<script>
import Cards from '../components/Cards.vue';
import PromotionsService from '@/services/promotions.service';
import moment from 'moment';
import { useDataStore } from '../stores/dataStores';
export default {
    components: {
        Cards
    },

    data() {
        return {
            SaleBooks: [],
            NewBooks: [],
            Books: useDataStore().getBooks.filter(itemBook => itemBook.author !== undefined),
            Images: useDataStore().getImages,
            loaded: false,
            geneList: useDataStore().getGenes,
        }
    },

    methods: {
        async checkPromotion() {
            var proList = await PromotionsService.getAll()
            console.log(proList[0].productList.length);
            for (let tempj = 0; tempj < proList.length; tempj++) {

                for (let tempi = 0; tempi < proList[tempj].productList.length; tempi++) {
                    let book = this.Books.find(item => item._id === proList[tempj].productList[tempi])
                    console.log(book); console.log(book.bookPrice);
                    this.SaleBooks = useDataStore().getBooks.filter(itemBook => ((itemBook.author !== undefined) && (itemBook.bookPrice < itemBook.originalPrice)));

                    if (book && book.bookPrice === book.originalPrice) {

                        var waitingList = []
                        for (var i of proList) {
                            const now = new Date();
                            if (now > new Date(i.promotionEnd)) {
                                console.log("Đã kết thúc")
                            }
                            else if (now < new Date(i.promotionBegin)) {
                                console.log("Yet")
                                const promotionBegin = moment(i.promotionBegin)
                                var duration = moment.duration(promotionBegin.diff(now)).asMinutes();
                                if (duration < 30) {
                                    waitingList.push(i)
                                }
                                console.log(duration)
                            }
                            else {
                                for (var id of i.productList) {
                                    useDataStore().updateProBook(id, i.promotionPrice, i.promotionEnd)
                                    console.log(id)
                                    console.log(this.Books.filter(i => i._id === id))
                                }
                            }
                        }
                        // console.log(waitingList)
                        if (waitingList.length > 0) {
                            var waiting = setInterval(() => {
                                // console.log(waitingList)
                                for (var i of waitingList) {
                                    const now = moment();
                                    if (now >= new Date(i.promotionBegin) && now <= new Date(i.promotionEnd)) {
                                        for (var id of i.productList) {
                                            useDataStore().updateProBook(id, i.promotionPrice, i.promotionEnd)
                                        }
                                        waitingList = waitingList.filter(item => item._id !== i._id)
                                    }
                                    if (waitingList.length === 0) {
                                        clearInterval(waiting)
                                    }
                                }
                            }, 1000)
                        }
                        this.SaleBooks = useDataStore().getBooks.filter(itemBook => ((itemBook.author !== undefined) && (itemBook.bookPrice < itemBook.originalPrice)));
                    }
                    else {
                        return
                    }
                }
            }
        }
    },

    created() {
        this.checkPromotion();
        // this.SaleBooks = this.Books.filter(itemBook => ((itemBook.author !== undefined) && (itemBook.bookPrice < itemBook.originalPrice))); // Sao chép cạn trong js 
        this.NewBooks = this.Books.filter(itemBook => ((itemBook.author !== undefined) && ((Date.now() - Date.parse(itemBook.receiptDate)) <= 1000 * 60 * 60 * 24 * 30)));
    }
}
</script>
<style>
#content a:hover {
    color: #0169c2;
    background-color: #d7e8fd;
    border: 1px solid #d7e8fd;
    border-radius: 4x;
}

#content a {
    color: #4e4e4e;
    border-radius: 4px;
}
</style>