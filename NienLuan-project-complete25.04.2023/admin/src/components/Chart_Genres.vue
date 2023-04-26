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
        genres: Array
    },
    data() {
        return {
            chartData: {
                labels: [],
                datasets: [
                    {
                        backgroundColor: ['#B22222'],
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
            // var geneExists = this.genres.filter(item => item.genreName === v)
            // geneExists = geneExists[0]
            var book = this.books.filter(book => book.author !== undefined)
            for (var i of this.genres) {
                var number = book.filter(book => i.subGenre.some(gene => gene === book.genreName[0]));
                this.chartData.labels.push(i.genreName)
                this.chartData.datasets[0].data.push(number.length)
                console.log(i.genreName, number.length)

            }
            // this.chartData.datasets[0].data.push(data1.length)
            this.wait = true
            // console.log(this.chartData.datasets[0].data)
        }
    },
    mounted() {
        console.log(this.genres)
        this.getData()


    }
}
</script>