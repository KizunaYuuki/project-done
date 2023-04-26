import createApiClient from "./api.service";

class AdminsService {
    constructor(baseUrl = "/api/Admins") {
        this.api = createApiClient(baseUrl);
    }

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
}

export default new AdminsService();
