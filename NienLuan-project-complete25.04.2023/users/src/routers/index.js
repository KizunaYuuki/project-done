import { createWebHistory, createRouter } from "vue-router";
import AccountVue from "../views/Account.vue";
import InfoVue from "@/components/Info.vue";
import AddressAccVue from "@/components/AddressAcc.vue";
import OrderVue from "@/components/Order.vue";
import NewAddress from "@/components/NewAddress.vue"
import OrderDetailVue from "@/components/OrderDetail.vue";
import AddressEditVue from "@/components/AddressEdit.vue";
const routes = [
    {
        path: "/",
        name: "HomePage",
        component: () => import("@/views/HomePage.vue"),
        meta: {
            title: 'BookStore',
        },
    },
    {
        path: "/Cart",
        name: "Cart",
        component: () => import("@/views/Cart.vue"),
        meta: {
            title: 'Giỏ hàng',
        },
    },
    {
        path: "/Inform",
        name: "Inform",
        component: () => import("@/views/Inform.vue"),
        meta: {
            title: 'Thông tin đơn hàng - Vận chuyển',
        },
    },
    {
        path: "/Pay",
        name: "Pay",
        component: () => import("@/views/Pay.vue"),
        meta: {
            title: 'Đặt hàng - Thanh toán',
        },
    },
    {
        path: "/AdminLogin",
        name: "LoginAdmin",
        component: () => import("@/views/LoginAdmin.vue"),
        meta: {
            title: 'Đăng nhập - Bán hàng',
        },
    },
    {
        path: "/UserLogin",
        name: "LoginUser",
        component: () => import("@/views/LoginUserPage.vue"),
        meta: {
            title: 'Đăng nhập - Mua hàng',
        },
    },
    {
        path: "/UserRegister",
        name: "RegisterUser",
        component: () => import("@/views/RegisterUserPage.vue"),
        meta: {
            title: 'Đăng ký người dùng',
        },
    },
    {
        path: "/Products/:id",
        name: "BookDetails",
        component: () => import("@/views/BookDetails.vue"),
        props: true, // props id products
        meta: {
            title: 'Chi tiết sản phẩm',
        },
    },
    {
        path: '/acc',
        component: AccountVue,
        children: [
            { path: "info", component: InfoVue },
            { path: "address", component: AddressAccVue, name: 'AddressAcc' },
            { path: "order", component: OrderVue, name: "order" },
            { path: "address/add", component: NewAddress },
            { path: "address/edit/:id", name: "AddressEditVue", component: AddressEditVue },
            { path: "order/:id", name: "OrderDetail", component: OrderDetailVue, },
        ],
        meta: {
            title: 'Tài khoản người dùng',
        },
    },
    {
        path: "/category",
        name: "category",
        component: () => import("../components/CategoryView.vue"),
        meta: {
            title: 'Danh mục',
        },
    },
    {
        path: "/Search",
        name: "Search",
        component: () => import("../components/Search.vue"),
        meta: {
            title: 'Tìm kiếm sản phẩm',
        },
    },
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// Xử lý truy cập trái phép - Chưa đăng nhập 
router.beforeEach(async (to, from, next) => {
    // Đặt tiêu đề động cho từng trang 
    document.title = to.meta?.title ?? 'Web Application'
    if (localStorage.getItem('_id') && to.path === '/UserLogin') {
        next('/')
    }

    // Khởi tạo 
    const id = to.params.id;
    const privatePagesUser = ['/acc'];
    const PagesAdmin = ["/Receipts", "/Orders", "/Promotion", "/Catalog", "/Clients", "/Products", "/receipts", "/orders", "/promotion", "/catalog", "/clients", "/products"]
    const authRequiredUser = privatePagesUser.includes(to.path);
    const authRequiredAdmin = PagesAdmin.includes(to.path);

    // Xử lý
    if (authRequiredUser && !localStorage.getItem('_id')) {
        // redirect the user to the login page
        next('/UserLogin');
    } else if ((authRequiredAdmin) && (!localStorage.getItem('_idAdmin'))) {
        // redirect the user to the login page
        next('/AdminLogin')
    }
    else {
        // Không làm gì 
        next();
    }
})
export default router;
