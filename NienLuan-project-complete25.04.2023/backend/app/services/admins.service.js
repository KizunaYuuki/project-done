// Băm mật khẩu
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const saltRounds = 10;


class AdminsService {
    constructor(client) {
        this.Admins = client.db().collection("admins");
    }
    // Định nghĩa các phương thức truy cập CSDL sử dụng mongodb API
    extractAdminsData(payload) {
        const admins = {
            name: payload.name,
            password: payload.password,
            registerDate: payload.registerDate
        };
        // destroy undefined fields
        Object.keys(admins).forEach(
            (key) => admins[key] === undefined && delete admins[key]
        );
        return admins;
    }

    // Các phương thức của admin
    async create(payload) {
        const admins = this.extractAdminsData(payload);
        // Kiểm tra name đã tồn tại hay chưa
        const name = await this.Admins.findOne({
            name: payload.name
        });
        if (name === null) {
            // Băm mật khẩu
            const hash = bcrypt.hashSync(payload.password, saltRounds);
            const result = await this.Admins.findOneAndUpdate(
                admins,
                {
                    $set: {
                        password: hash,
                        registerDate: new Date(),
                    }
                },
                { returnDocument: "after", upsert: true }
            );

            return result.value;
        }
    }

    // Kiểm tra đăng nhập
    async nameCheck(filter) {
        const cursor = await this.Admins.findOne({
            name: filter.name
        });
        if (!cursor) {
            return false;
        }
        return await cursor;
    }

    // async find(filter) {
    //     const cursor = await this.Admins.find(filter);
    //     return await cursor.toArray();
    // }

    // async findByName(name) {
    //     return await this.find({ name: { $regex: new RegExp(name), $options: "i" } });
    // }

    // async findById(id) {
    //     return await this.Admins.findOne({
    //         _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    //     });
    // }

    // async update(id, payload) {
    //     const filter = {
    //         _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    //     };
    //     const update = this.extractAdminsData(payload);
    //     const result = await this.Admins.findOneAndUpdate(
    //         filter,
    //         { $set: update },
    //         { returnDocument: "after" }
    //     );
    //     return result.value;
    // }

    // async delete(id) {
    //     const result = await this.Admins.findOneAndDelete({
    //         _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    //     });
    //     return result.value;
    // }

    // async deleteAll(filter) {
    //     const result = await this.Admins.deleteMany(filter);
    //     return result.deletedCount;
    // }

    // async drop() {
    //     const result = await this.Admins.drop();
    //     return result;
    // }
}

module.exports = AdminsService;