<template >
    <div class="bg-white mt-2">
        <div class=" pt-2 text-uppercase fs-6 ps-2 fw-bold">Đơn hàng của tôi </div>
        <v-sheet elevation="1">
            <v-tabs bg-color="" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline"
                show-arrows fixed-tabs>
                <v-tab v-for="(item, index) in itemsOrder" :key="item" :value="item" @click="clickOrderStatus(item, index)">
                    {{ item }}
                </v-tab>
            </v-tabs>
        </v-sheet>
        <v-table fixed-header height="300px" class="xs">
            <thead>
                <tr>
                    <th class="text-left" v-for="index in item2">
                        {{ index }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in orderList">
                    <td>{{ item._id }}</td>
                    <td>{{ formatDate(item.orderDate) }}</td>
                    <td>{{ item.orderTotal }}</td>
                    <td>{{ item.orderStatus }}</td>
                    <td>
                        <router-link :to="{ name: 'OrderDetail', params: { id: item._id } }">
                            Xem chi tiet
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>
<script >
import axios from 'axios';
import { useDataStore } from '@/stores/dataStores';
export default {

    data() {
        return {

            itemsOrder: ["Tất cả", "Chờ xác nhận", "Lấy hàng", "Đang giao", "Đã nhận", "Hoàn trả", "Đã hủy"],
            item2: ["Mã đơn hàng", "Ngày mua", "Tổng tiền", "Trạng thái", ""],
            order: [],
            orderList: [],
            orderOfUser: [],


        };
    },

    methods: {
        clickOrderStatus(item, index) {
            if (index == 0) {
                this.orderList = this.order

            }
            else {
                this.orderList = this.order
                this.orderList = this.orderList.filter(i => i.orderStatus === item)
            }

        },
        async getOrder() {
            await axios
                .get("http://localhost:3000/api/orders/")
                .then((response) => {
                    this.orderOfUser = useDataStore().getUser
                    useDataStore().getAPIOrder(response.data)
                    this.order = useDataStore().getOrderList
                    this.order = this.order.filter(i => i.userId === localStorage.getItem('_id'))
                    this.orderList = this.order
                })
            // for (let index = 0; index <= this.orderList.length; index++) {
            //     //console.log(this.orderList[index].orderDate)
            //     var date = new Date(this.orderList[index].orderDate)
            //     var dateString = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '-');
            //     this.orderList[index].orderDate = dateString
            //     console.log(date)
            // }
        },
        formatDate(time) {
            var date = new Date(time)
            return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '-');
        }
    },
    mounted() {
        this.getOrder()
    },

};
</script>
<style>
/* .testr {

  margin-bottom: 1%;
}

.oder {
  border-right: 1px solid #58626B;
  text-align: center;
  font-weight: bold;
}

.oder2 {
  border-bottom: 1px solid #d4d7d9;
  text-align: center;

}

.oder:hover {
  color: red;
} */
</style>