<template>
    <!-- Image -->
    <th scope="row">
        <router-link :to="{
            name: 'BookDetails',
            params: { id: Book._id },
        }">
            <img class="imgCart border rounded" :src="linkImage">
        </router-link>
    </th>

    <td class="align-middle">
        <router-link :to="{
            name: 'BookDetails',
            params: { id: Book._id },
        }">
            <div style="font-size: 14px;" class="fw-bold text-danger">{{ Book.bookName }}</div>
            <!-- Thông tin khuyến mãi  -->
            <small>{{ }}</small>
            <small class="d-block">Còn lại: {{ Book.bookStock }}</small>
        </router-link>
    </td>

    <td class="align-middle text-center">
        {{ (Book.bookPrice).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }) }}
    </td>

    <td class="align-middle text-center">
        <div class="btn-group" role="group" aria-label="Basic outlined">
            <button @click="BookQuantityReduce" type="button" class="btn btn-outline-primary">-</button>
            <input required type="number" pattern="[0-9]*" class="btn border" step="1" min="1" width="10px"
                v-model="BookQuantity" :max="Book.bookStock" />
            <button @click="BookQuantityIncrease" type="button" class="btn btn-outline-primary">+</button>
        </div>
    </td>

    <td class="align-middle text-center fw-bold">
        {{ (Book.bookPrice * parseInt(BookQuantity, 10)).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }) }}
    </td>

    <td class="align-middle text-center">
        <button @click="deleteProductInCart(Book._id)">
            <span class="btn btn-outline-danger fa-solid fa-trash"></span>
        </button>
    </td>
</template>
<script>
// Import here
import ImagesService from '@/services/images.service'
import { useDataStore } from "../stores/dataStores";
import axios from 'axios'

export default {
    props: {
        Book: Object, // get Book từ HomePage
        Cart: Object,
    },
    emits: ['updateQuantity', 'updateCart'],
    data() {
        return {
            linkImage: null, // linkImage của Book lấy từ store
            ImgaeArray: [],
            BookQuantity: this.getBookQuantity(),
        }
    },
    methods: {
        // Tăng số lượng sách, cập nhật giỏ hàng trên cookies 
        async BookQuantityIncrease() {
            if (this.BookQuantity < this.Book.bookStock) {
                this.BookQuantity++;
                await this.updateProductInCart(this.Book._id, this.BookQuantity);
                this.$emit('updateQuantity');
            }
        },

        // Giảm số lượng sách, cập nhật giỏ hàng trên cookies 
        async BookQuantityReduce() {
            if (this.BookQuantity > 1) {
                this.BookQuantity--;
                await this.updateProductInCart(this.Book._id, this.BookQuantity);
                this.$emit('updateQuantity');
            }
        },
        // Cập nhật số lượng của một sản phẩm giỏ hàng trên cookies 
        async updateProductInCart(idBook, bookQuantity) {
            try {
                await axios
                    .get(`http://localhost:3000/cookies/set/${idBook}/${bookQuantity}`, {
                        withCredentials: true
                    })
                    .then((response) => {
                        console.log(response.data)
                    })
            } catch (error) {
                console.log(error);
            }
        },

        // Xoá sản phẩm trong giỏ hàng 
        async deleteProductInCart(idBook) {
            try {
                await axios
                    .get(`http://localhost:3000/cookies/clear/${idBook}`, {
                        withCredentials: true
                    })
                    .then((response) => {
                        console.log(response.data)
                    });
                this.$emit('updateCart', '')
            } catch (error) {
                console.log(error);
            }
        },

        // Lấy số lượng sách muốn mua của sách đó
        getBookQuantity(idBook, Cart) {
            let bookQuantity = 0;
            for (let i = 0; i < this.Cart.length; i++) {
                if (this.Book._id === this.Cart[i].idBook) {
                    bookQuantity = this.Cart[i].quantityBook;
                }
            }
            return bookQuantity;
        },

        // Lấy tất cả những image của sách  
        async getImageArray() {
            if (useDataStore().getImages.length !== 0) {
                this.ImgaeArray = useDataStore().getImages.filter(image => image._idBook === this.Book._id);
                this.linkImage = this.ImgaeArray.filter(image => image._idBook === this.Book._id)[0].linkImage;
            }
            else {
                try {
                    this.ImgaeArray = await ImagesService.getAll();
                    useDataStore().setImages(this.ImgaeArray);
                    let temp = this.ImgaeArray.filter(image => image._idBook === this.Book._id)
                    this.linkImage = temp[0].linkImage;
                }
                catch (error) {
                    console.log(error);
                }
            }
        },

        // Lấy giỏ hàng trên cookies
        async getCartOnCookie() {
            try {
                axios
                    .get(`http://localhost:3000/cookies/read`, {
                        withCredentials: true
                    })
                    .then((response) => {
                        this.Cart = response.data
                        console.log('Cart on cookies');
                        console.log(this.Cart)
                        return response.data
                    })
            } catch (error) {
                console.log(error);
            }
        },

    },
    mounted() {

    },
    created() {
        this.getImageArray();
    }
}
</script>
<style scoped>
.imgCart {
    height: 120px;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>