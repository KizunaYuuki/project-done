<template>
    <v-table fixed-header>
        <thead>
            <tr>
                <th>Ảnh</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Nhà cung cấp</th>
                <th>Ngày nhập</th>
                <th>Số lượng</th>
                <th>Giá nhập</th>
                <th>Giá bìa</th>
                <th>Sửa/Xóa</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="( item, index) in booksList" :key="item._id">
                <th><v-img :src="getImg(item._id)" cover>
                    </v-img></th>
                <th><router-link :to="{
                    name: 'ProductDetail',
                    params: { id: item._id },
                }">{{ item.bookName }}</router-link></th>
                <th>{{ item.author }}</th>
                <th>{{ item.supplisherName }}</th>
                <th>{{ item.receiptDate }}</th>
                <th>{{ item.bookStock }}</th>
                <th>{{ item.receiptPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</th>
                <th>{{ item.originalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</th>
                <th><router-link :to="{
                    name: 'ProductForm',
                    params: { id: item._id },
                }"><span type="button" class="badge bg-warning"><i
                                class="fas fa-regular fa-pen-to-square"></i></span></router-link>

                    <span type="button" @click="deleteBook(item._id, item.bookName)" style="margin-left: 5px;"
                        class="badge bg-danger">X</span>
                </th>
            </tr>
        </tbody>
    </v-table>
</template>

<script>
import BooksService from '../services/books.service';
import { toast } from 'vue3-toastify';
import { useDataStore } from '../stores/dataStores';
export default {
    data() {
        return {
        }
    },
    methods: {
        async deleteBook(id, name) {
            if (confirm('Bạn muốn xóa sách ' + name)) {
                try {
                    var kq = await BooksService.delete(id)
                    console.log(kq)
                    toast.success("Xóa thành công", {
                        transition: toast.TRANSITIONS.SLIDE,
                    });
                    this.$emit('send-data', 'update');
                }
                catch (error) {
                    console.log(error);
                }
            }
        },
        getImg(id) {
            var img = useDataStore().getImgBook.filter(img => img._idBook === id)
            return img[0]?.linkImage
        }
    },
    props: {
        booksList: { type: Array, required: true },
    }
}
</script>