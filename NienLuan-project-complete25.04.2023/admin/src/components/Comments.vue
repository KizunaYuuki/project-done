<template>
    <!-- Người đánh giá  -->
    <div class="align-middle px-3 d-flex justify-content-between">
        <strong>{{ username }}</strong>
        <div>

            <div class="btn-group">
                <button type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                        <path
                            d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <!-- <li><button class="dropdown-item" type="button">Chỉnh sữa</button></li> -->
                    <li><button @click="commentDelete(comment._id)" class="dropdown-item" type="button">Xoá</button></li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Đánh giá sao  -->
    <div class="align-middle px-3" style="display: flex; align-items: flex-start;">
        <star-rating :show-rating="false" :read-only="true" :increment="0.5" :rating="comment.rateStar" :star-size="24" />
        <span class="m-1 text-muted fs-6">{{ timeComment.fromNow() }} - {{ timeComment.format("LL") }}</span>
    </div>

    <!-- Bình luận  -->
    <div class="align-middle px-3">
        <p>{{ comment.content }}</p>
    </div>
</template>

<script>
import StarRating from 'vue-star-rating'
import moment from 'moment';
import 'moment/dist/locale/vi';
import CommentsService from '@/services/comments.service'
import UsersService from '@/services/users.service';
export default {
    components: {
        StarRating
    },
    props: {
        comment: { type: Object, required: true },
    },
    data() {
        moment.locale("vi");
        const timeComment = moment(this.comment.commentDate)
        return {
            timeComment,
            username: '',
            idUser: ''
        }
    },
    methods: {
        // Phương thức không an toàn 
        async getUser(id) {
            let doc = await UsersService.get(id);
            console.log(doc);
            this.username = doc.name
        },

        // Xoá comment
        async commentDelete(idComemt) {
            try {

                await CommentsService.delete(idComemt);
                // Cập nhật lại trang 
                this.$emit('commentDelete', '')
                // Thông báo 

            } catch (error) {
                console.log(error);
            }
        }
    },
    created() {
        this.getUser(this.comment._idUser);
        this.idUser = localStorage.getItem('_id');
    },
    mounted() {
    }
}
</script>