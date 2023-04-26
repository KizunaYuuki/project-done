const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const axios = require('axios');
// paypal
// import * as paypal from "./paypal-api.js";
const paypal = require("./app/paypal-api");
require('dotenv').config(); // loads variables from .env file

const adminsRouter = require("./app/routes/admins.route");
const booksRouter = require("./app/routes/books.route");
const genresRouter = require("./app/routes/genres.route");
const tagsRouter = require("./app/routes/tags.route");
const shipFeeRouter = require("./app/routes/shipFee.route");
const addressesRouter = require("./app/routes/addresses.route");
const usersRouter = require("./app/routes/users.route");
const cartsRouter = require("./app/routes/carts.route");
const commentsRouter = require("./app/routes/comments.route");
const ordersRouter = require("./app/routes/orders.route");
const promotionsRouter = require("./app/routes/promotions.route");
const suppliersRouter = require("./app/routes/suppliers.route");
const receiptsRouter = require("./app/routes/receipts.route");
const imagesRouter = require('./app/routes/images.route');
const ApiError = require("./app/api-error");
const multer = require('multer')
const app = express();
var fs = require('fs');
const { db } = require("./app/config");
const { client } = require("./app/utils/mongodb.util");

app.use(cookieParser());
app.set("trust proxy", 1);

app.use(cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002', 'http://localhost:3002'],
    credentials: true,
}));
app.use(express.json());
app.use("/api/Admins", adminsRouter);
app.use("/api/Books", booksRouter);
app.use("/api/Carts", cartsRouter);
app.use("/api/Comments", commentsRouter);
app.use("/api/ShipFee", shipFeeRouter);
app.use("/api/Addresses", addressesRouter);
app.use("/api/Genres", genresRouter);
app.use("/api/Tags", tagsRouter);
app.use("/api/Orders", ordersRouter);
app.use("/api/Users", usersRouter);
app.use("/api/Promotions", promotionsRouter);
app.use("/api/Receipts", receiptsRouter);
app.use("/api/Suppliers", suppliersRouter);
app.use("/api/Images", imagesRouter);
app.use('/uploads', express.static('uploads'))


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.png'
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })
// app.post('/api/uploads', upload.single('uploadsImg'), function (req, res) {
//     // req.file is the name of your file in the form above, here 'uploaded_file'
//     // req.body will hold the text fields, if there were any 
//     console.log(req.file)

// });

app.post('/api/uploads', upload.array('uploadsImg'), async function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    // let files = req.body.uploadsImg
    const obj = JSON.parse(JSON.stringify(req.body))
    // console.log(obj)
    console.log(req.files)
    var imgs = []
    for (let index of req.files) {
        var pathImg = "http://localhost:3000/uploads/" + index.filename
        imgs.push({ nameImage: index.filename, linkImage: pathImg, _idBook: null })
        console.log(pathImg)
    }

    return res.send(imgs)
})

app.post('/api/removeImg', (req, res) => {

    const { name } = req.body
    var filePath = "C:\\Users\\Thanh_2z\\Desktop\\Nien_Luan_Nganh\\Back_End\\uploads\\" + name;
    console.log(name)
    // console.log(filePath)
    fs.unlinkSync(filePath);
    // return res.send(filePath)
})

app.get("/", (req, res) => {
    res.json({ message: "Welcome to BooksStore." });
});

// Tạo cookie
app.get('/cookies/set/:idBook/:quantityBook', (req, res) => {
    // console.log('set');
    // Lấy giỏ hàng từ req 
    let cart
    if (req.cookies.cart === undefined) {
        cart = []
    }
    else {
        cart = JSON.parse(req.cookies.cart);
    }
    // Chuyển cart thành mảng để xử lý
    const arr = Object.values(cart)
    // Kiểm tra sản phẩm đã có trong giỏ hàng hay chưa?     
    if ((arr.find(item => item.idBook === req.params.idBook)) === undefined) {
        // Thêm sản phẩm vào giỏ hàng tạm nếu không có sản phẩm này trong giỏ
        arr.push({
            idBook: req.params.idBook,
            quantityBook: req.params.quantityBook
        })
    }
    else {
        // Cập nhật số lượng giỏ hàng nếu sản phẩm có trong giỏ 
        let indexProduct = arr.findIndex(item => item.idBook === req.params.idBook)
        arr[indexProduct].quantityBook = req.params.quantityBook
    }
    // Cập nhật vào giỏ hàng trong req 
    res.cookie('cart', JSON.stringify(arr), {
        // domain: 'http://localhost:3000/cookies/',
        // encode
        // expires
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // Sau 1 tuần cookie sẽ hết hạng
        // path
        // priority
        secure: false,
        // signed
        sameSite: 'lax' // default là lax 
    });
    // Hiển thị vào trình duyệt 
    res.send(req.cookies.cart);
});
// Đọc cookie
app.get('/cookies/read', (req, res) => {
    let cart
    if (req.cookies.cart === undefined) {
        cart = []
    } else {
        cart = JSON.parse(req.cookies.cart);
    }
    res.send(cart);
});
// Xoá một cookie với idBook
app.get('/cookies/clear/:idBook', (req, res) => {
    // Lấy giỏ hàng từ req 
    let cart
    if (req.cookies.cart === undefined) {
        cart = []
    }
    else {
        cart = JSON.parse(req.cookies.cart);
        // Chuyển cart thành mảng để xử lý
        let arr = Object.values(cart)
        // Kiểm tra sản phẩm đã có trong giỏ hàng hay chưa?     
        if ((arr.find(item => item.idBook === req.params.idBook))) {
            // Xoá sản phẩm khỏi giỏ hàng tạm nếu có sản phẩm này trong giỏ
            arr = arr.filter(item => (item.idBook) !== (req.params.idBook))
        }
        // Cập nhật vào giỏ hàng trong req 
        res.cookie('cart', JSON.stringify(arr), {
            // domain: 'http://localhost:3000/cookies/',
            // encode
            // expires
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // Sau 1 tuần cookie sẽ hết hạng
            // path
            // priority
            secure: false,
            // signed
            sameSite: 'lax' // default là lax 
        });
    }
    // Hiển thị vào trình duyệt 
    res.send(req.cookies.cart);
})
// Xoá cookie cart 
app.get('/cookies/clear', (req, res) => {
    res.clearCookie('cart', { path: '/' })
    res.send(req.cookies)
})
// Create order - PayPal
app.post("/create-paypal-order", async (req, res) => {
    try {
        console.log(req.body.cart[0]);
        const order = await paypal.createOrder(req.body.cart[0]);
        res.json(order);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
//  capture order - PayPal
app.post("/capture-paypal-order", async (req, res) => {
    const { orderID } = req.body;
    try {
        const captureData = await paypal.capturePayment(orderID);
        res.json(captureData);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Lấy dữ liệu chuyển đổi USD/VND từ Google Finance 
app.get('/google-finance', async (req, res) => {
    const { data } = await axios.get('https://www.google.com/finance/quote/USD-VND?hl=vi');
    res.send(data);
});

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
});

module.exports = app;