<template>
    <div class="container" style="padding: 30px;">
        <!-- <h3 class="text-center" style="padding: 10px;">QUẢN LÝ DANH MỤC</h3>
        <hr /> -->
        <h3 class="font-weight-bold   text-center" style="color: crimson;">QUẢN LÝ DANH MỤC</h3>
        <hr>
        <!-- <Gene_Update /> -->
        <div style="display: flex; margin-bottom: 20px;">
            <h5>Thêm thể loại</h5>
            <v-dialog transition="dialog-top-transition" width="1000">
                <template v-slot:activator="{ props }">
                    <!-- <v-btn color="primary" >From the top</v-btn> -->
                    <v-btn variant="outlined" size="x-small" icon v-bind="props" color="primary" style="margin-left: 10px;">
                        <i class="fas fa-solid fa-plus"></i>
                    </v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                    <v-card>
                        <v-form @submit.prevent="submitGenres">
                            <v-toolbar color="primary" title="Thêm thể loại mới"></v-toolbar>
                            <v-card-text>
                                <v-text-field v-model="inputGenres" :rules="rules" clearable label="Nhập thể loại lớn mới"
                                    variant="underlined"></v-text-field>
                            </v-card-text>
                            <v-card-actions class="justify-end">
                                <v-btn variant="text" @click="isActive.value = false">Đóng</v-btn>
                                <v-btn variant="text" type="submit">Lưu</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </template>
            </v-dialog>
        </div>

        <div>
            <v-row>
                <v-col v-for="item in gene_Api" :key="item._id">
                    <v-card class="mx-auto shadow" width="max-content">
                        <v-list>
                            <v-list-item>
                                <div style="display: flex;">
                                    <strong style="margin-right: 5px;">{{ item.genreName }}</strong>

                                    <v-dialog transition="dialog-top-transition" width="1000">
                                        <template v-slot:activator="{ props }">
                                            <!-- <v-btn color="primary" >From the top</v-btn> -->
                                            <div type="button" @click="clear" v-bind="props"
                                                style="color: blue;margin-right: 5px;">
                                                <i class="fas fa-solid fa-plus"></i>
                                            </div>

                                        </template>
                                        <template v-slot:default="{ isActive }">
                                            <v-card>
                                                <v-toolbar color="primary"
                                                    :title="'Thêm thể loại vào ' + item.genreName"></v-toolbar>
                                                <v-form @submit.prevent>
                                                    <v-card-text>
                                                        <div style="display: flex;">
                                                            <div type="button" @click="addInput"
                                                                style="color: blue;margin-right: 5px;">
                                                                Thêm trường<i class="fas fa-solid fa-plus"></i>
                                                            </div>
                                                            <div type="button" @click="reInput" style="color: red;">
                                                                Xóa trường<i class=" fas fa-solid fa-plus"></i>
                                                            </div>
                                                        </div>
                                                        <div v-for="i in listInput" :key="i">
                                                            <v-text-field clearable :rules="rules" label="Thêm thể loại mới"
                                                                variant="underlined" :id="i"></v-text-field>
                                                        </div>
                                                    </v-card-text>
                                                    <v-card-actions class="justify-end">
                                                        <v-btn variant="text" @click="isActive.value = false">Đóng</v-btn>
                                                        <v-btn variant="text" type="submit"
                                                            @click="submitSub(item._id)">Lưu</v-btn>
                                                    </v-card-actions>
                                                </v-form>
                                            </v-card>
                                        </template>
                                    </v-dialog>

                                    <v-dialog transition="dialog-bottom-transition" width="1000">
                                        <template v-slot:activator="{ props }">
                                            <!-- <v-btn color="primary" >From the bottom</v-btn> -->
                                            <div type="button" v-bind="props" style="color: yellow;margin-right: 5px;"><i
                                                    class="fas fa-regular fa-pen-to-square"></i>
                                            </div>
                                        </template>
                                        <template v-slot:default="{ isActive }">
                                            <v-card>
                                                <v-toolbar color="primary"
                                                    :title="'Chỉnh sửa tên thể loại ' + item.genreName"></v-toolbar>
                                                <v-form @submit.prevent>
                                                    <v-card-text>
                                                        <v-text-field v-model="inputUpdate" :rules="rules" clearable
                                                            label="Nhập tên thay đổi" variant="underlined"></v-text-field>
                                                    </v-card-text>
                                                    <v-card-actions class="justify-end">
                                                        <v-btn variant="text" @click="isActive.value = false">Đóng</v-btn>
                                                        <v-btn variant="text" type="submit"
                                                            @click="updateGenres(item._id)">Lưu</v-btn>
                                                    </v-card-actions>
                                                </v-form>
                                            </v-card>
                                        </template>
                                    </v-dialog>

                                    <div type="button" @click="deleteGenre(item._id, item.genreName, 0)"
                                        style="color: red;"><i class="fas fa-solid fa-delete-left"></i></div>
                                </div>
                            </v-list-item>
                            <v-list-group>
                                <template v-slot:activator="{ props }">
                                    <v-list-item v-bind="props">{{ item.subGenre.length }} thể loại con</v-list-item>
                                </template>
                                <v-list-item v-for="i in item.subGenre" :key="i">
                                    <div style="display: flex;">
                                        <p>{{ i }}</p>
                                        <div type="button" @click="deleteGenre(item._id, i, 1)"
                                            style="color: red;margin-left: 5px; align-items: center;"><i
                                                class="fas fa-solid fa-delete-left"></i>
                                        </div>
                                    </div>
                                </v-list-item>
                            </v-list-group>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>

        </div>

    </div>
