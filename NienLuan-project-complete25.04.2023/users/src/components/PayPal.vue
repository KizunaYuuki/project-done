<template >
    <div class="text-center" id="your-container-element" style="margin: auto;"></div>
</template>

<script>
import { loadScript } from "@paypal/paypal-js";
import OrdersService from '@/services/orders.service';
import BooksService from '@/services/books.service';
import { useDataStore } from "../stores/dataStores";
import { toast } from 'vue3-toastify';
import axios from 'axios';

export default {
    data() {
        const notifyOrderComplete = () => {
            toast("Đặt hàng Thành Công", {
                autoClose: 3000,
                limit: 1,
                type: toast.TYPE.SUCCESS,
                multiple: false,
                hideProgressBar: true
            });
        };
        return {
            Cart: useDataStore().getCart,
            BookInCart: useDataStore().getBookInCart,
            notifyOrderComplete: notifyOrderComplete
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

                            // style
                            style: {
                                // layout: 'horizontal',
                                color: 'blue',
                                shape: 'rect',
                                label: 'checkout',
                                // height: 32,
                                tagline: false
                            },

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
                                                intent: "CAPTURE",
                                                purchase_units: [
                                                    {
                                                        items: useDataStore().getItemsPayPal,
                                                        amount: {
                                                            currency_code: "USD",
                                                            value: useDataStore().getOrderTotal,
                                                            breakdown: {
                                                                item_total: {
                                                                    currency_code: "USD",
                                                                    value: useDataStore().getOrderTotal
                                                                }
                                                            }
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

                                const notifyOrderComplete = () => {
                                    toast("Đặt hàng Thành Công", {
                                        autoClose: 3000,
                                        limit: 1,
                                        type: toast.TYPE.SUCCESS,
                                        multiple: false,
                                        hideProgressBar: true
                                    });
                                };

                                // submit order
                                async function submitOrder() {
                                    try {

                                        let order = await useDataStore().getOrder
                                        if (order === undefined) {
                                            alert('Đơn hàng rỗng')
                                        }

                                        let total = await OrdersService.create(order)
                                        if (total === undefined)
                                            alert('Tạo đơn hàng không thành công');
                                        else {
                                            // Kiểm tra order
                                            console.log(total);

                                            // Khai báo cần thiết
                                            let book = Object
                                            let quantityBook
                                            let Cart = useDataStore().getCart;
                                            let BookInCart = useDataStore().getBookInCart;

                                            // Cập nhật bookStock cho book
                                            for (let i = 0; i < BookInCart.length; i++) {
                                                quantityBook = Cart.find(book => book.idBook === BookInCart[i]._id).quantityBook
                                                let book = await BooksService.get(BookInCart[i]._id);
                                                book = {
                                                    bookStock: (parseInt(book.bookStock, 10) - parseInt(quantityBook, 10))
                                                }
                                                await BooksService.update(BookInCart[i]._id, book)
                                            }

                                            // Thông báo đặt hàng thành công
                                            notifyOrderComplete();

                                            // Destroy cookies giỏ hàng - cart sau khi đặt hàng thành công
                                            await axios
                                                .get(`http://localhost:3000/cookies/clear`, {
                                                    withCredentials: true
                                                })
                                                .then((response) => {
                                                    console.log(response.data)
                                                })

                                            // Chuyển hướng đến trang ...
                                            setTimeout(() => {
                                                // this.$router.push('/Inform');
                                                window.location.href = "http://localhost:3001/Inform";
                                            }, "1000");


                                        }
                                    }
                                    catch (error) {
                                        console.log(error);
                                    }
                                }

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

                                // submit order
                                submitOrder()
                            },

                            // onInit is called when the button first renders
                            onInit(data, actions) {

                                // // Disable the buttons
                                // actions.disable();

                                // // Listen for changes to the checkbox
                                // document.querySelector('#check')
                                //     .addEventListener('change', function (event) {

                                //         // Enable or disable the button when it is checked or unchecked
                                //         if (event.target.checked) {
                                //             actions.enable();
                                //         } else {
                                //             actions.disable();
                                //         }
                                //     });
                            },

                            // onClick is called when the button is clicked
                            onClick() {

                                // // Show a validation error if the checkbox is not checked
                                // if (!document.querySelector('#check').checked) {
                                //     document.querySelector('#error').classList.remove('hidden');
                                // }
                            },

                            // Cancel 
                            onCancel(data) {
                                // Thanh toán lỗi
                                window.location.href = "/Inform";
                            },

                            // Error
                            onError(err) {
                                // For example, redirect to a specific error page
                                window.location.href = "/Inform";
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
        if (useDataStore().getOrderTotal === 0) {
            this.$router.push('/Inform');
        }
        this.paypalHanler();
    }
};
</script>