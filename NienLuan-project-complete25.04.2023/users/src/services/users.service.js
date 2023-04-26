import createApiClient from "./api.service";

class UsersService {
    constructor(baseUrl = "/api/Users") {
        this.api = createApiClient(baseUrl);
    }

    // kiz
    async create(data) {
        return (await this.api.post("/register", data)).data;
    }

    async login(data) {
        return (await this.api.post("/login", data)).data;
    }

    async logout(data) {
        return (await this.api.get("/logout", data)).data;
    }

    async getCookies(data) {
        return (await this.api.get("/cookies", data)).data;
    }


    async getAll(data) {
        return (await this.api.post("/", data)).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async updateUser(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default new UsersService();
