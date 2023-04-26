// kiz
import createApiClient from "./api.service";

class CookiesService {
    constructor(baseUrl = "/cookies") {
        this.api = createApiClient(baseUrl);
    }

    // data is a midleware option 
    async getAll(data) {
        return (await this.api.get("/read", data)).data;
    }

    async create(data, idBook, quantityBook) {
        return (await this.api.get(`/${idBook}/${quantityBook}`), data).data;
    }

    async deleteAll() {
        return (await this.api.get("/clear", data)).data;
    }

}

export default new CookiesService();