<template >
    <div v-if="load" class="container mt-2 bg-white rounded">
        <div class=" pt-2 text-uppercase fs-6 fw-bold">Thông tin tài khoản </div>
        <Form @submit="submitContact" :validation-schema="contactFormSchema">
            <div class="row g-3 m-2 form-group">
                <div class="col-2">
                    <label for="name" class="col-form-label">Họ và Tên</label>
                </div>
                <div class="col-7">
                    <Field name="name" type="text" id="name" class="form-control" v-model="user.name" />
                    <ErrorMessage name="name" class="error-feedback" />
                </div>
            </div>
            <div class="row g-3 m-2 form-group">
                <div class="col-2">
                    <label for="phone" class="col-form-label">Số điện thoại</label>
                </div>
                <div class="col-7">
                    <Field name="phone" type="tel" id="phone" class="form-control" v-model="user.phone" />
                    <ErrorMessage name="phone" class="error-feedback" />
                </div>
            </div>
            <div class="row g-3 m-2 form-group">
                <div class="col-2">
                    <label for="sex" class="col-form-label">Giới tính</label>
                </div>
                <div class="col-7">

                    <Field type="radio" class="radio px-2" name="sex" :value=true id="1" v-model="user.sex" />
                    <label class="px-2" for="1">Nam</label>
                    <Field type="radio" class="radio px-2" name="sex" :value=false id="0" v-model="user.sex" />
                    <label class="px-2" for="0">Nữ</label>
                    <ErrorMessage name="sex" class="error-feedback" />
                </div>
            </div>
            <div class="row g-3 m-2 form-group">
                <div class="col-2">
                    <label for="dateOfBirth" class="col-form-label">Ngày sinh</label>
                </div>
                <div class="col-7">
                    <Field name="dateOfBirth" type="date" id="dateOfBirth" class="form-control"
                        v-model="user.dateOfBirth" />
                    <ErrorMessage name="dateOfBirth" class="error-feedback" />
                </div>
            </div>
            <div class="form-group row align-items-cente">
                <div class="align-items-center d-flex justify-content-center ">
                    <button style="background-color: red; border: none; margin: auto; " class="btn btn-primary m-2">Lưu thay
                        đổi</button>
                </div>
            </div>

        </Form>
    </div>
    <v-snackbar v-model="snackbar" :timeout="timeout">
        cập nhật thành công

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>
<style>
@media (max-width: 912px) {

    .col-2 {
        flex-basis: 100%;
    }

    .col-7 {
        flex-basis: 100%;

    }
}
</style>
<script>
import UsersService from "../services/users.service"
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:user"],

    data() {
        const contactFormSchema = yup.object().shape({
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
            sex: yup
                .boolean()
                .oneOf([true, false], 'Bạn phải chọn giới tính'),
            dateOfBirth: yup
                .date()
                .required("Ngày sinh phải có giá trị.")
                .min(new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000), "Bạn phải nhập ngày sinh hợp lệ.")
                .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), "Bạn phải nhập ngày sinh hợp lệ."),


        });
        return {
            // Chúng ta sẽ không muốn hiệu chỉnh props, nên tạo biến cục bộ
            // contactLocal để liên kết với các input trên form
            snackbar: false,
            timeout: 2000,
            contactFormSchema,
            sex: false,
            dateOfBirth: "",
            user: {},
            name: "",
            phone: "",
            load: false

        };

    },

    mounted() {

        this.getUser()

    },
    methods: {
        async submitContact() {
            this.$emit("submit:user");
            await UsersService.updateUser(localStorage.getItem("_id"), this.user)
            this.snackbar = true

        },
        async getUser() {
            this.user = await UsersService.get(localStorage.getItem("_id"))
            this.load = true
            this.name = this.user.name,
                this.phone = this.user.phone,
                this.dateOfBirth = this.user.dateOfBirth
            this.sex = this.user.sex

        }

    },
};
</script>