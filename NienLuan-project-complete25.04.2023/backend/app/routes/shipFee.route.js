const express = require('express');
const shipFee = require('../controllers/shipFee.controller');

const router = express.Router();

router.route('/').get(shipFee.findAll).post(shipFee.create).delete(shipFee.deleteAll);

router.route('/:id').get(shipFee.findOne).put(shipFee.update).delete(shipFee.delete);

// router.route('/drop/:name').post(shipFee.dropCollection)
module.exports = router;