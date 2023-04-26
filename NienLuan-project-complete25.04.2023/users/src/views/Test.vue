<template>
    <div class="text-center" id="your-container-element" style="margin: auto;"></div>
</template>

<script>
import { loadScript } from "@paypal/paypal-js";
import { useDataStore } from '../stores/dataStores';
import axios from 'axios';

export default {
    props: {
        item: Object
    },
    watch: {
        item: function (newValue, oldValue) {
            console.log(newValue);
            this.itemList = newValue;
        }
    },
    data() {
        return {
            itemList: this.item || {},
            bookList: useDataStore().getBooks
        }
    },
    mounted() {

    },
    methods: {
        // reder button paypal
        async paypalHanler() {
            let paypal;
            // Load PayPal JS SDK
            try {
                paypal = await loadScript({
                    "client-id": "AQKDZ7Sr1AS-DGFMAHFDd3m8BLPDuCL8v8zjU9iesZO2H0zk8g2Dh1D-9gO-Uq3wNmIIBuxKfqJ5ADCT",
                    "data-page-type": "checkout",
                    sdkBaseURL: 'https://www.paypal.com/sdk/js'
                });
            } catch (error) {
                console.error("failed to load the PayPal JS SDK script", error);
            }
            // Handler click button
            if (paypal) {
                try {
                    await paypal
                        .Buttons({
                            // Sets up the transaction when a payment button is clicked
                            createOrder: async function () {
                                const response = await fetch("http://localhost:3000/create-paypal-order", {
                                    method: "post",
                                    credentials: "include",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    // use the "body" param to optionally pass additional order information
                                    // like product skus and quantities
                                    body: JSON.stringify({
                                        cart: [
                                            {
                                                // sku: this.YOUR_PRODUCT_STOCK_KEEPING_UNIT,
                                                // quantity: this.YOUR_PRODUCT_QUANTITY,

                                                intent: "CAPTURE",
                                                purchase_units: [
                                                    {
                                                        items: this.itemList,
                                                        // items: [
                                                        //     {
                                                        //         name: "T-Shirt",
                                                        //         description: "Green XL",
                                                        //         quantity: "1",
                                                        //         unit_amount: {
                                                        //             currency_code: "USD",
                                                        //             value: "1.00"
                                                        //         }
                                                        //     }
                                                        // ],
                                                        amount: {
                                                            currency_code: "USD",
                                                            value: "1453.00",
                                                            // breakdown: {
                                                            //     item_total: {
                                                            //         currency_code: "USD",
                                                            //         value: "1.00"
                                                            //     }
                                                            // }
                                                        },
                                                    },
                                                ],

                                            },
                                        ],
                                    }),
                                });
                                const order = await response.json();
                                // Successful create! For dev/demo purposes:
                                console.log(
                                    "Create result",
                                    order,
                                    JSON.stringify(order, null, 2)
                                );
                                return order.id;
                            },
                            // Finalize the transaction after payer approval
                            onApprove: async function (data) {
                                const response = await fetch("http://localhost:3000/capture-paypal-order", {
                                    method: "post",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        orderID: data.orderID,
                                    }),
                                });
                                const orderData = await response.json();
                                // Successful capture! For dev/demo purposes:
                                console.log(
                                    "Capture result",
                                    orderData,
                                    JSON.stringify(orderData, null, 2)
                                );
                            },
                        })
                        .render("#your-container-element");
                } catch (error) {
                    console.error("failed to render the PayPal Buttons", error);
                }
            }
        }
    },
    async created() {
        this.paypalHanler();
        // // Lấy dữ liệu chuyển đổi USD/VND từ Google Finance
        // let USDToVND
        // await axios
        //     .get(`http://localhost:3000/google-finance`, {
        //         withCredentials: true
        //     })
        //     .then((response) => {
        //         const data = response.data;
        //         const exchangeRateRegex = /<div class="YMlKec fxKbKc">([\d.,]+)<\/div>/;
        //         const exchangeRateMatch = data.match(exchangeRateRegex);
        //         if (exchangeRateMatch) {
        //             const exchangeRate = exchangeRateMatch[1];
        //             USDToVND = parseFloat(exchangeRate, 10);

        //         }
        //         // console.log(JSON.stringify(response.data));
        //     })
        // console.log(USDToVND);
        // // Thêm sản phẩm vào dropitem để có thể thanh toán bằng PayPal
        // this.dropItem = []
        // for (let i = 0; i < this.order.productList.length; i++) {
        //     let bookName = this.bookList.find(Book => Book._id === this.order.productList[i]._idBook).bookName;
        //     console.log(bookName);
        //     console.log(this.order.productList[i]);
        //     this.dropItem.push({
        //         name: bookName,
        //         description: "",
        //         quantity: (this.order.productList[i].quantity).toString(10),
        //         unit_amount: {
        //             currency_code: "USD",
        //             value: (this.order.productList[i].price).toString(10)
        //         }
        //     })
        // }
        // console.log(this.dropItem);
    },
    updated() {
    }
};
</script>
