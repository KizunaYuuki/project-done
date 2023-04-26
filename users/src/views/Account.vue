<template>
    <div class="container">
        <div class="row">
            <div class="leftMenu mt-2 rounded col-2">
                <ul>
                    <li ng-click="Tile" class="Tile">
                        <p>TÀI KHOẢN</p>
                    </li>
                    <!-- <li v-for="(item, index) in items" :key="index"  @click="selectItem(index)"  >
                    <RouterLink  style="color: black; text-decoration: none;" :class="{red: index === selectedIndex}" :to="{
                        name: abc, params: { id: this.selectedIndex },
                    }" >{{ item }}</RouterLink>
                </li> -->
                    <RouterLink to="/acc/info" @click="selectItem(0)" class="link" :class="{ red: 0 === selectedIndex }">
                        <li>
                            Thông tin tài khoản
                        </li>
                    </RouterLink>
                    <RouterLink to="/acc/address" @click="selectItem(1)" class="link" :class="{ red: 1 === selectedIndex }">
                        <li>
                            Sổ địa chỉ
                        </li>
                    </RouterLink>
                    <RouterLink to="/acc/order" @click="selectItem(2)" class="link" :class="{ red: 2 === selectedIndex }">
                        <li>
                            Đơn hàng của tôi
                        </li>
                    </RouterLink>
                </ul>
            </div>
            <!-- <div v-show="selectedIndex === 0" class=" col-sm">Thông tin tài khoản
            <Info />
        </div>
        <div v-show="selectedIndex === 1" class="col-sm">
            <Address />
        </div>
        <div v-show="selectedIndex === 2" class="col-sm">Đơn hàng của tôi
            <Order />
        </div> -->
            <div class="col-sm rounded">
                <RouterView></RouterView>
            </div>
        </div>
    </div>
</template>
<script>
import Info from "../components/Info.vue";
import Order from "../components/Order.vue";
import AddressVue from "../components/AddressAcc.vue";
import axios from "axios";
import { useDataStore } from "@/stores/dataStores";
import { watch } from "vue";
export default {
    components: {
        Info,
        Order,
        AddressVue,
    },
    data() {
        return {
            items: ["Thông tin tài khoản", "Sổ địa chỉ", "Đơn hàng của tôi"],
            selectedIndex: 0,
            link: window.location.href
        };
    },
    methods: {
        selectItem(index) {
            this.selectedIndex = index;
        }
    },
    beforeCreate() {
        // if (useDataStore().getUser._id == undefined)
        //     this.$router.push({name:"LoginUser"})
        if (localStorage.getItem('_id') == undefined)
            this.$router.push({ name: "LoginUser" })

    },
    // watch:{
    //     $route(to, from) {
    //     if(to.path=='/acc/order')
    //         this.selectedIndex=2
    //     if(to.path=='/acc/address')
    //         this.selectedIndex=1
    //     if(to.path=='/acc/info')
    //         this.selectedIndex=0
    //     console.log("Route changed from", from.path, "to", to.path);
    //     }

    // },
    updated() {
        //Bắt đường link, nếu đúng thì tô màu cho menu tương ứng
        if (this.$route.path.startsWith('/acc/order'))
            this.selectedIndex = 2
        if (this.$route.path.startsWith('/acc/address'))
            this.selectedIndex = 1
        if (this.$route.path.startsWith('/acc/info'))
            this.selectedIndex = 0

    }
};
</script>
<style>
@media (max-width: 912px) {

    .col-2 {
        flex-basis: 100%;
    }

}

.Tile {
    color: red;
    pointer-events: none;
    font-weight: bold;
}

.leftMenu {
    height: max-content;
    background-color: white;
}

.leftMenu ul {
    margin-top: 0;
    list-style: none;
    padding: 0;
}

.leftMenu li {
    text-align: left;
    border-bottom: 1px solid #ced2d5;
    padding-bottom: 18px;
    padding-top: 18px;
    cursor: pointer;
    font-size: 14px;
}

.leftMenu li:hover {
    background-color: #5d9eca;
}

.leftMenu li p {
    margin: 0;
}

.red {
    color: red !important;
}

.link {
    color: black;
    text-decoration: none;
}

.white {
    background-color: white;
    padding: 0px;
}
</style>
  