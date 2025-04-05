const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      phone,
    } = req.body;

    if (
      !paymentMethod ||
      !itemsPrice ||
      !shippingPrice ||
      !totalPrice ||
      !fullName ||
      !address ||
      !phone
    ) {
      return res
        .status(200)
        .json({ status: "ERR", message: "All fields are required." });
    }

    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

module.exports = {
  createOrder,
};
