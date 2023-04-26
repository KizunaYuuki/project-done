<template class="col-sm">
    <div class="container bg-white rounded ps-5">
        <div class="text-uppercase fw-semibold"> Thêm địa chỉ mới</div>
        <AddressAccEdit @form-submitted="addAddress" />
        <!-- <button class="btn" @click="submitForm">Submit</button> -->
    </div>
</template>
<script >
import AddressAccEdit from './AddressForm.vue';
import axios from 'axios';
import { useDataStore } from '../stores/dataStores';
import AddressesService from '../services/addresses.service';
export default {
    components: {
        AddressAccEdit,
    },
    data() {
        return {
            address: {},
            addressEdit: useDataStore().getAddress.filter(address => address._id == this.$route.params.id),
            idDefault: useDataStore().getAddress.filter(i => i.default == true),
        }
    },

    methods: {
        async addAddress(formData) {
            if (useDataStore().getAddress == '') {
                await this.loadData()
                this.addressEdit = useDataStore().getAddress.filter(address => address._id == this.$route.params.id)
                this.idDefault = useDataStore().getAddress.filter(i => i.default == true)
            }

            //Nêu chọn địa chỉ mặc định
            if (formData.default == true) {
                //Đếm xem có bao nhiêu địa chỉ mặc đinh (đề phòng lỗi)
                let countDefault = Object.keys(this.idDefault).length
                //Nếu đã c0 địa chỉ mặc định
                if (this.idDefault != "") {
                    //gán địa chỉ mặc định có sẵn thành false
                    for (let i = 0; i < countDefault; i++) {
                        await AddressesService.update(this.idDefault[i]._id, { default: false })
                    }

                }
            }
            //Tạo địa chỉ
            await AddressesService.create(formData)
            console.log(JSON.stringify(formData))
            useDataStore().setSnackbar(true)
            this.$router.push({ name: "AddressAcc" })
        },
        async loadData() {
            useDataStore().getAPIAddress(await AddressesService.getAll())
            console.log("load Address useDataStore ok")
        }
        // submitForm() {
        //     this.$refs.AddressAccEdit.submitAddress()
        // }
    }
}
</script>