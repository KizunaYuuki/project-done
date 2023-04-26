import OrdersService from '../services/orders.service'
async function getOrders() {
    var orders = await OrdersService.getAll()
    console.log(orders)
}
export const data = {
    getOrders,
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
        {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: [40, 20, 80, 10]
        }
    ]
}

export const options = {
    responsive: true,
    maintainAspectRatio: false
}