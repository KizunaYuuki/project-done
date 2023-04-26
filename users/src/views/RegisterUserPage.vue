<template>
    <section class="vh-100 mx-2">
        <div class="container-fluid h-custom">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-md-9 col-lg-6 col-xl-5">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        class="img-fluid" alt="Sample image">
                </div>
                <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1 pt-4 rounded-2" style="background-color: #ffffff;">
                    <div
                        class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start text-white">
                        <p class="lead fw-normal mb-0 me-3 text-dark">Đăng ký với</p>
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

                    <Form class="container form pb-5" @submit="submitRegister" :validation-schema="userSchema"
                        style="border-radius: 9999px; background-color: white;">
                        <div class="row">
                            <div class="col rounded-4 rounded-top-1 pb-1" style="background-color: white;">
                                <!-- Đăng ký  -->
                                <div class="form-group form-floating mb-6 text-center">
                                    <div class="fw-bold fs-6 text-danger py-3">Book Store</div>
                                    <div class="fw-bold fs-5">Đăng ký</div>
                                    <small>Đăng ký tài khoản người mua</small>
                                </div>
                                <!-- phone -->
                                <div class="form-group form-floating mb-6">
                                    <Field name="phone" type="text" class="form-control" placeholder="Số điện thoại"
                                        v-model="user.phone" />
                                    <label for="phone">Số điện thoại</label>
                                    <ErrorMessage name="phone" class="error-feedback" />
                                </div>
                                <!-- name -->
                                <div class="form-group form-floating mb-6">
                                    <Field name="name" type="text" class="form-control" placeholder="Tên"
                                        v-model="user.name" />
                                    <label class="fs-6" for="name">Tên</label>
                                    <ErrorMessage name="name" class="error-feedback" />
                                </div>
                                <!-- password -->
                                <div class="form-group mb-6">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <Field name="password" v-bind:type="showPassword ? 'text' : 'password'"
                                                class="form-control" placeholder="Mật khẩu" v-model="user.password" />
                                            <label class="fs-6" for="password">Mật khẩu</label>
                                        </div>
                                        <span @click="showPasswordF" class="input-group-text user-select-none">{{
                                            msgShowPassword }}</span>
                                    </div>
                                    <ErrorMessage name="password" class="error-feedback" />
                                </div>
                                <!-- password confirm -->
                                <div class="form-group mb-6">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <Field name="comfirmpassword" v-bind:type="showPassword ? 'text' : 'password'"
                                                class=" form-control" placeholder="Xác nhận mật khẩu" />
                                            <label class="fs-6" for="comfirmpassword">Xác nhận mật khẩu</label>
                                        </div>
                                        <span @click="showPasswordF" class="input-group-text user-select-none">{{
                                            msgShowPassword }}</span>
                                    </div>
                                    <ErrorMessage name="comfirmpassword" class="error-feedback" />
                                </div>

                                <!-- sex -->
                                <div v-show="true" class="form-group form-floating mb-6">
                                    <select required class="form-select" aria-label="" v-model="user.sex">
                                        <option :value=undefined selected>Chọn giới tính</option>
                                        <option :value='true'>Nam</option>
                                        <option :value='false'>Nữ</option>
                                    </select>
                                    <label class="fs-6" for="sex">Giới tính</label>
                                </div>

                                <!-- birthday -->
                                <div class="form-group form-floating mb-6">
                                    <Field name="birthday" type="date" class="form-control" placeholder="Tên"
                                        v-model="user.dateOfBirth" />
                                    <label class="fs-6" for="birthday">Ngày Sinh</label>
                                    <ErrorMessage name="birthday" class="error-feedback" />
                                </div>

                                <!-- register -->
                                <hr />
                                <div class="form-group fs-6 mb-2 d-flex justify-content-between">
                                    <router-link class="btn btn-outline-primary" to="/UserLogin">Đăng nhập</router-link>
                                    <!-- Lỗi khi sử dụng @click thay vì type='submit' -->
                                    <button type="submit" class="btn btn-primary text-white">Tạo tài khoản</button>
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
// import here
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import UsersService from '@/services/users.service';
import { useDataStore } from '../stores/dataStores';
import { toast } from 'vue3-toastify';
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        // Lượt đồ user, kiểm tra đầu vào của form 
        const userSchema = yup.object().shape({
            dateOfBirth: yup
                .date(),
            name: yup
                .string()
                .required("Tên phải bắt buộc phải có")
                .min(3, "Tên phải có ít nhất 3 ký tự")
                .max(30, "Tên chứa nhiều nhất 30 ký tự"),
            password: yup
                .string()
                .required("Mật khẩu bắt buộc phải có")
                .min(3, "Mật khẩu phải có ít nhất 3 ký tự")
                .max(24, "Mật khẩu chứa nhiều nhất 30 ký tự"),
            comfirmpassword: yup
                .string()
                .required('Hãy nhập mật khẩu lần nữa')
                .oneOf([yup.ref('password')], 'Mật khẩu không trùng khớp.'),
            registerDate: yup
                .date(),
            sex: yup
                .boolean(),
            phone: yup
                .string()
                .required("Số điện thoại bắt buộc phải có")
                .matches(
                    // /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    /((0)+([0-9])+([0-9]{8})\b)/g,
                    "Số điện thoại không hợp lệ."
                ),
        });
        // Đinh nghĩa thông báo nổi 
        const notifyPhoneExist = () => {
            toast("Số điện thoại đã được đăng ký, hãy sử dụng số khác", {
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
            user: {
                type: Object, required: true
            },
            userSchema,
            cookies: {},
            notifyPhoneExist: notifyPhoneExist
        }
    },
    methods: {
        // Ẩn và hiện mật khẩu trong input
        showPasswordF() {
            if (this.showPassword === false) {
                this.showPassword = true
                this.msgShowPassword = 'Ẩn'
            } else {
                this.showPassword = false
                this.msgShowPassword = 'Hiển thị'
            }

        },
        // Đăng ký người dùng
        async submitRegister() {
            try {
                // Nếu không có số điện thoại thì không submit
                if (!this.user.phone) {
                    return;
                }
                // Tạo user
                let temp = await UsersService.create(this.user);
                // Thông báo nếu số điện thoai đã tồn tại
                if (temp === false)
                    this.notifyPhoneExist();
                // alert('Số điện thoại đã được sử dụng');
                else {
                    this.cookies = await UsersService.getCookies();
                    // Lưu vào localStorage 
                    localStorage.setItem('name', this.cookies.name)
                    console.log("User: " + localStorage.getItem('name'))
                    localStorage.setItem('_id', this.cookies._id)
                    console.log("id_ " + localStorage.getItem('_id'))
                    // Lưu vào store
                    useDataStore().setUser(this.cookies);
                    console.log(this.cookies);
                    // Chuyển hướng về HomePage 
                    // this.$router.push('/');
                    window.location.href = "http://localhost:3001/";
                }
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
