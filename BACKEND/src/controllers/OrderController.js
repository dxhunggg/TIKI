const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      phone,
    } = req.body;

    // Kiểm tra chi tiết từng sản phẩm
    if (orderItems && Array.isArray(orderItems)) {
      orderItems.forEach((item, index) => {});
    }

    // Kiểm tra xem từng sản phẩm có đủ thông tin không
    const missingFieldItems = [];
    if (orderItems && Array.isArray(orderItems)) {
      orderItems.forEach((item, index) => {
        if (
          !item.name ||
          !item.amount ||
          !item.image ||
          !item.price ||
          !item.product
        ) {
          missingFieldItems.push(index + 1);
        }
      });
    }

    if (missingFieldItems.length > 0) {
      return res.status(200).json({
        status: "ERROR",
        message: `Sản phẩm thứ ${missingFieldItems.join(
          ", "
        )} thiếu thông tin. Vui lòng kiểm tra lại.`,
      });
    }

    if (
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0 ||
      !paymentMethod ||
      !fullName ||
      !address ||
      !phone
    ) {
      return res.status(200).json({
        status: "ERROR",
        message: "Thiếu thông tin đơn hàng. Vui lòng kiểm tra lại.",
      });
    }

    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERROR",
      message: error.message || "Lỗi máy chủ nội bộ.",
      error: error.error || null,
    });
  }
};
const getAllOrder = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "User ID is required." });
    }

    const response = await OrderService.getAllOrder(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};
const getDetailsOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "User ID is required." });
    }

    const response = await OrderService.getDetailsOrder(orderId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "User ID is required." });
    }

    const response = await OrderService.cancelOrder(orderId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};
const getAllOrderAdmin = async (req, res) => {
  try {
    const data = await OrderService.getAllOrderAdmin();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};
const adminConfirmOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Order ID is required." });
    }

    const response = await OrderService.adminConfirmOrder(orderId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};
const adminCancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Order ID is required." });
    }

    const response = await OrderService.adminCancelOrder(orderId);
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
  getAllOrder,
  getDetailsOrder,
  cancelOrder,
  getAllOrderAdmin,
  adminConfirmOrder,
  adminCancelOrder,
};
