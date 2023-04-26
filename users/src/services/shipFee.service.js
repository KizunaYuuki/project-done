import createApiClient from "./api.service";

class ShipFeeService {
    constructor(baseUrl = "/api/ShipFee") {
        this.api = createApiClient(baseUrl);
    }

    async getAll(data) {
        return (await this.api.get("/", data)).data;
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async deleteAll(data) {
        return (await this.api.delete("/"), data).data;
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async updateShipFee(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`${id}`)).data;
    }
}

export default new ShipFeeService();