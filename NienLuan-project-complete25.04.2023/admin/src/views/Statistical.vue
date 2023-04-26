<template>
    <h3 class="text-center font-weight-bold" style="color: crimson; padding: 20px;">THỐNG KÊ DOANH THU</h3>
    <hr>
    <div style="padding: 10px;">
        <v-radio-group inline label="Thống kê theo" v-model="flag" @update:model-value="selectFlag">
            <v-radio label="Ngày" value="0"></v-radio>
            <v-radio label="Tháng" value="1"></v-radio>
            <v-radio label="Năm" value="2"></v-radio>
        </v-radio-group>
    </div>
    <div v-if="flag === '0'">
        <div class="row" style="padding: 20px;">
            <v-select class="col-sm-2" style="width: max-content;" label="Tháng" v-model="selectMonth"
                :items="months"></v-select>
            <v-select class="col-sm-2" style="width: max-content;" label="Năm" v-model="selectYear"
                :items="years"></v-select>
            <v-btn class="col-sm-1" variant="outlined" color="primary" @click="updateDate">Chọn</v-btn>
        </div>
        <div style="height: 20rem;">
            <Chart_SalesVue v-if="waiting" :orders="orderAll" :month="orderMonth" :year="orderYear" :flag="flag" />
        </div>
    </div>
    <div v-if="flag === '1'">
        <div class="row" style="padding: 20px;">
            <v-select class="col-sm-2" style="width: max-content;" label="Năm" v-model="selectYear"
                :items="years"></v-select>
            <v-btn class="col-sm-1" variant="outlined" color="primary" @click="updateDate">Chọn</v-btn>
        </div>
        <div style="height: 20rem;">
            <Chart_SalesVue v-if="waiting" :orders="orderAll" :year="orderYear" :flag="flag" />
        </div>
    </div>
    <div v-if="flag === '2'">
        <p>Thống kê qua các năm</p>
        <div style="height: 20rem;">
            <Chart_SalesVue v-if="waiting" :orders="orderAll" :flag="flag" />
        </div>
    </div>
</template>

<script>
import OrdersService from '../services/orders.service'
import Chart_SalesVue from '../components/Chart_Sales.vue';
export default {
    components: {
        Chart_SalesVue
    },
    data() {
        return {
            orderAll: [],
            waiting: false,
            months: [],
            years: [],
            orderMonth: null,
            orderYear: null,
            selectMonth: null,
            selectYear: null,
            flag: null,
        }
    },
    methods: {
        async getOrders() {
            this.orderAll = await OrdersService.getAll()
        },
        set_MonthYear() {
            for (var i = 1; i <= 12; i++) {
                this.months.push(i)
            }
            for (var i = 2021; i <= new Date().getFullYear(); i++) {
                this.years.push(i)
            }
        },
        async updateDate() {
            console.log(this.flag)
            this.waiting = false
            await this.getOrders()
            if (this.selectMonth !== null && this.selectYear !== null && this.flag === '0') {
                this.orderMonth = await this.selectMonth
                this.orderYear = await this.selectYear
                this.waiting = true
            }
            else if (this.selectYear !== null && this.flag === '1') {
                this.orderYear = await this.selectYear
                this.waiting = true
            }
            else if (this.flag === '2') {
                this.waiting = true
            }
            console.log(this.waiting)
        },
        selectFlag() {
            // this.waiting = false
            if (this.flag === '2') {
                this.updateDate()
                console.log(this.waiting)
            }
        }
    },
    mounted() {
        this.set_MonthYear()
        // this.getOrders()
        // this.updateDate()
    }
}
</script>