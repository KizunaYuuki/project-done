<template>
    <div v-if="isMobile">
        <div class="fw-bold" @click="showCategory()">Danh mục sản phẩm</div>
        <div>
            <div v-if="showCategory1" v-for="(category, index) in category" :key="index">
                <div class="ms-2 fw-semibold" @click="toggle(index)">{{ category.genreName }}</div>
                <div v-if="isOpen(index)">
                    <div class="ms-4 " v-for="(subGenre, subIndex) in category.subGenre" :key="subIndex">
                        <router-link to="/category">
                            <div @click="getGenreClick(1, subGenre)">{{ subGenre }}</div>
                        </router-link>
                    </div>
                    <router-link to="/category">
                        <div class="ms-4 blue" @click="getGenreClick(0, category)">Xem tất cả</div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
                <div v-bind="props">
                    Danh mục sản phẩm
                </div>
            </template>
            <v-list>
                <v-list-item v-for="(category, index) in category" :key="index" :value="index"
                    @click="getGenreClick(0, category)">
                    <v-menu :location="location" open-on-hover>
                        <template v-slot:activator="{ props }">
                            <router-link to="/category">
                                <v-list-item-title v-bind="props" class="hover-item">
                                    {{ category.genreName }}
                                </v-list-item-title>
                            </router-link>
                        </template>
                        <v-list>
                            <v-list-item v-for="(subGenre, index) in category.subGenre" :key="index" :value="index"
                                @click="getGenreClick(1, subGenre)">
                                <router-link to="/category">
                                    <v-list-item-title>{{ subGenre }}</v-list-item-title>
                                </router-link>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
<script>
import axios from 'axios';
import { useDataStore } from '../stores/dataStores';
export default {
    computed: {
        isMobile() {
            return window.innerWidth <= 912;
        },
        isOpen() {
            return (index) => {
                return this.openIndex === index;
            };

        },

    },
    methods: {
        getGenreClick(line, data) {

            if (line == 0) {
                // console.log(data.genreName)
                // console.log(data.subGenre)
                console.log(data)
                useDataStore().setGenreSelected(data.subGenre)
                useDataStore().setCategorySelected(data.genreName)
                useDataStore().setShowFull(false)

            }
            else {
                //console.log(data)
                let a = [data]
                let CategorySelected = useDataStore().getGenes.find(genre => genre.subGenre.includes(a[0]));
                //console.log(CategorySelected.genreName);
                useDataStore().setCategorySelected(CategorySelected.genreName)
                useDataStore().setGenreSelected(a)
                useDataStore().setShowFull(false)
            }
        },
        showCategory() {
            if (this.showCategory1 == true)
                this.showCategory1 = false
            else
                this.showCategory1 = true

        },
        toggle(index) {
            if (this.openIndex === index) {
                this.openIndex = null;
            } else {
                this.openIndex = index;
            }
        }
    },
    async mounted() {
        await axios
            .get('http://localhost:3000/api/genres')
            .then((response) => {
                useDataStore().getAPIGenes(response.data)

                this.category = useDataStore().getGenes

            })
    },

    // data: () => ({
    //     category:[],
    //     location: 'end',
    // }),
    data() {
        return {
            category: [],
            location: 'end',
            genreClick: null,
            showCategory1: false,
            openIndex: null,
            selectedItems: []
        }
    }
}
</script>


<style>
.blue {
    color: blue;
}

.v-list-item:hover {
    color: red !important;
}

.v-sheet {
    background-color: transparent;
}
</style>