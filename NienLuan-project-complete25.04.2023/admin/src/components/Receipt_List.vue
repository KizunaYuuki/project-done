<template>
    <div>
        <div class="row">
            <router-link :to="{
                name: 'ReceiptNew',

            }" class="col-sm-2" style="width: fit-content;"><button class="btn btn-outline-primary "
                    style="height: fit-content; margin-top: 10px; width: fit-content;">Nhập
                    hàng <i class="fas fa-solid fa-receipt"></i></button></router-link>
            <div style="padding: 5px;" class="col-sm-8">
                <v-text-field list="dataReceiptlistOptions3" ref="search" append-inner-icon="mdi-magnify"
                    label="Tìm kiếm theo mã phiếu hoặc nhà cung cấp" @change="search"></v-text-field>
                <datalist id="dataReceiptlistOptions3">
                    <option v-for="item in Receiptlist" :key="item._id" :value="item._id">{{ item.dateReceipt }} | {{
                        item.supplierName
                    }}</option>
                </datalist>
            </div>
            <div class="col-sm-2" style="margin-top: 5px; ">
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="0"
                        ref="radio2" v-model="radio" @change="fillRadio">
                    <label class="form-check-label" for="inlineRadio2">Tất cả</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1"
                        ref="radio1" v-model="radio" @change="fillRadio">
                    <label class="form-check-label" for="inlineRadio1">Trả hết</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2"
                        ref="radio2" v-model="radio" @change="fillRadio">
                    <label class="form-check-label" for="inlineRadio2">Còn nợ</label>
                </div>
            </div>
        </div>

        <h5 class="text-uppercase text-center" style="color: blue;">Danh sách phiếu nhập hàng</h5>
        <v-table fixed-header height="300px">
            <thead>
                <tr>
                    <th class="text-left">STT</th>
                    <th class="text-left">Mã phiếu</th>
                    <th class="text-left">Ngày nhập</th>
                    <th class="text-left">Nhà cung cấp</th>
                    <th class="text-left">Số lượng hàng</th>
                    <th class="text-left">Tiền hàng</th>
                    <th class="text-left">Còn nợ</th>
                    <th class="text-left">Chỉnh sửa</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="( item, index) in Receiptlist" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item._id }}</td>
                    <td>{{ item.dateReceipt }}</td>
                    <td>{{ item.supplierName }}</td>
                    <td>{{ item.totalNumber }}</td>
                    <td>{{ item.totalMoneyReceipt.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</td>
                    <td :style="{ color: item.owe > 0 ? 'red' : 'blue' }">{{
                        item.owe.toLocaleString('vi-VN', {
                            style:
                                'currency', currency: 'VND'
                        }) }}</td>
                    <td>
                        <router-link :to="{
                            name: 'ReceiptEdit',
                            params: { id: item._id },
                        }"><span type="button" class="badge bg-warning"><i
                                    class="fas fa-regular fa-pen-to-square"></i></span></router-link>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>

<script>
import { useDataStore } from '../stores/dataStores';
import ReceiptsService from '../services/receipts.service';
export default {
    data() {
        return {
            Receiptlist: useDataStore().getReceiptList,
            radio: '',
        }
    },
    methods: {
        search() {
            if (this.$refs.search.value === '') {
                this.Receiptlist = useDataStore().getReceiptList
            }
            else {
                this.Receiptlist = this.Receiptlist.filter(item => item._id === this.$refs.search.value)
            }
        },
        fillRadio() {
            if (this.radio === '0') {
                this.Receiptlist = useDataStore().getReceiptList
            }
            else if (this.radio === '1') {
                this.Receiptlist = useDataStore().getReceiptList
                this.Receiptlist = this.Receiptlist.filter(item => item.owe === 0)
            }
            else {
                this.Receiptlist = useDataStore().getReceiptList
                this.Receiptlist = this.Receiptlist.filter(item => item.owe > 0)
            }
        },
        async getReceiptAll() {
            // this.Receiptlist = await ReceiptsService.getAll()
            var receipt = await ReceiptsService.getAll()
            useDataStore().updateReceipt(receipt)
            this.Receiptlist = useDataStore().getReceiptList
        }
    },
    mounted() {
        this.getReceiptAll()

        // console.log
        console.log(this.Receiptlist)
    }
}
</script>