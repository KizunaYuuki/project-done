<template class="col-sm">
    <Form @submit="submitAddress" :validation-schema="addressFormSchema">
        <div class="row ms-3">
            <div class="text-uppercase col-sm-6 ">
                Thông tin liên hệ

                <div class="input-group form-group flex-nowrap my-3">
                    <Field name="name" type="text" class="form-control" placeholder="Họ và Tên" v-model="name" />
                </div>
                <ErrorMessage name="name" class="error-feedback" />
                <div class="input-group form-group flex-nowrap my-3">
                    <Field name="phone" type="text" class="form-control" placeholder="Số điện thoại" v-model="phone" />
                </div>
                <ErrorMessage name="phone" class="error-feedback" />
            </div>
            <div class="col-sm ">
                ĐỊA CHỈ
                <div>
                    <div class="input-group form-group flex-nowrap my-3">
                        <Field name="street" type="text" class="form-control" placeholder="Đường, số nhà"
                            aria-describedby="addon-wrapping" v-model="streetName" />

                    </div>
                    <ErrorMessage name="street" class="error-feedback" />
                    <div>

                        <div class="form-group form-floating mb-2 my-3 flex-nowrap">
                            <select name="selection" v-model="indexCity" class="form-select"
                                aria-label="Default select example">
                                <option value="-1" selected>Chọn Tỉnh/Thành Phố </option>
                                <option v-for="(city, index) in citys" :value="index">{{ city.Name }}</option>
                            </select>
                            <label class="fs-6" for="floatingInput">Tỉnh/Thành Phố</label>
                            <ErrorMessage name="selection" />
                        </div>

                        <div class="form-group form-floating mb-2 my-3 flex-nowrap">
                            <select v-model="indexDistrict" class="form-select" aria-label="Default select example">
                                <option value="-1" selected>Chọn Quận/Huyện</option>
                                <template v-if="get">
                                    <option v-for="(district, index) in Districts(indexCity)" :value="index">{{
                                        district.Name }}</option>
                                </template>
                            </select>

                            <label class="fs-6" for="floatingInput">Quận/Huyện</label>
                        </div>

                        <div class="form-group form-floating mb-2 my-3 flex-nowrap">
                            <select v-model="indexWard" class="form-select" aria-label="Default select example">
                                <option value="-1" selected>Chọn Phường/Xã</option>
                                <template v-if="get">
                                    <option v-for="(ward, index) in Wards(indexCity, indexDistrict)" :value="index">{{
                                        ward.Name }}</option>
                                </template>
                            </select>
                            <label class="fs-6" for="floatingInput">Phường/Xã</label>
                        </div>

                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckCheck" v-model="checkDefault"
                            :disabled='hidenCheck' :checked="hidenCheck">
                        <label class="form-check-label" for="flexCheckCheck">
                            Sử dụng làm địa chỉ mặc định
                        </label>
                    </div>
                    <div class="form-group row align-items-cente">
                        <div class="align-items-center col">
                            <button style="background-color: red; border: none; "
                                class="btn btn-primary float-end mb-2 my-3">Lưu địa chỉ</button>
                        </div>
                    </div>
                    <!-- <button @click.prevent="submitAddress" type="button" class="btn btn-danger float-end mb-2 my-3">Lưa địa
                        chỉ</button> -->
                </div>
            </div>
        </div>
    </Form>
</template>
<script >
import axios from "axios";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useDataStore } from "@/stores/dataStores";
import addressesService from "../services/addresses.service";


