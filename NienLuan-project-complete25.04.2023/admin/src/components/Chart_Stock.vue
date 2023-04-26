<template>
    <Pie v-if="wait" :data="chartData" :options="chartOptions" />
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    components: {
        Pie
    },
    props: {
        data: Array
    },
    data() {
        return {
            chartData: {
                labels: ['Còn hàng', 'Sắp hết hàng', 'Hết hàng'],
                datasets: [
                    {
                        backgroundColor: ['#DD1B16', '#00D8FF', '#FFCCFF'],
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
            var data1 = this.data.filter(item => item.bookStock > 10)
            this.chartData.datasets[0].data.push(data1.length)
            var data2 = this.data.filter(item => item.bookStock <= 10 && item.bookStock > 0)
            this.chartData.datasets[0].data.push(data2.length)
            var data3 = this.data.filter(item => item.bookStock === 0)
            this.chartData.datasets[0].data.push(data3.length)
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