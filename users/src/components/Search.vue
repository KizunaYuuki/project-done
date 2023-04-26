<template>
    <!-- Các thành phần - nội dung chính trong trang   -->
    <div class="container text-center fs-4 text-danger rounded-2 pb-4" style="background-color: #ffffff;">
        <div class="m-2 p-2">Kết quả tìm kiếm: {{ search }}</div>
        <div class="m-2 p-2" v-if="book.length === 0">Không tìm thấy sản phẩm</div>
        <div style="display: none;">{{ searchValue }}</div>
        <v-row :equal="{ sm: true, md: false }" v-if="show">
            <v-col v-for="item in searchValue" :key="item._id" class="d-flex align-center justify-center">
                <Cards :book="item" />
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { useDataStore } from '../stores/dataStores';
import Cards from '../components/Cards.vue';
export default {
    components: {
        Cards,
    },
    mounted() {
        // this.searchValue()
    },
    data() {
        return {
            book: [],
            show: false,
            search: ''
        }
    },
    methods: {

        removeVietnameseTones(str) {
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            str = str.replace(/Đ/g, "D");
            // Some system encode vietnamese combining accent as individual utf-8 characters
            // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
            str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
            str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
            // Remove extra spaces
            // Bỏ các khoảng trắng liền nhau
            str = str.replace(/ + /g, " ");
            str = str.trim();
            // Remove punctuations
            // Bỏ dấu câu, kí tự đặc biệt
            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
            return str;
        },
    },
    computed: {
        aa() {
            var value = useDataStore().getSearch
            console.log(value);
            return value
        },
        searchValue() {
            var value = useDataStore().getSearch
            let Supplisher = useDataStore().getSearchByNameSupplisher;
            if (Supplisher !== '') {
                this.search = Supplisher
                this.book = useDataStore().getBooks.filter(item => item.author !== undefined)
                this.book = this.book.filter(item => item.supplisherName === Supplisher)
                useDataStore().setSearchByNameSupplisher('');
            }
            else if (value !== '') {
                this.search = value
                this.book = useDataStore().getBooks.filter(item => item.author !== undefined)
                this.book = this.book.filter(item => {
                    var normalizedBookName = this.removeVietnameseTones(item.bookName).toLowerCase()
                    const searchTerm = this.removeVietnameseTones(value).toLowerCase()
                    return normalizedBookName.includes(searchTerm)
                })
                // useDataStore().setSearch('');
            }
            this.show = true
            return this.book
        },

    },
}
</script>

<style>
.content {
    color: green;
}
</style>