<script>
import axios from 'axios'
export default {
    props: {
        dropIndexCity: Number,
        dropIndexDistrict: Number,
        dropIndexWard: Number,
    },
    data() {
        return {
            citys: [], indexCity: this.dropIndexCity || -1,
            indexDistrict: this.dropIndexCity || -1,
            indexWard: this.dropIndexWard || -1,
        }
    },
    mounted() {
        axios
            .get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then((response) => {
                this.citys = response.data
                console.log(response.data)
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
    methods: {
        Districts(index) {
            return this.citys[index].Districts
        },
        Wards(indexCity, indexDistrict) {
            return this.citys[indexCity].Districts[indexDistrict]?.Wards
        },
        // emit address
        addressSelect() {
            this.$emit("addressEmit", {
                city: this?.citys[this.indexCity]?.Name || '',
                district: this?.citys[this.indexCity]?.Districts[this.indexDistrict]?.Name || '',
                ward: this?.citys[this.indexCity]?.Districts[this.indexDistrict]?.Wards[this.indexWard]?.Name || '',
            });
            console.log(this?.citys[this.indexCity]?.Name);
            console.log(this?.citys[this.indexCity]?.Districts[this.indexDistrict]?.Name);
            console.log(this?.citys[this.indexCity]?.Districts[this.indexDistrict]?.Wards[this.indexWard]?.Name);
        },
    },
    watch: {
        dropIndexCity: function (newValue, oldValue) {
            console.log(this.dropIndexCity);
            this.indexCity = newValue;
            console.log(this.indexCity);
        },
        dropIndexDistrict: function (newValue, oldValue) {
            this.indexDistrict = newValue;
            console.log(this.indexDistrict);
        },
        dropIndexWard: function (newValue, oldValue) {
            this.indexWard = newValue
            console.log(this.indexWard);
        }
    }
}

</script>
<template>
    <div class="d-flex text-dark">
        <!-- Chọn thành phố  -->
        <div class="form-group form-floating me-1 col">
            <select v-model="indexCity" class="form-select" aria-label="City" @change="addressSelect">
                <!-- <option value="-1" selected>Chọn Tỉnh/Thành Phố</option> -->
                <option v-for="(city, index) in citys" :value="index">{{ city.Name }}</option>
            </select>
            <label class="fs-6" for="floatingInput">Tỉnh/Thành Phố</label>
        </div>

        <!-- Chọn quận -->
        <div class="form-group form-floating me-1 col">
            <select v-model="indexDistrict" class="form-select" aria-label="District" @change="addressSelect">
                <!-- <option value="-1" selected>Chọn Quận/Huyện</option> -->
                <template v-if="get">
                    <option v-for="(district, index) in Districts(indexCity)" :value="index">{{ district.Name }}</option>
                </template>
            </select>
            <label class="fs-6" for="floatingInput">Quận/Huyện</label>
        </div>

        <!-- Chọn phường  -->
        <div class="form-group form-floating col">
            <select v-model="indexWard" class="form-select" aria-label="Ward" @change="addressSelect">
                <!-- <option value="-1" selected>Chọn Phường/Xã</option> -->
                <template v-if="get">
                    <option v-for="(ward, index) in Wards(indexCity, indexDistrict)" :value="index">{{ ward.Name }}</option>
                </template>
            </select>
            <label class="fs-6" for="floatingInput">Phường/Xã</label>
        </div>
    </div>
</template>