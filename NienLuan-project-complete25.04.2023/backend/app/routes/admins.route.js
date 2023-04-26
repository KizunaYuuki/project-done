const expires = require("express");
const admins = require("../controllers/admins.controller");

const router = expires.Router();

// Đăng ký - Tạo 
router.route("/register")
    .post(admins.create);

// Đăng nhập
router.route("/login")
    .post(admins.login);

// Đăng xuất
router.route("/logout")
    .get(admins.logout);

// Lấy cookies
router.route("/cookies")
    .get(admins.getCookies);

module.exports = router;