export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    props: {
        id: String,

        hidenCheck: {
            type: Boolean,
            default: false,
        },

    },
    data() {
        const addressFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            phone: yup
                .string()
                .required("Số điện thoại phải có giá trị.")
                .matches(
                    /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    "Số điện thoại không hợp lệ."),
            street: yup
                .string()
                .required("Đường số nhà phải có giá trị")
                .min(5, "Ít nhất 5 ký tự")
                .max(50, "Nhiều nhất 50 ký tự."),
            // selection: yup.number().required("Bạn phải chọn một Tỉnh/Thành Phố").integer("Giá trị phải là số nguyên").min(0, "Giá trị phải lớn hơn hoặc bằng 0")
            // selection: yup.string().trim().required("Bạn phải chọn một Tỉnh/Thành Phố").min(1, "Bạn phải chọn một Tỉnh/Thành Phố nafo dd")

        });
        return {
            citys: [], indexCity: -1,
            indexDistrict: -1,
            indexWard: -1,
            name: "",
            phone: "",
            checkDefault: false,
            streetName: "",
            check: false,
            addressAxios: '',
            addressFormSchema


        };
    },
    mounted() {
        axios
            .get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then((response) => {
                this.citys = response.data
            })
    },
    computed: {
        get() {
            if (this.indexCity !== -1) {
                if (this.indexDistrict === null) {
                    this.indexDistrict = -1
                }
            }
            return this.citys[this.indexCity]
        }
    },
    watch: {
        indexCity: function (newValue, oldValue) {

            this.indexCity = newValue;
            console.log(this.indexCity);
        },
        indexDistrict: function (newValue, oldValue) {
            this.indexDistrict = newValue;
            console.log(this.indexDistrict);
        },
        indexWard: function (newValue, oldValue) {
            this.indexWard = newValue
            console.log(this.indexWard);
        }
    },
    methods: {
        Districts(index) {
            return this.citys[index].Districts
        },
        Wards(indexCity, indexDistrict) {
            return this.citys[indexCity].Districts[indexDistrict]?.Wards
        },

        submitAddress() {

            this.$emit("form-submitted", {
                // _idUser: useDataStore().getUser._id,
                _idUser: localStorage.getItem('_id'),
                name: this.name,
                phone: this.phone,
                city: this.citys[this.indexCity].Name,
                district: this.citys[this.indexCity].Districts[this.indexDistrict].Name,
                ward: this.citys[this.indexCity].Districts[this.indexDistrict].Wards[this.indexWard].Name,
                streetName: this.streetName,
                default: document.getElementById("flexCheckCheck").checked,

            })
        },
        async setData(id) {

            var temp = useDataStore().getAddress.filter(item => item._id == id)
            if (temp == '') {
                console.log("axios user setData")
                var temp = [await addressesService.get(id)]
                console.log(temp)
            }
            await axios
                .get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
                .then((response) => {
                    this.addressAxios = response.data
                })
            this.streetName = temp[0].streetName
            this.phone = temp[0].phone
            this.name = temp[0].name
            this.default = temp[0].default
            for (let indexCity = 0; indexCity < this.addressAxios.length; indexCity++) {
                //Tìm tên thành phố trong CSDL so với data axios
                if (temp[0].city == this.addressAxios[indexCity].Name) {
                    //Lấy index của thành phố trùng khớp và gán lại vào form
                    this.indexCity = indexCity
                    let findCity = true //Đã tìm dc thành phố
                    console.log(this.addressAxios[indexCity].Name)
                    //Nếu đã tìm được thành phố
                    if (findCity) {
                        for (let indexDistrict = 0; indexDistrict < this.addressAxios[this.indexCity].Districts.length; indexDistrict++) {
                            //So sánh tên Quận trong CSDL với data axios
                            if (temp[0].district == this.addressAxios[this.indexCity].Districts[indexDistrict].Name) {
                                // Lấy index của quận r gán lại vào form
                                this.indexDistrict = indexDistrict
                                console.log(this.addressAxios[this.indexCity].Districts[indexDistrict].Name)
                                let findDistrict = true //Đã tìm được quận
                                //Nếu tìm được quận
                                if (findDistrict) {
                                    for (let indexWard = 0; indexWard < this.addressAxios[indexCity].Districts[indexDistrict].Wards.length; indexWard++) {
                                        //So sánh phường trong CSDL với data axios
                                        if (temp[0].ward == this.addressAxios[indexCity].Districts[indexDistrict].Wards[indexWard].Name) {
                                            //gán lại index của phường vào form
                                            this.indexWard = indexWard
                                            console.log(this.addressAxios[indexCity].Districts[indexDistrict].Wards[indexWard].Name)
                                            //Chạy đến đây thì thoát khỏi vòng lập
                                            return
                                        }

                                    }
                                }
                            }

                        }
                    }
                }
            }


        }
    }
};



</script>