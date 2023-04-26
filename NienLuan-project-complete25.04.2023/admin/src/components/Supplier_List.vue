<template>
    <div>
        <div class="d-flex " style="margin: 0 auto;align-items: center;">
            <div class="">
                <v-dialog transition="dialog-top-transition" width="60%">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" style="width: 0; ;;font-size: larger;font-weight: 600;" v-bind="props"><i
                                class="fas fa-solid fa-user-plus"></i></v-btn>
                    </template>
                    <template v-slot:default="{ isActive }">
                        <v-card>
                            <v-toolbar color="primary" title="Thêm nhà cung cấp mới"></v-toolbar>
                            <v-form @submit.prevent>
                                <v-card-text>
                                    <div style="display: flex;align-items: center;">
                                        <!-- <div style="font-size: xx-large; margin-right: 20px;"><i
                                                class="fa-solid fa-user-tie"></i></div> -->
                                        <v-text-field ref="nameSupplier" :rules="rules" label="Tên nhà cung cấp"
                                            prepend-icon="fa:fas fa-solid fa-user-tie"></v-text-field>
                                    </div>

                                    <div style="display: flex;align-items: center;">
                                        <!-- <div style="font-size: xx-large; margin-right: 20px;"><i
                                                class="fas fa-solid fa-location-dot"></i></div> -->
                                        <!-- <v-text-field ref="addressSupplier" :rules="rules"
                                            label="Địa chỉ nhà cung cấp"></v-text-field> -->
                                        <v-text-field label="Địa chỉ nhà cung cấp" ref="addressSupplier" :rules="rules"
                                            prepend-icon="fa:fas fa-solid fa-location-dot"></v-text-field>
                                    </div>

                                    <div style="display: flex;align-items: center;">
                                        <!-- <div style="font-size: xx-large; margin-right: 11px;"><i
                                                class="fas fa-solid fa-phone"></i></div> -->
                                        <v-text-field type="number" ref="phone" :rules="rules0"
                                            label="Số liên lạc nhà cung cấp"
                                            prepend-icon="fa:fas fa-solid fa-phone"></v-text-field>
                                    </div>
                                </v-card-text>
                                <v-card-actions class="justify-end">
                                    <v-btn variant="text" @click="isActive.value = false">Đóng</v-btn>
                                    <v-btn variant="text" type="submit" @click="addSupplierNew">Lưu</v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </template>
                </v-dialog>
            </div>
            <div style="padding: 5px;width: 100%; ">
                <v-text-field list="datalistOptions2" append-inner-icon="mdi-magnify" ref="search" @change="search1"
                    label="Tìm kiếm theo số điện thoại hoặc tên" style="width: 100%;"></v-text-field>
                <!-- <v-text-field list="datalistOptions2" @input="search" ref="search" append-inner-icon="mdi-magnify"
                    ></v-text-field> -->
                <datalist id="datalistOptions2">
                    <option v-for="item in list" :key="item._id" :value="item._id">{{ item.supplierPhone }} | {{
                        item.supplierName
                    }}</option>
                </datalist>
            </div>
        </div>

        <h5 class="text-uppercase text-center" style="color: blue;">Danh sách nhà cung cấp</h5>
        <v-table fixed-header>
            <thead>
                <tr>
                    <th class="text-left">STT</th>
                    <th class="text-left">Tên nhà cung cấp</th>
                    <th class="text-left">Địa chỉ</th>
                    <th class="text-left">Số điện thoại</th>
                    <th class="text-left">Sửa/Xóa</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="( item, index) in list" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.supplierName }}</td>
                    <td>{{ item.supplierAddress }}</td>
                    <td>{{ item.supplierPhone }}</td>
                    <td>
                        <v-dialog transition="dialog-top-transition" width="60%">
                            <template v-slot:activator="{ props }">
                                <span style="margin-right: 5px;" type="button" v-bind="props" class="badge bg-warning"><i
                                        class="fas fa-regular fa-pen-to-square"></i></span>
                            </template>
                            <template v-slot:default="{ isActive }">
                                <v-card>
                                    <v-toolbar color="primary" title="Cập nhật nhà cung cấp"></v-toolbar>
                                    <v-form @submit.prevent>
                                        <v-card-text>
                                            <div style="display: flex;align-items: center;">
                                                <div style="font-size: xx-large; margin-right: 20px;"><i
                                                        class="fa-solid fa-user-tie"></i></div>
                                                <v-text-field ref="name1" id="name" v-model="item.supplierName"
                                                    :rules="rules" label="Tên nhà cung cấp"></v-text-field>
                                            </div>

                                            <div style="display: flex;align-items: center;">
                                                <div style="font-size: xx-large; margin-right: 20px;"><i
                                                        class="fas fa-solid fa-location-dot"></i></div>
                                                <v-text-field id="address" ref="address" v-model="item.supplierAddress"
                                                    :rules="rules" label="Địa chỉ nhà cung cấp"></v-text-field>
                                            </div>

                                            <div style="display: flex;align-items: center;">
                                                <div style="font-size: xx-large; margin-right: 20px;"><i
                                                        class="fas fa-solid fa-phone"></i></div>
                                                <v-text-field id="phone" type="number" ref="phones"
                                                    v-model="item.supplierPhone" :rules="rules0"
                                                    label="Số liên lạc nhà cung cấp"></v-text-field>
                                            </div>
                                        </v-card-text>
                                        <v-card-actions class="justify-end">
                                            <v-btn variant="text" @click="isActive.value = false">Đóng</v-btn>
                                            <v-btn variant="text" type="submit" @click="updateSupplier(item)">Lưu</v-btn>
                                        </v-card-actions>
                                    </v-form>
                                </v-card>
                            </template>
                        </v-dialog>

                        <span type="button" @click="deleteSupplier(item._id, item.supplierName)"
                            class="badge bg-danger">X</span>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { useDataStore } from '../stores/dataStores';
