<template>
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner rounded-3">
            <div v-for="item in ImgaeArray" :key="item._id" class="carousel-item active text-center" data-bs-interval="3000"
                style="max-width: 350px; max-height: 400px;">
                <img :src="item.linkImage" style="height:400px;" class="text-center" alt="...">
            </div>
        </div>
        <button v-if="ImgaeArray.length > 1" class="carousel-control-prev" type="button"
            data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span class="carousel-control-prev-icon btn btn-danger" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button v-if="ImgaeArray.length > 1" class="carousel-control-next" type="button"
            data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span class="carousel-control-next-icon btn btn-danger" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</template>

<script>
import ImagesService from '@/services/images.service'
import { useDataStore } from '../stores/dataStores';
export default {
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {
            ImgaeArray: useDataStore().getImgBook.filter(image => image._idBook === this.id),
        }
    },
    methods: {

        // Lấy tất cả những Image của Book
        async getImageArray() {
            if (useDataStore().getBooks.length !== 0) {
                this.ImgaeArray = useDataStore().getImgBook.filter(image => image._idBook === this.id)
            }
            else {
                try {
                    this.ImgaeArray = await ImagesService.getAll();
                    useDataStore().updateImgBook(this.ImgaeArray);
                    this.ImgaeArray = this.ImgaeArray.filter(image => image._idBook === this.id)
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
    },
    mounted() {

    },
    created() {
        this.getImageArray();
    }
}
</script>