const { ObjectId } = require("mongodb");

class ImagesService {
    constructor(client) {
        this.Images = client.db().collection("images");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractImagesData(payload) {
        const images = {
            nameImage: payload.nameImage,
            linkImage: payload.linkImage,
            _idBook: payload._idBook,
        };
        // remove undefined fields. 
        Object.keys(images).forEach(
            (key) => images[key] === undefined && delete images[key]
        );
        return images;
    }

    async create(payload) {
        const images = this.extractImagesData(payload);
        const result = await this.Images.findOneAndUpdate(
            images,
            { $set: images },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Images.find(filter).sort({ time: -1 });
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({ name: { $regex: new RegExp(name), $options: "i" }, });
    }

    async findById(id) {
        return await this.Images.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async delete(id) {
        const result = await this.Images.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async deleteAll(filter) {
        const result = await this.Images.deleteMany(filter);
        return result.deletedCount;
    }
    async drop() {
        const result = await this.Images.drop()
        return result
    }
}

module.exports = ImagesService;