import SuppliersService from '../services/suppliers.service';
export default {
    data() {
        return {
            list: useDataStore().getSupllierList,
            radio: '',
            rules: [
                value => {
                    if (value) return true
                    return 'Bạn chưa nhập giá trị.'
                },
            ],
            rules0: [
                value => {
                    if (value?.length == 10) {
                        return true
                    }
                    else if (value?.length < 10 || value?.length > 10) {
                        return 'Bạn chưa nhập đủ 10 số.'
                    }
                    return 'Bạn chưa nhập giá trị.'
                },
            ],

        }
    },
    methods: {
        search1() {

            if (this.$refs.search.value === '') {
                this.list = useDataStore().getSupllierList
            }
            else {

                this.list = this.list.filter(item => item._id === this.$refs.search.value)
            }

            // console.log(this.$refs.search.value)
        },
        async deleteSupplier(id, name) {
            if (confirm('Bạn muốn xóa nhà cung cấp ' + name)) {
                try {
                    var genres = await SuppliersService.delete(id)
                    toast.success("Xóa thành công", {
                        transition: toast.TRANSITIONS.SLIDE,
                    });
                    console.log(genres);
                    var data = await SuppliersService.getAll()
                    useDataStore().updateSuppliers(data)
                    this.list = useDataStore().getSupllierList
                }
                catch (error) {
                    console.log(error);
                }
            }
        },
        async addSupplierNew() {
            if (this.$refs.nameSupplier.value !== '' && this.$refs.addressSupplier.value !== '' && this.$refs.phone.value?.length === 10) {
                var kq = await SuppliersService.create({ supplierName: this.$refs.nameSupplier.value, supplierAddress: this.$refs.addressSupplier.value, supplierPhone: this.$refs.phone.value })
                toast.success("Thêm thành công!", {
                    transition: toast.TRANSITIONS.SLIDE,
                });
                console.log(kq)
                var data = await SuppliersService.getAll()
                useDataStore().updateSuppliers(data)
                this.list = useDataStore().getSupllierList

            }
        },
        async updateSupplier(item) {
            var name = document.getElementById('name').value
            var address = document.getElementById('address').value
            var phone = document.getElementById('phone').value
            if (name !== '' && address !== '' && phone?.length === 10) {
                var result = await SuppliersService.update(item._id, { supplierName: name, supplierAddress: address, supplierPhone: phone })
                console.log(result)
                if (result) {
                    toast.success("Cập nhật thành công!", {
                        transition: toast.TRANSITIONS.SLIDE,
                    });
                    var data = await SuppliersService.getAll()
                    useDataStore().updateSuppliers(data)
                    this.list = useDataStore().getSupllierList
                }
            }
        }
    },
    mounted() {
        this.list = useDataStore().getSupllierList
    }
}
</script>