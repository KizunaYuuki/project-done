const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const BooksService = require("../services/books.service");
const AdminsService = require("../services/admins.service");

// Băm mật khẩu
const bcrypt = require("bcrypt");
const saltRounds = 10;

// create admin
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
        const adminsService = new AdminsService(MongoDB.client);
        const document = await adminsService.create(req.body);
        if (document === undefined) {
            return res.send(false);
        }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the admins")
        );
    }
};

// get cookies
exports.getCookies = async (req, res, next) => {
    let admin
    if (req.cookies.admin === undefined) {
        admin = []
    } else {
        admin = JSON.parse(req.cookies.admin);
    }
    res.send(admin)
}

// login admin
exports.login = async (req, res, next) => {
    try {
        const adminsService = new AdminsService(MongoDB.client);
        const document = await adminsService.nameCheck(req.body);
        if (document) {
            // Load hash from your password DB.
            if (bcrypt.compareSync(req.body.password, document.password)) {
                // Tạo đối tượng admin
                let admin = {
                    name: document.name,
                    _id: document._id,
                    roles: 'admin'
                }
                // Tạo cookies lưu thông tin admin
                res.cookie('admin', JSON.stringify(admin), {
                    // domain: 'http://localhost:3000/cookies/',
                    // encode
                    // expires
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7, // Sau 1 tuần cookie sẽ hết hạng
                    // path
                    // priority
                    secure: false, // Không sử dụng trong sản xuất 
                    // signed
                    sameSite: 'lax' // default là lax 
                })
                return res.send(req.cookies.admin)
            }
        }
        return res.send(false)
    }
    catch (error) {
        return next(
            new ApiError(500, "Error name or password incorrect")
        );
    }
};

// logout
exports.logout = async (req, res, next) => {
    // Xoá thông tin admin từ cookies
    if (req.cookies.admin !== undefined) {
        res.clearCookie('admin');
    }
    res.send("Clear cookies complete");
}

exports.findAll = async (req, res, next) => {
    let documents = []

    try {
        const booksService = new BooksService(MongoDB.client);
        // const { phone } = req.query;
        documents = await booksService.find({});

        // else{
        //     documents = await booksService.find({})
        // }
    }
    catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the product")
        );
    }
    return res.send(documents);
}

exports.findOne = async (req, res, next) => {
    try {
        const booksService = new BooksService(MongoDB.client);
        const document = await booksService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, `Error retrieving product with id=${req.parmas.id}`)
        );
    }
}

exports.update = async (req, res, next) => {
    // if (Object.keys(req.body).length === 0) {
    //     return next(new ApiError(400, "Data to update can not be empty"));
    // }

    try {
        const booksService = new BooksService(MongoDB.client);
        const document = await booksService.update(req.params.id, req.body);
        console.log(req.body)
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send({ message: "Product was updated successfully" });
    } catch (error) {
        console.log(req.body)
        return next(
            new ApiError(500, `Error updating product with id=${req.params.id}`)
        );
    }
};

exports.pushImg = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const booksService = new BooksService(MongoDB.client);
        const document = await booksService.pushImg(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send({ message: "Product was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating product with id=${req.params.id}`)
        );
    }
};

exports.removeImg = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const booksService = new BooksService(MongoDB.client);
        const document = await booksService.removeImg(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send({ message: "Product was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating product with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const booksService = new BooksService(MongoDB.client);
        const document = await booksService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send({ message: "Product was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete product with id=${req.params.id}`)
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const booksService = new BooksService(MongoDB.client);

        if (req.body) {
            const deletedCount = await booksService.deleteAll(req.body);
            return res.send({
                message: `${deletedCount} product were deleted successfully`
            });
        }


    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all product")
        );
    }
};

exports.dropCollection = async (req, res, next) => {
    try {
        const booksService = new BooksService(MongoDB.client, req.params.name);
        const kq = await booksService.drop()
        return res.send(kq)

    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all diary")
        );
    }
};


