const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.post("/create", OrderController.createOrder);
router.get("/get-all-order/:id", OrderController.getAllOrder);
router.get("/get-details-order/:id", OrderController.getDetailsOrder);
router.delete("/cancel-order/:id", OrderController.cancelOrder);
module.exports = router;
