<template>
    <h3 class="text-center font-weight-bold" style="padding: 20px;color: crimson;">QUẢN LÝ SẢN PHẨM</h3>
    <div style="padding: 10px;" class="row">
        <div class="col-sm-4 text-center d-flex align-center justify-center" style=" margin-bottom: 5px;">
            <div class="text-center" style="margin-right: 10px;">
                <v-btn style="font-size: x-large;" color="primary" @click="dialog1 = true">
                    <i class="fa-solid fa-plus"></i>
                </v-btn>

                <v-dialog v-model="dialog1" width="auto">
                    <v-card>
                        <v-card-title>Các sách mới nhập hàng</v-card-title>
                        <v-card-text>
                            <v-table fixed-header>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên sách</th>
                                        <th>Nhà cung cấp</th>
                                        <th>Ngày nhập</th>
                                        <th>Số lượng</th>
                                        <th>Giá nhập</th>
                                        <th>Thêm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="( item, index) in booksNew" :key="item._id">
                                        <th>{{ index + 1 }}</th>
                                        <th>{{ item.bookName }}</th>
                                        <th>{{ item.supplisherName }}</th>
                                        <th>{{ item.receiptDate }}</th>
                                        <th>{{ item.bookStock }}</th>
                                        <th>{{ item.receiptPrice.toLocaleString('vi-VN', {
                                            style: 'currency', currency:
                                                'VND'
                                        }) }}</th>
                                        <th><router-link :to="{
                                            name: 'ProductForm',
                                            params: { id: item._id },
                                        }"><span type="button" class="badge bg-primary"><i
                                                        class="fa-solid fa-plus"></i></span></router-link>
                                        </th>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" block @click="dialog1 = false">Đóng</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>

            <v-dialog v-model="dialog" width="auto">
                <template v-slot:activator="{ props }">
                    <v-btn color="purple-accent-4" v-bind="props"
                        style="width: 0rem;height: fit-content; margin-right: 20px;">
                        <svg-icon size="40" type="mdi" :path="path"></svg-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        Danh mục sách
                    </v-card-title>
                    <v-card-text>
                        <h5 class="gene" @click="pillGenes(0)" type="button">Tất cả</h5>
                        <v-row>
                            <v-col v-for="item in geneList" :key="item._id">
                                <strong style="width: fit-content;" type="button" class="gene"
                                    @click="pillGenes(1, item.genreName)">{{ item.genreName
                                    }}</strong>
                                <p type="button" v-for="i in item.subGenre" :key="i" class="gene" @click="pillGenes(2, i)">
                                    {{ i
                                    }}
                                </p>
                            </v-col>
                            <v-col>
                                <div style="width: fit-content;"><strong>Nhà cung cấp</strong>
                                    <p type="button" v-for="item in supplierList" :key="item._id" class="gene"
                                        @click="pillGenes(3, item.supplierName)">{{ item.supplierName }}
                                    </p>
                                </div>
                            </v-col>
                            <v-col>
                                <strong type="button" class="gene" style="width: max-content;" @click="comeOutStock">Sắp hết
                                    hàng</strong>
                            </v-col>
                            <v-col>
                                <strong type="button" class="gene" style="width: max-content;" @click="outStock">Hết
                                    hàng</strong>
                            </v-col>
                            <v-col>
                                <!-- <strong type="button" class="gene" style="width: max-content;" @click=""></strong> -->
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" block @click="dialog = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <div v-if="upDown" @click="upDown_Tag(0)" type="button">
                <strong>Số lượng:</strong> <i style="font-size: 1.5rem;" class="fas fa-solid fa-arrow-up"></i>
            </div>
            <div v-else @click="upDown_Tag(0)" type="button">
                <strong>Số lượng:</strong> <i class="fas fa-solid fa-arrow-down" style="font-size: 1.5rem;"></i>
            </div>
            <div>

            </div>
        </div>
        <div class="col-sm-8">
            <v-text-field list="datalistOptions" variant="solo" append-inner-icon="mdi-magnify" ref="search"
                label="Tìm kiếm theo tên sách..." @input="search"></v-text-field>
            <datalist id="datalistOptions">
                <option v-for="item in bookList" :key="item.id" :value="item.name"></option>
            </datalist>
        </div>

    </div>
    <div style="display: flex;justify-content: space-between;">
        <h5 style="text-transform: uppercase; margin-left: 2rem;">{{ title }}</h5>
        <h6 style="margin-right: 2rem;">Số lượng: {{ bookList.length }}</h6>

    </div>
    <hr style="margin-top: -5px;">
    <!-- style="display: flex; flex-wrap: wrap; justify-content: center; margin: 0 auto;" -->
    <div class="">
        <!-- <v-row :equal="{ sm: true, md: false }">
            <v-col v-for="item in bookList" :key="item.id" class="d-flex align-center justify-center">
                <Cards :book="item" />
            </v-col>
        </v-row> -->
        <Products_List :booksList="bookList" @send-data="receiveData" />
    </div>
</template>

