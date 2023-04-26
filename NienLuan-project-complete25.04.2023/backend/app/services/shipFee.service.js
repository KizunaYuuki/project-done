const { ObjectId } = require("mongodb");

class ShipFeeService {
    constructor(client) {
        this.ShipFee = client.db().collection("shipFee");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractShipFeeData(payload) {
        const shipFee = {
            shipFee: payload.shipFee,
            date: payload.date
        };
        // remove undefined fields. 
        Object.keys(shipFee).forEach(
            (key) => shipFee[key] === undefined && delete shipFee[key]
        );
        return shipFee;
    }

    async create(payload) {
        const shipFee = this.extractShipFeeData(payload);
        const result = await this.ShipFee.findOneAndUpdate(
            shipFee,
            { $set: shipFee },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.ShipFee.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({ name: { $regex: new RegExp(name), $options: "i" }, });
    }

    async findById(id) {
        return await this.ShipFee.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractShipFeeData(payload);
        const result = await this.ShipFee.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.ShipFee.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async deleteAll(filter) {
        const result = await this.ShipFee.deleteMany(filter);
        return result.deletedCount;
    }

    async drop() {
        const result = await this.ShipFee.drop()
        return result
    }
}

module.exports = ShipFeeService;