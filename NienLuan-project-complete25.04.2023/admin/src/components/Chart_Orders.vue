<template>
    <Doughnut v-if="wait" :data="chartData" :options="chartOptions" />
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)
export default {
    components: { Doughnut },
    props: {
        data: Array
    },
    data() {
        return {
            chartData: {
                labels: ['Chờ xác nhận', 'Lấy hàng', 'Đang giao', 'Đã nhận', 'Đã hủy', 'Hoàn trả'],
                datasets: [
                    {
                        backgroundColor: ['#DD1B16', '#006666', '#00D8FF', '#41B883', '#FFCCFF', '#CC9966'],
                        data: []
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
        async getData() {
            var data1 = this.data.filter(item => item.orderStatus === 'Chờ xác nhận')
            this.chartData.datasets[0].data.push(data1.length)
            var data2 = this.data.filter(item => item.orderStatus === 'Lấy hàng')
            this.chartData.datasets[0].data.push(data2.length)
            var data3 = this.data.filter(item => item.orderStatus === 'Đang giao')
            this.chartData.datasets[0].data.push(data3.length)
            var data4 = this.data.filter(item => item.orderStatus === 'Đã nhận')
            this.chartData.datasets[0].data.push(data4.length)
            var data5 = this.data.filter(item => item.orderStatus === 'Đã hủy')
            this.chartData.datasets[0].data.push(data5.length)
            var data6 = this.data.filter(item => item.orderStatus === 'Hoàn trả')
            this.chartData.datasets[0].data.push(data6.length)
            this.wait = true
            console.log(this.chartData.datasets[0].data)
        }
    },
    mounted() {
        this.getData()
        console.log(this.data)

    }
}
</script>