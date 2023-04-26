<template>
    <Bar v-if="wait" :data="chartData" :options="chartOptions" />
</template>

<script>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    components: {
        Bar
    },
    props: {
        books: Array,
        suppliers: Array
    },
    data() {
        return {
            chartData: {
                labels: [],
                datasets: [
                    {
                        backgroundColor: ['#f87979'],
                        data: [],
                        label: 'Số mẫu sách'
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
            var book = this.books
            for (var i of this.suppliers) {
                var number = book.filter(book => book.supplisherName === i.supplierName);
                this.chartData.labels.push(i.supplierName)
                this.chartData.datasets[0].data.push(number.length)
                console.log(i.supplierName, number.length)

            }
            this.wait = true
        }
    },
    mounted() {
        this.getData()
        console.log(this.books)

    }
}
</script>