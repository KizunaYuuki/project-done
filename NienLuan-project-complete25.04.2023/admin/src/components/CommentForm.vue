<template>
    <Form class="container form my-4 py-2 shadow-sm" @submit="submitComment" :validation-schema="commentSchema">

        <!-- Đánh giá  -->
        <div class="form-group fs-6 mb-2 d-flex justify-content-end">
            <star-rating :show-rating="false" :increment="0.5" v-model:rating="tempComment.rateStar" :star-size="24" />
        </div>

        <!-- Nội dung bình luận  -->
        <div class="form-group form-floating mb-2">
            <Field class="form-control" v-slot="{ field }" v-model="tempComment.content" name="content" rules="required">
                <textarea v-bind="field" class="form-control" placeholder="Leave a comment here"
                    style="min-height: 60px;"></textarea>
            </Field>
            <label for="content">Nội dung bình luận</label>
        </div>

        <!-- Nút thêm bình luận  -->
        <div v-if="(tempComment.content !== '') || (tempComment.rateStar !== 0)"
            class="form-group fs-6 mb-2 d-flex justify-content-end">
            <div @click="cancelComment" class="px-2"><a class="btn btn-outline-primary">Huỷ</a></div>
            <button type="submit" class="btn btn-primary text-white">Bình luận</button>
        </div>
    </Form>
</template>

<script>

import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import StarRating from 'vue-star-rating'
import CommentsService from '@/services/comments.service'

export default {
    props: {
        idBook: { type: String, required: true },
    },
    components: {
        Form, Field, ErrorMessage,
        StarRating,
    },
    data() {
        const commentSchema = yup.object().shape({
            content: yup
                .string(),
            rateStar: yup
                .number()
                .min(1)
                .max(5),
        })
        return {
            commentSchema,
            tempComment: {
                _idBook: '',
                _idUser: '',
                commentDate: {},
                content: '',
                rateStar: 0
            }
        }
    },

    methods: {
        // Post comment 
        async submitComment() {
            if (localStorage.getItem('_id') === null) {
                this.$router.push('/UserLogin');
            } else {
                let comment = this.tempComment;
                comment._idBook = this.idBook;
                comment._idUser = localStorage.getItem('_id');
                comment.commentDate = new Date();
                if (comment.content !== '' || (comment.rateStar !== 0)) {
                    await CommentsService.create(comment);
                    // Xoá dữ liệu đầu vào 
                    this.tempComment.content = '';
                    this.tempComment.rateStar = 0;
                    this.$emit('submitComment', '')
                }
                else {
                    alert('Bình luận phải có nội dung hoặc được đánh giá sao')
                    return;
                }
            }
        },
        // Button Huỷ 
        cancelComment() {
            this.tempComment.content = '';
            this.tempComment.rateStar = 0;
        }
    }
}

</script>

<style scoped></style>