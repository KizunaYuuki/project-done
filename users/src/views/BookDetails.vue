<template>
    <div class="container shadow-sm rounded-2 my-4" style="background-color: white;">
        <!-- Chi tiết sản phẩm  -->
        <div class="row">
            <!-- Hiển thị Images của Book  -->
            <div class="col" style="30%">
                <Carousel_Img :id="this.id" />
            </div>

            <!-- Force next columns to break to new line -->
            <div class="w-100 column-breaks"></div>

            <!-- Thông tin Book  -->
            <div class="col pt-2">
                <!-- Tên Book  -->
                <h4 class="fw-semibold">{{ Book.bookName }}</h4>
                <!-- Nhà Cung cấp và Xuất bản -->
                <div class="row gx-5">
                    <p class="col">
                        Nhà cung cấp:
                        <span class="text-decoration-none fw-bold link-primary" @click="searchByNameSupplisher">{{
                            Book.supplisherName
                        }}</span>
                    </p>
                    <p class="col">Nhà xuất bản: <strong>{{ Book.publisher }}</strong></p>
                </div>
                <!-- Tác giả  -->
                <div class="row gx-5">
                    <p class="col">Tác giả: <strong>{{ Book.author }}</strong></p>
                </div>
                <!-- Kích cỡ Book và số trang  -->
                <div class="row gx-5">
                    <p class="col">Kích cỡ: <strong>{{ Book.size }}</strong></p>
                    <p class="col">Số trang: <strong>{{ Book.quantityPage }}</strong></p>
                </div>
                <!-- Giá sách... -->
                <div style="display: flex; justify-content: start; align-items: center;">
                    <h3 class="text-danger fw-bold">{{ Book.bookPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }) }}</h3>
                    <h6 v-if="Book.bookPrice !== Book.originalPrice" class="text-decoration-line-through px-2 text-muted">
                        {{ Book.originalPrice }} &#8363;</h6>
                    <h6><span class="badge bg-danger">New</span></h6>
                </div>
                <!-- Số lượng Book trong kho  -->
                <div class="row gx-5">
                    <p>Số lượng sách còn lại: <strong>{{ Book.bookStock }}</strong><strong class="px-3 text-danger"
                            v-if="(Book.bookStock <= 10) && (Book.bookStock !== 0)"> Sắp hết
                            hàng</strong></p>
                    <p class="">Đổi trả trong 30 ngày
                        <Modal />
                    </p>
                </div>
                <!-- Địa chỉ giao hàng -->
                <!-- <div class="row gx-5">
                    <p>Giao hàng đến
                        <span class="px-2">
                            <a class="text-decoration-none link-primary" href="#">Thay đổi</a>
                        </span>
                    </p>
                </div> -->
                <!-- Số lượng sách sẽ mua  -->
                <div v-if="Book.bookStock !== 0" style="display: flex; justify-content: start; align-items: center;">
                    <div class="px-0 fs-5 me-3">Số lượng</div>
                    <div class="btn-group" role="group" aria-label="Basic outlined">
                        <button @click="BookQuantityReduce" type="button" class="btn btn-outline-primary">-</button>
                        <input required type="number" pattern="[0-9]*" class="btn border" step="1" min="1" width="10px"
                            v-model="BookQuantity" :max="this.TempBookStock" />
                        <button @click="BookQuantityIncrease" type="button" class="btn btn-outline-primary">+</button>
                    </div>
                </div>
                <hr />
                <!-- Button Mua Ngay, Thêm Vào Giỏ Hàng -->
                <div v-if="Book.bookStock !== 0" class="py-3">
                    <span @click="PayClick" class="btn btn-danger">Mua Ngay</span>
                    <button @click="addProductToCart" class="px-2 mx-4 btn btn-outline-danger">Thêm Vào
                        Giỏ Hàng</button>
                </div>
                <!-- Hết hàng  -->
                <div v-if="Book.bookStock === 0" class="text-danger fs-3 fw-bold">
                    Hết hàng
                </div>
            </div>
        </div>
        <!-- Thông tin sản phẩm và bình luận  -->
        <div class="" style="margin-top: 10px; padding: 10px;">
            <!-- Thanh điều hướng  -->
            <nav>
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <button class="nav-link active fw-bold" id="nav-home-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home"
                        aria-selected="true">Thông tin sản phẩm</button>
                    <button class="nav-link fw-bold" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile"
                        type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Đánh giá</button>
                </div>
            </nav>
            <!-- Review -->
            <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    {{ Book.bookDes }}
                </div>
                <!-- Bình luận  -->
                <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                    <CommentForm :idBook="this.id" @submitComment="getComment" />
                    <div v-for="item in commentList" :key="item._id">
                        <Comments :comment="item" @commentDelete="getComment" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// Import