</template>

<script>
import GenresService from "@/services/genres.service";
import { useDataStore } from '../stores/dataStores';
import { toast } from 'vue3-toastify';
export default {
    components: {

    },
    data() {
        return {
            listInput: ["1"],
            gene_Api: useDataStore().getGenes,
            inputGenres: '',
            inputUpdate: '',
            isVisible: false,
            rules: [
                value => {
                    if (value) return true
                    return 'Bạn chưa nhập giá trị.'
                },
            ],
        }

    },
    methods: {
        addInput() {
            this.listInput.push(String(this.listInput.length + 1))
        },
        reInput() {
            this.listInput.pop()
        },
        clear() {
            this.listInput = ["1"]
        },
        async submitGenres() {
            if (this.inputGenres !== '') {
                let result = this.gene_Api.find(item => item.genreName.toLowerCase().includes(this.inputGenres.toLowerCase()));
                if (result) {
                    toast.error(this.inputGenres + " đã tồn tại", {
                        transition: toast.TRANSITIONS.SLIDE,
                    });
                }
                else {
                    var genres = await GenresService.create({ genreName: this.inputGenres, subGenre: [] })
                    if (genres) {
                        toast.success("Thêm thành công", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                        this.inputGenres = ''
                        this.getGenres()
                        //cập nhật store lại
                    }
                    else {
                        toast.error("Thêm thất bại", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                    }
                    console.log(genres)
                }
            }
        },
        async updateGenres(id) {
            if (this.inputUpdate !== '') {
                let result = this.gene_Api.find(item => item.genreName === this.inputUpdate);
                if (result) {
                    toast.error(this.inputUpdate + " đã tồn tại", {
                        transition: toast.TRANSITIONS.SLIDE,
                    });
                }
                else {
                    var genres = await GenresService.update(id, { genreName: this.inputUpdate })
                    if (genres) {
                        toast.success("Cập nhật thành công", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                        this.getGenres()
                    }
                    else {
                        toast.error("Cập nhật thất bại", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                    }
                    console.log(genres)
                }
            }
        },
        async submitSub(id) {
            let flag = true
            for (var i of this.listInput) {
                if (document.getElementById(i).value === '') {
                    flag = false
                    break
                }
            }
            if (flag === true) {
                for (var i of this.listInput) {
                    let result = this.gene_Api.filter(item => item._id === id);
                    // console.log(result)
                    var data = await document.getElementById(i).value
                    result = result.find(i => i.subGenre.find(i => i.toLowerCase() === data.toLowerCase()))
                    console.log(data)
                    if (result) {
                        toast.error(document.getElementById(i).value + " đã tồn tại", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                        break
                    }
                    else {
                        var sub = await GenresService.createSub(id, { subGenre: data })

                        if (sub) {
                            toast.success(document.getElementById(i).value + " thêm thành công", {
                                transition: toast.TRANSITIONS.SLIDE,
                            });
                        }
                        else {
                            toast.error(document.getElementById(i).value + " thêm thất bại", {
                                transition: toast.TRANSITIONS.SLIDE,
                            });
                        }
                        this.getGenres()
                    }
                }
            }
        },
        async deleteGenre(id, name, i) {
            if (confirm('Bạn muốn xóa thể loại ' + name)) {
                if (i === 0) {
                    try {
                        var genres = await GenresService.delete(id)
                        toast.success("Xóa thành công", {
                            transition: toast.TRANSITIONS.SLIDE,
                        });
                        console.log(genres);

                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                else {
                    try {
                        var genres = await GenresService.deleteSub(id, { subGenre: name })
                        console.log(name)
                        console.log(genres);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
            this.getGenres()
        },
        async getGenres() {
            var kq = await GenresService.getAll()
            useDataStore().updateGenres(kq)
            this.gene_Api = useDataStore().getGenes
        }
    },
    mounted() {
        this.getGenres()
    }
};
</script>

<style>
/* .bg-basil {
    background-color: #FFFBE6 !important;
} */

.text-basil {
    color: crimson !important;
}
</style>