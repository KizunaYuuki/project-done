<template>
    <router-link :to="{
        name: 'BookDetails',
        params: { id: Book._id },
    }">
        <table class="table">
            <tbody>
                <tr style="font-size: 12px;">

                    <!-- Image -->
                    <td class="" style="width: 20%">
                        <div class="figure position-relative">
                            <img :src="linkImage" width="60" class="rounded" alt="...">

                            <!-- Số lượng sách  -->
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{{
                                BookQuantity }}</span>
                        </div>
                    </td>

                    <!-- Tên sách  -->
                    <td class="align-middle fw-bold" style="width: 70%;">{{ Book.bookName }}</td>

                    <!-- Giá sách, tính theo giá khuyến mãi nếu có  -->
                    <td class="align-middle" style="width: 10%;">
                        <div class="text-danger fw-bolder">{{ (Book.bookPrice * parseInt(BookQuantity,
                            10)).toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }) }}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </router-link>
</template>
<script>
// Import here
// import ImagesService from '@/services/images.service'
import { useDataStore } from "../stores/dataStores";
import ImagesService from '@/services/images.service'

export default {
    props: {
        Book: Object, // get Book Pay.vue 
        Cart: Object,
    },
    data() {
        return {
            linkImage: null, // linkImage của Book lấy từ store
            ImgaeArray: [],
            BookQuantity: this.getBookQuantity(),
        }
    },
    methods: {
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

        // Lấy số lượng sách muốn mua của sách đó
        getBookQuantity(idBook, Cart) {
            let bookQuantity = 0;
            for (let i = 0; i < this.Cart.length; i++) {
                if (this.Book._id === this.Cart[i].idBook) {
                    bookQuantity = this.Cart[i].quantityBook;
                }
            }
            return bookQuantity;
        }
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
    width: 100px;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>