import Carousel_Img from '../components/Carousel_Img.vue';
import Modal from '../components/Modal.vue';
import Comments from '../components/Comments.vue';
import CommentForm from '../components/CommentForm.vue';
import BooksService from '@/services/books.service';
import ImagesService from '@/services/images.service';
import CommentsService from '@/services/comments.service';
import { useDataStore } from '../stores/dataStores';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
    components: {
        Carousel_Img, Modal, Comments, CommentForm
    },
    props: {
        id: { type: String, required: true },
    },
    data() {
        // Đinh nghĩa thông báo nổi 
        const notify = () => {
            toast("Đã Thêm Sản Phẩm Vào Giỏ Hàng", {
                autoClose: 1500,
                limit: 1,
                type: toast.TYPE.SUCCESS,
                multiple: false,
                hideProgressBar: true
            });
            this.notify = function () {
                return 0;
            };
        }
        return {
            BookQuantity: 1,
            Book: {},
            ImgaeArray: {},
            notify: notify,
            Cart: [],
            commentList: []
        }
    },
    computed: {
    },
    methods: {
        // Tìm kiếm theo tên Supplisher
        searchByNameSupplisher() {
            useDataStore().setSearchByNameSupplisher(this.Book.supplisherName);
            console.log(useDataStore().getSearchByNameSupplisher);
            this.$router.push('/Search')
        },

        // Lấy bình luận của một quyển sách
        async getComment() {
            let doc = await CommentsService.getAll()
            this.commentList = doc.filter(item => item._idBook === this.id)
            console.log(this.commentList);
        },

        // Cập nhật dữ liệu vào store và chuyển sang trang Thông tin đơn hàng - Vận chuyển
        async PayClick() {
            await this.addProductToCart();
            this.$router.push('/Inform');
        },

        // Tăng số lượng sách
        BookQuantityIncrease() {
            if (this.BookQuantity < this.Book.bookStock) {
                this.BookQuantity++;
            }
        },
        // Giảm số lượng sách 
        BookQuantityReduce() {
            if (this.BookQuantity > 1) {
                this.BookQuantity--;
            }
        },

        // Thêm sản phẩm vào giỏ hàng trong Cookies 
        async addProductToCart() {
            try {
                await axios
                    .get(`http://localhost:3000/cookies/set/${this.id}/${this.BookQuantity}`, {
                        withCredentials: true
                    })
                    .then((response) => {
                        // console.log(response.data)
                        // Thêm sản phẩm vào giỏ hàng thành công
                        this.notify();
                    })

            } catch (error) {
                console.log(error);
            }
        },

        // Lấy carts từ cookies
        async getCart() {
            try {
                await axios
                    .get(`http://localhost:3000/cookies/read`, {
                        withCredentials: true
                    })
                    .then((response) => {
                        // Gán biến để kiểm tra sản phẩm đã có trong cart hay chưa 
                        this.Cart = response.data
                        // console.log(this.Cart)
                    })
            } catch (error) {
                console.log(error);
            }
        },

        // Lấy Book trong store (nếu có) hoặc từ DB
        async getBook() {
            if (useDataStore().getBooks.length !== 0) {
                this.Book = useDataStore().getBooks.filter(book => book._id === this.id)[0];
                this.TempBookStock = this.Book.bookStock
            }
            else {
                try {
                    this.Book = await BooksService.get(this.id);
                    this.TempBookStock = this.Book.bookStock
                }
                catch (error) {
                    console.log(error);
                }
            }
        },

        // Lấy tất cả những image của Book trong store (nếu có) hoặc từ DB
        async getImggeArray() {
            if (useDataStore().getImages.length !== 0) {
                this.ImgaeArray = useDataStore().getImages.filter(image => image._idBook === this.id);
            }
            else {
                try {
                    this.ImgaeArray = await ImagesService.getAll();
                    useDataStore().setImages(this.ImgaeArray);
                    this.ImgaeArray = this.ImgaeArray.filter(image => image._idBook === this.id);
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
    },
    mounted() {
    },
    // Lấy dữ liệu trước khi kết xuất
    created() {
        this.getComment();
        this.getCart();
        this.getBook();
        this.getImggeArray();
    }
}
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera - Khoá spin trên input, type number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.column-breaks {
    display: flex;
}

@media (min-width: 576px) {
    .column-breaks {
        display: none;
    }
}
</style>