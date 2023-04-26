<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    <nav class="navbar navbar-expand-lg bg-body-tertiary ">
        <div class="container">
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <router-link to="/" class="py-3 nav-link active fs-4 fw-bold text-danger font-monospace pe-2">
                BookStore
            </router-link>

            <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
                <ul class="navbar-nav me-auto mb-lg-0">
                    <li class="nav-item">
                        <router-link open-on-hover open-delay="10" close-delay="50" to="#" class="nav-link active px-3"
                            style="width: max-content;">
                            <Category />
                        </router-link>
                    </li>
                </ul>
                <!-- Tìm kiếm  -->
                <div class="bd-search pe-2 container-fluid">
                    <form class="d-flex" role="search" @submit.prevent="Submit">
                        <div class="input-group">
                            <input class="form-control" v-model="value" style="" type="search"
                                placeholder="Nhập tên sản phẩm" aria-label="Nhập tên sản phẩm" aria-describedby="browser"
                                list="browsers" name="browser" id="browser">
                            <!-- <datalist id="browsers">
                                <option :value="book" v-for="book in bookList" :key="book"></option>
                            </datalist> -->
                            <button id="searchbtn" class="btn border btn" @click="search"
                                style="border-color: #ced4da!important;" type="submit">Tìm
                                kiếm</button>
                        </div>
                    </form>
                </div>

                <div class="my-2" style="width: 90px; text-align: center;">
                    <router-link class="text-decoration-none link-dark btn-cart" to="/Cart">
                        <span id="span-cart">Giỏ hàng</span>
                    </router-link>
                </div>
                <div class="nav-item" style="width: 90px; text-align: center;">
                    <v-menu class="me-2" open-on-hover open-delay="10" close-delay="50">
                        <template v-slot:activator="{ props }">
                            <router-link v-if="login === true" to="/acc/info" class="btn-acc nav-link active"
                                v-bind="props">
                                <span id="span-acc">Tài khoản</span>
                            </router-link>
                            <router-link v-if="login === false" to="/UserLogin" class="btn-acc nav-link active"
                                v-bind="props">
                                <span id="span-acc">Tài khoản</span>
                            </router-link>
                        </template>
                        <v-list>
                            <!-- chưa đăng nhập -->
                            <v-list-item v-if="login === false">
                                <v-list-item-title>
                                    <router-link to="/UserLogin" data-bs-toggle="modal" data-bs-target="#LoginUserModal">
                                        Đăng nhập
                                    </router-link>
                                </v-list-item-title>
                                <v-list-item-title>
                                    <router-link to="#" data-bs-toggle="modal" data-bs-target="#RegisterUserModal">
                                        Đăng ký
                                    </router-link>
                                </v-list-item-title>
                            </v-list-item>
                            <!--  đã đăng nhập -->
                            <v-list-item v-if="login === true">
                                <v-hover>
                                    <template v-slot:default="{ isHovering, props }">
                                        <router-link to='/acc/info' class="nav-link active">
                                            <v-sheet class="pb-2" v-bind="props" :color="isHovering ? '#d4d7d9' : undefined"
                                                :value="0">
                                                <v-list-item :title=getNameUser subtitle="Thành viên BookStore">
                                                </v-list-item>
                                            </v-sheet>
                                        </router-link>
                                    </template>
                                </v-hover>
                                <v-hover>
                                    <template v-slot:default="{ isHovering, props }">
                                        <router-link to="/acc/order">
                                            <v-sheet class=" ms-2 pb-2 " v-bind="props"
                                                :color="isHovering ? '#d4d7d9' : undefined">
                                                Đơn hàng của tôi
                                            </v-sheet>
                                        </router-link>
                                    </template>
                                </v-hover>
                                <v-hover>
                                    <template v-slot:default="{ isHovering, props }">
                                        <div class="nav-link active" @click="logout">
                                            <v-sheet class=" ms-2 pb-2 " v-bind="props"
                                                :color="isHovering ? '#d4d7d9' : undefined">
                                                Đăng xuất
                                            </v-sheet>
                                        </div>
                                    </template>
                                </v-hover>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </div>
        </div>
    </nav>
</template>
<script>
import Category from "./Category.vue";
import { useDataStore } from "@/stores/dataStores";
import UsersService from '@/services/users.service';
import axios from "axios";
export default {
    components: {
        Category,
    },
    // data: () => ({
    //   login: "1",
    //   user:useDataStore().getUser,
    // }),
    data() {
        return {
            login: false,
            user: [],
            userName: "",
            value: ''
        }
    },
    updated() {
        // this.user = useDataStore().getUser
        // console.log(this.user)
        // if (this.user !== undefined) {
        //     this.userName = this.user
        // }
        // if (this.userName != "") {
        //     this.login = 1
        // }
        // else
        //     this.login = 0
        //this.user = useDataStore().getUser
    },
    methods: {

        // Tìm kiếm sản phẩm
        search() {
            useDataStore().setSearch(this.value)
            this.$router.push('/Search')
        },

        async getUser() {
            let status = UsersService.get(localStorage.getItem('_id'))
            console.log(status);
            console.log(localStorage.getItem('_id'));
            return status
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
                window.location.href = "http://localhost:3001/";
            } catch (error) {
                console.log(error);
            }
        }
    },
    computed: {
        getNameUser() {


            this.userName = localStorage.getItem('name')
            if (this.userName !== undefined) {
                this.login = true
            }
            else {
                this.login = false
            }
            return localStorage.getItem('name')
        }
    },
    async created() {
        // axios
        //     .get("http://localhost:3000/api/books")
        //     .then((response) => {
        //         useDataStore().setBooks(response.data)
        //         this.book = useDataStore().getBooks
        //     })

        if (localStorage.getItem('_id')) {
            let status = await this.getUser();
            console.log(status.statusUser);
            if (status.statusUser === false) {
                this.logout()
            }
        }

    },
    updated() {
        if (localStorage.getItem('name')) {
            this.login = true
        }
    }
}
</script>
<style scoped>
/* @media (min-width: 1200px) {
    .bd-search {
        width: 320px;
        margin-left: -160px;
    }
}

@media (min-width: 992px) {
    .bd-search {
        position: absolute;
        left: 50%;
        width: 320px;
        margin-left: -160px;
    }
} */
.test1 {
    display: flex;
}

.test1:hover v-list-item-title {
    flex-grow: 1;

}

.test:hover {
    background-color: #55a1e7;
}

.category {
    padding-left: 16px;
}

.btn-acc::before {
    content: "Tài khoản";
    font-weight: 500;
    margin: 8px 0 !important;
}

.btn-cart::before {
    content: "Giỏ hàng";
    font-weight: 500;
    margin: 8px 0 !important;
}

#span-acc,
#span-cart {
    display: none;
}

@media (min-width: 992px) {
    .category {
        padding-left: 16px;
    }

    .btn-acc::before {
        color: #ffffff;
        background: #55a1e7;
        border: 1px solid #55a1e7;
        margin: 8px;
        border-radius: 100px;
        font-size: 16px;
        padding: 6px;
        content: '\f007';
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
    }

    .btn-cart::before {
        font-size: 16px;
        padding: 8px;
        content: '\f07a';
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
    }

    #searchbtn:hover {
        color: red;
    }

    #searchbtn {
        color: #6c757d;
    }

    #span-acc,
    #span-cart {
        font-size: 12px;
        display: block;
    }
}
</style>