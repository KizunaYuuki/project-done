import createApiClient from "./api.service";

class GenresService {
    constructor(baseUrl = "/api/Genres") {
        this.api = createApiClient(baseUrl);
    }
    async getAll(data) {
        return (await this.api.get("/", data)).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async createSub(id, data) {
        return (await this.api.post(`/subGenre/${id}`, data)).data;
    }
    async deleteSub(id, data) {
        return (await this.api.put(`/subGenre/${id}`, data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default new GenresService();
