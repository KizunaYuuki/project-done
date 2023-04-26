<template >
    <div class="container bg-white rounded">
        <div class="row m-2">
            <div class="col-10 d-flex align-items-center text-uppercase fs-6 fw-bold">Sổ địa chỉ</div>
            <RouterLink class="col-sm btn btn-danger" to="/acc/address/add"><button>Thêm địa chỉ mới</button></RouterLink>
        </div>
        <div class="row m-2">
            <div class="col-sm">
                <div class="text-uppercase fw-semibold">Địa chỉ mặc định</div>
                <div class="m-2" v-for="addressDefault in addressDefault">
                    <div>{{ addressDefault.name }}</div>

                    <div>{{ addressDefault.streetName }}</div>
                    <div>
                        {{ addressDefault.ward }},
                        {{ addressDefault.district }},
                        {{ addressDefault.city }}
                    </div>
                    <div>{{ addressDefault.phone }}</div>
                    <router-link style="color: red ; font-weight: 500;"
                        :to="{ name: 'AddressEditVue', params: { id: addressDefault._id } }">Sửa địa chỉ </router-link>

                </div>

            </div>
            <div class="col-sm">
                <div class="text-uppercase fw-semibold">Địa chỉ khác</div>
                <div class="m-2" v-for="address in addresses" :key="address._id">

                    <div>{{ address.name }}</div>

                    <div>{{ address.streetName }}</div>
                    <div>
                        {{ address.ward }},
                        {{ address.district }},
                        {{ address.city }}
                    </div>
                    <div>{{ address.phone }}</div>
                    <div class="fw-semibold d-flex flex-row ">
                        <div class=" border-end pe-2"><router-link style="color: red !important; font-weight: 500;"
                                :to="{ name: 'AddressEditVue', params: { id: address._id } }">Sửa địa chỉ </router-link>
                        </div>
                        <div class=" ps-2" @click="openDialog(address._id)" style="color: #646464; font-weight: 500;">Xóa
                            địa
                            chỉ</div>
                    </div>

                    <v-dialog v-model="dialog" persistent max-width="400">
                        <v-card>
                            <v-card-title class="headline">Bạn có muốn xóa địa chỉ không?</v-card-title>
                            <v-card-text>
                                Hành động này không thể hoàn trả
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="green darken-1"
                                    @click="dialog = false; deleteAddress(this.selectedAddressId)">Vâng</v-btn>
                                <v-btn color="red darken-1" text @click="dialog = false">Không</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>


                </div>
            </div>
        </div>
    </div>
    <v-snackbar v-model="snackbar" :timeout="timeout">
        Cập nhật thành công

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>
<style>
/* @media screen and (max-width: 767px) {
   .test:not(.mobile) {
      
      color: blue !important;
      display: block;
   }
} */
/* Media query cho điện thoại */
/* @media (max-width: 576px) {
  
  .address-buttons .col-3 {
    flex-basis: 50%;
  }
} */
</style>
<script >
import axios from "axios";
import { useDataStore } from '@/stores/dataStores';
import { RouterLink } from "vue-router";
import addressService from "../services/addresses.service"
export default {
    data: () => {
        return {
            addressDefault: [],
            addresses: [],
            dialog: false,
            snackbar: useDataStore().getSnackbar,
            timeout: 2000,
            selectedAddressId: null,
        };
    },
    computed: {
        isMobile() {
            return window.innerWidth <= 767;
        }
    },
    mounted() {
        this.getAddress1()
        if (useDataStore().getSnackbar == true) {
            let seconds = this.timeout / 1000;
            // hiển thị số giây ban đầu
            console.log(seconds);
            // thiết lập hàm đếm ngược
            const intervalId = setInterval(() => {
                // giảm số giây đi 1
                seconds--;
                // kiểm tra nếu số giây bằng 0 thì dừng hàm đếm ngược
                if (seconds === 0) {
                    clearInterval(intervalId);
                    useDataStore().setSnackbar(false)
                }
            })
        }
    },
    methods: {
        async getAddress1() {
            this.addresses = await addressService.getAll()
            // useDataStore().getAPIAddress(this.address.filter(item => item._idUser == useDataStore().getUser._id));
            useDataStore().getAPIAddress(this.addresses.filter(item => item._idUser == localStorage.getItem('_id')));
            this.addresses = useDataStore().getAddress.filter(item => item.default == false);
            this.addressDefault = useDataStore().getAddress.filter(item => item.default == true);
        },
        async deleteAddress(id) {
            await addressService.delete(id);

            this.addresses = await addressService.getAll()
            useDataStore().getAPIAddress(this.addresses.filter(item => item._idUser == localStorage.getItem('_id')));
            this.addresses = useDataStore().getAddress.filter(item => item.default == false);
            this.addressDefault = useDataStore().getAddress.filter(item => item.default == true);

        },
        openDialog(addressId) {
            this.selectedAddressId = addressId;
            this.dialog = true;
        },
    },
    components: { RouterLink }
};



</script>
<style></style>