<template>
    <!-- Button trigger modal -->
    <!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Login
    </button> -->

    <!-- Modal -->
    <div class="modal fade" id="LoginUserModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <!-- position-absolute top-50 start-50 translate-middle -->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <Form class="container form pb-5" @submit="submitLogin" :validation-schema="userSchema">
                        <div class="row">
                            <div class="col">

                                <!-- Đăng nhập  -->
                                <div class="form-group form-floating mb-6 text-center">
                                    <div class="fw-bold fs-6 text-danger py-3">Book Store</div>
                                    <div class="fw-bold fs-5">Đăng Nhập</div>
                                    <small>Sử dụng tài khoản người mua</small>
                                </div>

                                <!-- phone -->
                                <div class="form-group form-floating mb-6">
                                    <Field name="phone" type="text" class="form-control" placeholder="Số điện thoại"
                                        v-model="user.phone" />
                                    <label for="phone">Số điện thoại</label>
                                    <ErrorMessage name="phone" class="error-feedback" />
                                </div>

                                <!-- password -->
                                <div class="form-group mb-6">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <Field name="password" v-bind:type="showPassword ? 'text' : 'password'"
                                                class="form-control" placeholder="Mật khẩu" v-model="user.password" />
                                            <label class="fs-6" for="password">Mật khẩu</label>
                                        </div>
                                        <!-- Sau khi xử lý summit sẽ đổi thành button  -->
                                        <span @click="showPasswordF" class="input-group-text user-select-none">{{
                                            msgShowPassword }}</span>
                                    </div>
                                    <!-- <p class="fw-lighter">Sử dụng 4 ký tự trở lên</p> -->
                                    <ErrorMessage name="password" class="error-feedback" />
                                </div>

                                <!-- Chưa xử lý  -->
                                <div class="d-flex justify-content-between align-items-center mb-6">
                                    <!-- Checkbox -->
                                    <div class="form-check mb-0">
                                        <input class="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                                        <label class="form-check-label" for="form2Example3">
                                            Nhớ tôi
                                        </label>
                                    </div>
                                    <router-link class="text-body" to="#">Quên mật khẩu?</router-link>
                                </div>

                                <!-- login -->
                                <hr />
                                <div class="form-group fs-6 mb-2 d-flex justify-content-between">
                                    <router-link class="btn btn-outline-primary" to="/UserRegister">Tạo tài
                                        khoản</router-link>
                                    <button type="submit" class="btn btn-primary text-white">Đăng nhập</button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import here
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import UsersService from '@/services/users.service';
import { useDataStore } from '../stores/dataStores';
import axios from 'axios';
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const userSchema = yup.object().shape({
            password: yup
                .string()
                .required("Mật khẩu bắt buộc phải có")
                .min(3, "Mật khẩu phải có ít nhất 3 ký tự")
                .max(24, "Mật khẩu chứa nhiều nhất 30 ký tự"),
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
        const notifyLoginError = () => {
            toast("Mật khẩu hoặc số điện thoại không đúng", {
                autoClose: 1500,
                limit: 1,
                type: toast.TYPE.ERROR,
                multiple: false,
                hideProgressBar: true
            });
        };

        const notifyLoginBlock = () => {
            toast("Tài khoản này đã bị khoá, liên hệ Quản trị viên để được hỗ trợ", {
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
            notifyLoginError: notifyLoginError,
            notifyLoginBlock: notifyLoginBlock,
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
        // Đăng nhập người dùng
        async submitLogin() {
            try {
                let temp = await UsersService.login(this.user);
                if (temp === false)
                    this.notifyLoginError();
                else {
                    this.cookies = await UsersService.getCookies();

                    // Kiểm tài khoản - có bị khoá hay không 
                    if (this.cookies.statusUser === false) {
                        this.notifyLoginBlock();
                        this.user.phone = '';
                        this.user.name = '';
                        this.user.password = '';
                        return 0;
                    }

                    // Lưu vào store
                    useDataStore().setUser(this.cookies);
                    console.log(useDataStore().getUser);

                    // Lưu vào localStorage 
                    localStorage.setItem('name', this.cookies.name)
                    console.log("User: " + localStorage.getItem('name'))
                    localStorage.setItem('_id', this.cookies._id)
                    console.log("id_ " + localStorage.getItem('_id'))

                    // Chuyển hướng về HomePage 
                    // this.$router.push('/');
                    window.location.href = "http://localhost:3001/";
                }
            } catch (error) {
                console.log(error);
            }
        },

        // Đăng xuất 
        async logout() {
            try {

                // Xoá thông tin user từ cookies
                await UsersService.logout();

                // Xoá thông tin user từ store
                useDataStore().setUser([]);

                // Xoá thông tin user từ localStorage
                localStorage.removeItem("name");
                localStorage.removeItem("_id");

                // Xoá giỏ hàng
                await axios
                    .get(`http://localhost:3000/cookies/clear`, {
                        withCredentials: true
                    })
                    .then((response) => {
                        console.log(response)
                    })

                // Chuyển hướng về HomePage
                // this.$router.push('/');
                window.location.href = "http://localhost:3001/";
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>
<style scoped>
.form {
    max-width: 350px;
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

header::before {
    display: none;
}

footer::before {
    display: none;
}
</style>
