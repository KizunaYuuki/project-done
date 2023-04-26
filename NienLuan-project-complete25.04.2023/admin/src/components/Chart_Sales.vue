<template>
    <LineWithLineChart v-if="wait" :data="chartData" :options="chartOptions" />
</template>

<script>
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import LineWithLineChart from './LineWithLineChart'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
export default {
    components: {
        LineWithLineChart
    },
    props: {
        orders: Array,
        month: Number,
        year: Number,
        flag: String
    },
    data() {
        return {
            chartData: {
                labels: [],
                datasets: [
                    {
                        backgroundColor: ['#000080'],
                        data: [],
                        label: 'Ngày'
                    }
                ]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            },
            wait: false
        }
    },
    methods: {
        getOrdersDay() {
            for (var i = 1; i <= 31; i++) {
                var sum = 0
                for (var j of this.orders) {
                    var orderYear = new Date(j.orderDate).getFullYear()
                    var orderMonth = new Date(j.orderDate).getMonth() + 1
                    var orderDay = new Date(j.orderDate).getDate()
                    console.log(orderDay)
                    if (j.orderStatus !== 'Đã hủy' && j.orderStatus !== 'Hoàn trả' && Number(orderYear) === this.year && Number(orderMonth) === this.month) {
                        if (Number(orderDay) === i) {
                            sum = sum + j.totalProductMoney

                        }
                    }
                }
                this.chartData.labels.push(i)
                this.chartData.datasets[0].data.push(sum)
            }
            this.wait = true
        },
        getOrdersMonth() {
            for (var i = 1; i <= 12; i++) {
                var sum = 0
                for (var j of this.orders) {
                    var orderYear = new Date(j.orderDate).getFullYear()
                    var orderMonth = new Date(j.orderDate).getMonth() + 1
                    // console.log(orderDay)
                    if (j.orderStatus !== 'Đã hủy' && j.orderStatus !== 'Hoàn trả' && Number(orderYear) === this.year) {
                        if (Number(orderMonth) === i) {
                            sum = sum + j.totalProductMoney

                        }
                    }
                }
                this.chartData.labels.push(i)
                this.chartData.datasets[0].data.push(sum)
            }
            this.chartData.datasets[0].label = 'Tháng'
            this.wait = true
        },
        async getOrdersYear() {
            for (var i = 2021; i <= new Date().getFullYear(); i++) {
                var sum = 0
                for (var j of this.orders) {
                    var orderYear = new Date(j.orderDate).getFullYear()
                    console.log(orderYear)
                    if (j.orderStatus !== 'Đã hủy' && j.orderStatus !== 'Hoàn trả') {
                        if (Number(orderYear) === i) {
                            sum = sum + j.totalProductMoney

                        }
                    }
                }
                this.chartData.labels.push(i)
                this.chartData.datasets[0].data.push(sum)
            }
            this.chartData.datasets[0].label = 'Năm'
            this.wait = true
        }
    },
    mounted() {
        this.wait = false
        if (this.flag === '0') {
            this.getOrdersDay()
        }
        else if (this.flag === '1') {
            this.getOrdersMonth()
        }
        else if (this.flag === '2') {
            this.getOrdersYear()
        }
        console.log(this.month, this.year)
    }
}
</script>