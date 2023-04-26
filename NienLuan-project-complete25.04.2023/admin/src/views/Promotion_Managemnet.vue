<template>
    <div class="container">
        <h3 class="text-center font-weight-bold" style="padding: 30px;color: crimson;">CHƯƠNG TRÌNH KHUYẾN MÃI</h3>
        <hr />
        <router-link :to="{
            name: 'PromotionNew',

        }"><button type="button" class="btn btn-outline-primary" data-bs-whatever="@getbootstrap"
                style="color: blue;">Thêm khuyến mãi<i class="fas fa-solid fa-bolt"></i></button></router-link>

        <div class="table-responsive">
            <h4 class="text-center" style="color: blue;">Danh sách chương trình khuyến mãi</h4>
            <v-table fixed-header height="300px">
                <thead class="table-active">
                    <tr>
                        <th>STT</th>
                        <th>Tên KM</th>
                        <th>Số lượng sản phẩm khuyến mãi</th>
                        <th>Giá trị khuyến mãi(%)</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Sửa/Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="( item, index) in promotionList" :key="item._id">
                        <th>{{ index + 1 }}</th>
                        <th>{{ item.promotionName }}</th>
                        <th>{{ item.productList.length }}</th>
                        <th>{{ item.promotionPrice }}</th>
                        <th>{{ item.promotionBegin }}</th>
                        <th>{{ item.promotionEnd }}</th>
                        <th><router-link :to="{
                            name: 'PromotionEdit', params: { id: item._id },
                        }"><span style="margin-right: 5px;" type="button" class="badge bg-warning"><i
                                        class="fas fa-regular fa-pen-to-square"></i></span></router-link>
                            <span type="button" @click="deletePromotion(item._id, item.promotionName)"
                                class="badge bg-danger">X</span>
                        </th>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
</template>

<script>
import { useDataStore } from '../stores/dataStores'
import { toast } from 'vue3-toastify';
import PromotionsService from '@/services/promotions.service.js'
export default {
    data() {
        return {
            promotionList: [],
        }
    },
    methods: {
        async getPromotion() {
            this.promotionList = await PromotionsService.getAll()
        },
        async deletePromotion(id, name) {
            if (confirm('Bạn muốn xóa khuyến mãi ' + name)) {
                var kq = await PromotionsService.delete(id)
                if (kq) {
                    toast.success("Xóa thành công", {
                        transition: toast.TRANSITIONS.SLIDE,
                    });
                    var data = await PromotionsService.getAll()
                    await useDataStore().updatePromotions(data)
                    this.promotionList = useDataStore().getPromotionList
                }
                else {
                    toast.error("Xóa thất bại", {
                        transition: toast.TRANSITIONS.SLIDE,
                    });
                }
            }
        },
        async getAllPromotion() {
            var data5 = await PromotionsService.getAll()
            await useDataStore().updatePromotions(data5)
            this.promotionList = useDataStore().getPromotionList
        }
    },
    mounted() {
        // this.getPromotion()
        this.getAllPromotion()
        console.log(this.promotionList)
    }
}
</script>