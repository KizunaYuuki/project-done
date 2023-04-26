<template>
    <section>
        <div>
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-md-9 col-lg-6 col-xl-5">
                    <img src="https://ssl.gstatic.com/accounts/signup/glif/account.svg" class="img-fluid"
                        alt="Sample image">
                </div>
                <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1 pt-4 rounded-2" style="background-color: #ffffff;">
                    <div
                        class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start text-white">
                        <p class="lead fw-normal mb-0 me-3 text-dark">Đăng nhập với</p>
                        <button type="button" class="btn btn-primary btn-floating mx-1">
                            <i class="fab fa-facebook-f"></i>
                        </button>

                        <button type="button" class="btn btn-primary btn-floating mx-1">
                            <i class="fab fa-twitter"></i>
                        </button>

                        <button type="button" class="btn btn-primary btn-floating mx-1">
                            <i class="fab fa-linkedin-in"></i>
                        </button>
                    </div>

                    <div class="divider d-flex align-items-center mt-4">
                        <p class="text-center fw-bold mx-3 mb-0">Hoặc</p>
                    </div>

                    <Form class="container-fluid form pb-5 rouded-2" @submit="submitLogin" :validation-schema="adminSchema">
                        <div class="row">
                            <!-- <div class="col"></div> -->
                            <div class="col rounded-4 rounded-top-1 pb-1 m-2">

                                <!-- Đăng nhập  -->
                                <div class="form-group form-floating mb-6 text-center">
                                    <div class="fw-bold fs-5 text-danger py-3">Book Store</div>
                                    <div class="fw-bold fs-4">Đăng Nhập</div>
                                    <small>Sử dụng tài khoản người quản trị</small>
                                </div>

                                <!-- name -->
                                <hr class="text-danger mb-6" />
                                <div class="form-group form-floating mb-6">
                                    <Field name="name" type="text" class="form-control" placeholder="Tên"
                                        v-model="admin.name" />
                                    <label for="name">Tên</label>
                                    <ErrorMessage name="name" class="error-feedback" />
                                </div>

                                <!-- password -->
                                <div class="form-group mb-6">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <Field name="password" v-bind:type="showPassword ? 'text' : 'password'"
                                                class="form-control" placeholder="Mật khẩu" v-model="admin.password" />
                                            <label for="password">Mật khẩu</label>
                                        </div>
                                        <span @click="showPasswordF" class="input-group-text user-select-none">{{
                                            msgShowPassword }}</span>
                                    </div>
                                    <ErrorMessage name="password" class="error-feedback" />
                                </div>

                                <div class="d-flex justify-content-between align-items-center mb-6">
                                    <!-- Checkbox -->
                                    <div class="form-check mb-0">
                                        <input class="form-check-input me-2" type="checkbox" value=""
                                            id="remembermeAdmin" />
                                        <label class="form-check-label" for="remembermeAdmin">
                                            Nhớ tôi
                                        </label>
                                    </div>
                                    <!-- <a href="#!" class="text-body">Quên mật khẩu?</a> -->
                                </div>

                                <!-- login -->
                                <div class="form-group text-center">
                                    <button type="submit" class="btn btn-primary text-white">Đăng nhập</button>
                                    <!-- <p class="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="#!"
                                            class="link-danger">Register</a></p> -->
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import AdminsService from '@/services/admins.service';
import { useDataStore } from '../stores/dataStores';
import { toast } from 'vue3-toastify';
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const adminSchema = yup.object().shape({
            name: yup
                .string()
                .required("Tên bắt buộc phải có")
                .min(3, "Tên phải có ít nhất 3 ký tự")
                .max(30, "Tên chứa nhiều nhất 30 ký tự"),
            password: yup
                .string()
                .required("Mật khẩu bắt buộc phải có")
                .min(3, "Mật khẩu phải có ít nhất 3 ký tự")
                .max(24, "Mật khẩu chứa nhiều nhất 30 ký tự"),
        });
        // Đinh nghĩa thông báo nổi 
        const notifyLoginError = () => {
            toast("Nhập tên hoặc mật khẩu không đúng", {
                autoClose: 1500,
                limit: 1,
                type: toast.TYPE.ERROR,
                multiple: false,
                hideProgressBar: true
            });
        };
        return {
            showPassword: false,
            msgShowPassword: 'Hiển thị',
            admin: {
                type: Object, required: true
            },
            adminSchema,
            cookies: {},
            notifyLoginError: notifyLoginError
        }
    },
    methods: {
        // Show or hire password
        showPasswordF() {
            if (this.showPassword === false) {
                this.showPassword = true
                this.msgShowPassword = 'Ẩn'
            } else {
                this.showPassword = false
                this.msgShowPassword = 'Hiển thị'
            }
        },
        async submitLogin() {
            try {
                let temp = await AdminsService.login(this.admin);
                if (temp === false)
                    this.notifyLoginError();
                else {
                    this.cookies = await AdminsService.getCookies();
                    // Lưu vào store
                    useDataStore().setAdmin(this.cookies);
                    console.log(this.cookies);
                    // Lưu vào localStorage 
                    localStorage.setItem('admin', this.cookies.name)
                    console.log("Admin: " + localStorage.getItem('admin'))
                    localStorage.setItem('_idAdmin', this.cookies._id)
                    console.log("Admin: " + localStorage.getItem('_idAdmin'))
                    // Chuyển hướng về trang của Admin
                    // this.$router.push('/Products');
                    // window.location.href = "http://localhost:3001/";
                    this.$router.push('/');
                }
            } catch (error) {
                console.log(error);
            }
        },

        // Đăng xuất
        async logout() {
            try {
                // Xoá thông tin user từ cookies
                await AdminsService.logout();
                // Xoá thông tin user từ store
                useDataStore().setAdmin([]);
                // Xoá thông tin user từ localStorage
                localStorage.removeItem("admin");
                localStorage.removeItem("_idAdmin")
                // Chuyển hướng về HomePage
                this.$router.push('/Products');
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>
<style scoped>
.form {
    max-width: 400px;
}

.divider:after,
.divider:before {
    content: "";
    flex: 1;
    height: 1px;
    background: #eee;
}

.h-custom {
    height: calc(100% - 73px);
}

@media (max-width: 450px) {
    .h-custom {
        height: 100%;
    }
}

section {
    background:
        linear-gradient(217deg, #0196fa, rgba(255, 0, 0, 0) 70.71%),
        linear-gradient(127deg, #fffefa, rgba(0, 255, 0, 0) 70.71%),
        linear-gradient(336deg, #ffb07e, rgba(0, 0, 255, 0) 70.71%);
}
</style>
