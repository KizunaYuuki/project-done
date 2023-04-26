<template>
    <div class="pt-3">
        <ul class="nav justify-content-center border-bottom border-danger pb-3 mb-3 fw-bold fs-6">
            <li class="nav-item"><router-link class="nav-link px-2 text-dark" to="/">Trang chủ</router-link></li>
            <li class="nav-item"><router-link class="nav-link px-2 text-dark" to="">Tính năng</router-link></li>
            <li class="nav-item"><router-link class="nav-link px-2 text-dark" to="">Đánh giá</router-link></li>
            <li class="nav-item"><router-link class="nav-link px-2 text-dark" to="">Giới thiệu</router-link></li>
        </ul>
        <p class="text-center text-muted">&copy; 2023, Develop by Nguyễn Nhựt Thanh, Lê Quang Phú, Phan Trung Thành
        </p>
    </div>
</template>
<style>
footer li a {
    border-radius: 4px;
}

footer li a:hover {
    color: #0169c2 !important;
    border-radius: 4px;
    background-color: #d7e8fd;
}
</style>