<script>
import Products_List from '../components/Products_List.vue';
import { useDataStore } from '../stores/dataStores';
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiApps } from '@mdi/js'
import moment from 'moment';
import BooksService from '../services/books.service';
export default {
    components: {
        SvgIcon, Products_List
    },
    data() {
        return {
            bookList: [],
            booksNew: useDataStore().getBooks.filter(item => item.author === undefined),
            geneList: useDataStore().getGenes,
            supplierList: useDataStore().getSupllierList,
            path: mdiApps,
            title: 'tất cả',
            dialog: false,
            upDown: true,
            flag: 0,
            dialog1: false,

        }
    },
    methods: {
        search() {
            if (this.$refs.search.value === '') {
                if (this.flag == 0) {
                    this.pillGenes(0)
                }
                else if (this.flag == 1) {
                    this.pillGenes(1, this.title)
                }
                else if (this.flag == 2) {
                    this.pillGenes(2, this.title)
                }
                else if (this.flag == 3) {
                    this.pillGenes(3, this.title)
                }
            }
            else {
                this.bookList = useDataStore().getBooks.filter(item => item.author !== undefined)
                this.bookList = this.bookList.filter(item => {
                    var normalizedBookName = this.removeVietnameseTones(item.bookName).toLowerCase()
                    const searchTerm = this.removeVietnameseTones(this.$refs.search.value).toLowerCase()
                    return normalizedBookName.includes(searchTerm)
                })
                // this.bookList = this.bookList.filter(item =>
                //     item.name.toLowerCase().includes(this.$refs.search.value.toLowerCase())

                // )
            }
            // this.bookList=this.bookList.filter(item=>item.name)
            console.log(this.bookList)
            console.log(this.removeVietnameseTones(this.$refs.search.value))
        },
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
        upDown_Tag(e) {
            if (e === 0) {
                this.upDown = !this.upDown

                if (this.upDown) {
                    this.bookList.sort((a, b) => a.bookStock - b.bookStock);
                    // console.log(this.bookList)
                    // this.bookList = this.bookList.filter((item, index, array) => {
                    //     return index === 0 || item.bookStock > array[index - 1].bookStock;
                    // });
                }
                else {
                    this.bookList.sort((a, b) => b.bookStock - a.bookStock);
                    // console.log(this.bookList)
                    // this.bookList = this.bookList.filter((item, index, array) => {
                    //     return index === 0 || item.bookStock < array[index - 1].bookStock;
                    // });
                }
                // console.log(this.bookList);
            }
            else {
                if (this.flag == 0) {
                    this.pillGenes(0)
                }
                else if (this.flag == 1) {
                    this.pillGenes(1, this.title)
                }
                else if (this.flag == 2) {
                    this.pillGenes(2, this.title)
                }
                else if (this.flag == 3) {
                    this.pillGenes(3, this.title)
                }
            }
        },
        pillGenes(e, v) {
            if (e === 0) {
                this.bookList = useDataStore().getBooks.filter(item => item.author !== undefined)
                this.title = 'tất cả'
                this.flag = 0
                this.dialog = false
            }
            else if (e === 1) {
                this.bookList = useDataStore().getBooks.filter(item => item.author !== undefined)
                var geneExists = this.geneList.filter(item => item.genreName === v)
                geneExists = geneExists[0]
                this.bookList = this.bookList.filter(book => geneExists.subGenre.some(gene => gene === book.genreName[0]));
                this.title = v
                this.flag = 1
                this.dialog = false
                console.log(this.bookList)
                // console.log(this.bookList)
            }
            else if (e === 2) {
                this.bookList = useDataStore().getBooks.filter(item => item.author !== undefined)
                this.bookList = this.bookList.filter(book => book.genreName.includes(v))
                this.title = v
                this.flag = 2
                this.dialog = false
            }
            else if (e === 3) {
                this.bookList = useDataStore().getBooks.filter(item => item.author !== undefined)
                this.bookList = this.bookList.filter(book => book.supplisherName.includes(v))
                this.title = v
                this.flag = 3
                this.dialog = false
            }
        },
        async receiveData() {
            await this.getBooks()
            this.bookList = useDataStore().getBooks.filter(item => item.author !== undefined)
            console.log(this.bookList)
        },
        async getBooks() {
            var data = await BooksService.getAll()
            useDataStore().updateBooks(data)
            // this.bookList=
        },
        comeOutStock() {
            this.bookList = useDataStore().getBooks.filter(item => item.author !== undefined)
            this.bookList = this.bookList.filter(book => book.bookStock <= 10 && book.bookStock > 0)
            this.title = 'sắp hết hàng'
            this.dialog = false
        },
        outStock() {
            this.bookList = useDataStore().getBooks.filter(item => item.author !== undefined)
            this.bookList = this.bookList.filter(book => book.bookStock === 0)
            this.title = 'hết hàng'
            this.dialog = false
        }
    },
    mounted() {
        var proList = useDataStore().getPromotionList
        this.bookList = useDataStore().getBooks.filter(item => item.author !== undefined)
        console.log(this.booksNew);
        // this.getBooks()
        var waitingList = []
        for (var i of proList) {
            const now = new Date();
            if (now > new Date(i.dateEnd)) {
                console.log("Đã kết thúc")
            }
            else if (now < new Date(i.dateBegin)) {
                console.log("Yet")
                const dateBegin = moment(i.dateBegin)
                var duration = moment.duration(dateBegin.diff(now)).asMinutes();
                if (duration < 30) {
                    waitingList.push(i)
                }
                console.log(duration)
            }
            else {
                for (var id of i.productList) {
                    useDataStore().updateProBook(id, i.pricePro, i.dateEnd)
                    // console.log(this.bookList.filter(i => i.id == id))
                }
            }
        }
        // console.log(waitingList)
        if (waitingList.length > 0) {
            var waiting = setInterval(() => {
                // console.log(waitingList)
                for (var i of waitingList) {
                    const now = moment();
                    if (now >= new Date(i.dateBegin) && now <= new Date(i.dateEnd)) {
                        for (var id of i.productList) {
                            useDataStore().updateProBook(id, i.pricePro, i.dateEnd)
                        }
                        waitingList = waitingList.filter(item => item.id !== i.id)
                    }
                    if (waitingList.length === 0) {
                        clearInterval(waiting)
                    }
                }
            }, 1000)
        }
    }
}
</script>

<style>
.gene:hover {
    color: orange;
    display: block;
}
</style>