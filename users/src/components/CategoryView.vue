<template>
    <div class="container ">

        <div class="row">
            <div class="col-sm-3 category rounded  mt-2">
                <div @click="showAll" class="genre-item fw-bold">Tất cả sản phẩm</div>
                <div v-show="genreList && !showfull" class="genre-item fw-bold ml-2" @click="showgenre(genreList)">{{ show
                }}</div>
                <div v-if="genreList && !showfull" v-for="item in genreList.subGenre" :key="item" class="genre-item ml-3">
                    <div @click="showSubGenre(item)">{{ item }}</div>
                </div>
                <div v-else v-for="item in category">
                    <div class="genre-item fw-bold ml-2" @click="showgenre(item)">
                        {{ item.genreName }}
                    </div>
                </div>
            </div>
            <div class="col-sm  rounded ms-2 my-2 category" style="height: auto; padding: 5px;">
                <div class="d-flex flex-row m-2">
                    <div style="margin: 2px;">Sắp xếp theo: </div>
                    <select class="  form-select form-select-sm mobile" aria-label=".form-select-sm example"
                        style="width: 15%;" v-model="this.selectedSort">

                        <option value="1">Tên A-Z </option>
                        <option value="2">Tên Z-A </option>
                        <option value="3">Giá tăng dần </option>
                        <option value="4">Giá giảm dần </option>
                    </select>
                </div>
                <v-row :equal="{ sm: true, md: false }">
                    <v-col v-for="item in bookList" :key="item._id" class="d-flex align-center justify-center">
                        <Cards :book="item" />
                    </v-col>
                </v-row>
            </div>
        </div>
    </div>
</template>
<script>
import { useDataStore } from '../stores/dataStores';
import Cards from '../components/Cards.vue';
import { ref } from 'vue';
export default {
    components: {
        Cards,
    },
    mounted() {
        this.genreSelected = useDataStore().getGenreSelected
        this.bookList = useDataStore().getBooks
        this.bookList = this.bookList.filter(book => this.genreSelected.some(item => item == book.genreName))
    },

    data() {
        return {
            category: useDataStore().getGenes,
            genreList: ref([]),
            bookList: useDataStore().getBooks,
            genreSelected: useDataStore().getGenreSelected,
            selectedItems: [],
            categorySelected: useDataStore().getCategorySelected,
            showUI: false,
            showfull: useDataStore().getShowFull,
            selectedSort: 1
        }
    },
    methods: {
        showAll() {
            //Dung de show full sach
            useDataStore().setShowFull(true)
            this.showfull = useDataStore().getShowFull
            this.bookList = useDataStore().getBooks

        },
        compare(a, b) {
            const bookA = a.bookName[0].toUpperCase();
            const bookB = b.bookName[0].toUpperCase();

            let comparison = 0;
            if (bookA > bookB) {
                comparison = 1;
            } else if (bookA < bookB) {
                comparison = -1;
            }
            return comparison;
        },
        compare2(b, a) {
            const bookA = a.bookName[0].toUpperCase();
            const bookB = b.bookName[0].toUpperCase();

            let comparison = 0;
            if (bookA > bookB) {
                comparison = 1;
            } else if (bookA < bookB) {
                comparison = -1;
            }
            return comparison;
        },
        //Show sach thuoc danh muc cha
        showgenre(data) {
            //gan vao danh muc da cho la ten danh muc cha
            useDataStore().setCategorySelected(data.genreName)
            //gan vao danh muc da chon la mang danh muc con
            useDataStore().setGenreSelected(data.subGenre)
            //lay mang danh muc con ra
            this.genreSelected = useDataStore().getGenreSelected
            useDataStore().setShowFull(false)
            this.showfull = useDataStore().getShowFull

        },
        //show sach thuoc danh muc con
        showSubGenre(data) {
            //Gan vao danh muc da chon la ten danh muc con
            useDataStore().setGenreSelected([data])
            //lay ten danh muc con da chon
            this.genreSelected = useDataStore().getGenreSelected
            console.log(data)
            useDataStore().setShowFull(false)
            this.showfull = useDataStore().getShowFull
        },
    },
    computed: {
        show() {
            this.showfull = useDataStore().getShowFull
            //filter danh muc con da chon trong danh muc
            this.genreList = useDataStore().getGenes.filter(item => item.genreName === this.categorySelected)
            this.genreList = this.genreList[0]
            this.categorySelected = useDataStore().getCategorySelected
            console.log(this.categorySelected)
            this.genreSelected = useDataStore().getGenreSelected
            this.bookList = useDataStore().getBooks
            if (this.selectedSort == 1) {
                this.bookList.sort(this.compare)
            }
            if (this.selectedSort == 2) {
                this.bookList.sort(this.compare2)
            }
            if (this.selectedSort == 3) {
                this.bookList.sort(function (a, b) {
                    return a.bookPrice - b.bookPrice;
                })
            }
            if (this.selectedSort == 4) {
                this.bookList.sort(function (b, a) {
                    return a.bookPrice - b.bookPrice;
                })
            }
            if (!this.showfull)
                //neu bam vao tat ca san pham thi dong nay khong chay
                //loc danh sach san pham theo danh muc da chon
                this.bookList = this.bookList.filter(book => this.genreSelected.some(item => item == book.genreName))
            //Neu da chon vao vao tat ca san pham, thi se hien thi tat ca ten danh muc cha
            //Khi bam vao danh muc cha, thi tat hien thi tat ca danh muc cha, sau do hien thi lai danh muc con cua danh muc cha vua chon
            //Tra ve ten danh muc cha da chon
            return this.categorySelected

        },


    },
    watch: {
        categorySelected: function (newValue, oldValue) {
            //console.log(newValue)
            this.genreList = useDataStore().getGenes.filter(item => item.genreName === this.categorySelected)[0]

            // this.bookList = useDataStore().getBooks
            // if(!this.showfull)
            //     {//neu bam vao tat ca san pham thi dong nay khong chay
            //     //loc danh sach san pham theo danh muc da chon
            //     this.bookList = this.bookList.filter(book => this.genreSelected.some(item => item == book.genreName))}
            // this.showfull=true
        },
        // selectedSort : function(newValue){
        //     console.log(newValue);
        //     if(newValue==1){
        //        this.bookList.sort(this.compare)
        //     }
        //     if(newValue==2){
        //        this.bookList.sort(this.compare2)
        //     }
        //     if(newValue==3){
        //         this.bookList.sort(function(a, b) {
        //             return a.bookPrice - b.bookPrice;
        //         })
        //     }
        //     if(newValue==4){
        //         this.bookList.sort(function(b, a) {
        //             return a.bookPrice - b.bookPrice;
        //         })
        //     }
        // }




    }
}
</script>

<style>
@media (max-width: 912px) {

    .mobile {
        width: 30% !important;
    }

}

.genre-item:hover {
    color: red;
    cursor: pointer;

}

.category {
    height: max-content;
    background-color: #ffffff !important;
}
</style>