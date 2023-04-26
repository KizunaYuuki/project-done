<template>
    <div class="row">
        <div class="col-sm-4">
            <h6>Phí vận chuyển áp dụng: {{ changeNumber }}
            </h6>
        </div>
        <div class="col-sm-8" style="display: flex;">
            <v-text-field variant="underlined" type="number" v-model="ship" :rules="rules"
                label="Nhập phí vận chuyển mới"></v-text-field>
            <v-btn color="primary" @click="submit"
                style="width: 0; height: 70%;;font-size: larger;font-weight: 600;">Lưu</v-btn>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import ShipFeeService from '../services/shipFee.service';
export default {
    data() {
        return {
            ship: Number
        }
    },
    methods: {
        async submit() {
            if (this.ship !== '' && this.ship >= 1000) {
                var kq = await ShipFeeService.update('6416ea6024079c43937d0e69', { shipFee: this.ship, date: new Date() })
                if (kq) {
                    toast.success("Cập nhật phí vận chuyển thành công", {
                        transition: toast.TRANSITIONS.SLIDE,
                    });
                    this.getShipFee()
                }
                else {
                    toast.error("Cập nhật phí vận chuyển thất bại", {
                        transition: toast.TRANSITIONS.SLIDE,
                    });
                }
            }
        },
        async getShipFee() {
            var fee = await ShipFeeService.get('6416ea6024079c43937d0e69')
            this.ship = fee.shipFee
        },
    },
    mounted() {
        this.getShipFee()
    },
    computed: {
        changeNumber() {
            return Number(this.ship).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
        }
    }
}
</script>