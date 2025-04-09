const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      phone,
      user,
      isPaid,
      paidAt,
    } = newOrder;
    try {
      if (
        !orderItems ||
        !Array.isArray(orderItems) ||
        orderItems.length === 0
      ) {
        return resolve({
          status: "ERROR",
          message: "Không có sản phẩm nào trong đơn hàng",
        });
      }

      const productIds = orderItems.map((item) => item.product);

      const products = await Product.find({ _id: { $in: productIds } });

      const productsNotEnough = [];
      orderItems.forEach((orderItem) => {
        const product = products.find(
          (p) => p._id.toString() === orderItem.product
        );
        if (!product) {
          productsNotEnough.push(orderItem.product);
        } else if (product.countInStock < orderItem.amount) {
          productsNotEnough.push(orderItem.product);
        }
      });

      if (productsNotEnough.length > 0) {
        return resolve({
          status: "ERROR",
          message: `Sản phẩm với id ${productsNotEnough.join(
            ", "
          )} không đủ hàng`,
        });
      }

      const updatePromises = orderItems.map((orderItem) => {
        return Product.updateOne(
          { _id: orderItem.product },
          { $inc: { countInStock: -orderItem.amount, sold: +orderItem.amount } }
        );
      });

      await Promise.all(updatePromises);

      const createdOrder = await Order.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          phone,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: user,
        isPaid: isPaid || false,
        paidAt: paidAt || null,
      });

      if (createdOrder) {
        resolve({
          status: "OK",
          message: "Order created successfully.",
          data: createdOrder,
        });
      } else {
        resolve({
          status: "ERROR",
          message: "Không thể tạo đơn hàng",
        });
      }
    } catch (e) {
      console.error("Error creating order:", e);
      reject({
        status: "ERROR",
        message: "Đã xảy ra lỗi khi tạo đơn hàng",
        error: e.message,
      });
    }
  });
};

const getAllOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({ user: id });

      if (!order) {
        resolve({
          status: "OK",
          message: "The order is not defined.",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: order,
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Failed to get order.",
        error: error,
      });
    }
  });
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({ _id: id });

      if (!order) {
        resolve({
          status: "OK",
          message: "The order is not defined.",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: order,
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Failed to get order.",
        error: error,
      });
    }
  });
};

const cancelOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(id);

      if (!order) {
        resolve({
          status: "ERR",
          message: "Không tìm thấy đơn hàng.",
        });
        return;
      }
      const promises = order.orderItems.map(async (item) => {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: { countInStock: +item.amount, sold: -item.amount },
          },
          { new: true }
        );
      });

      await Promise.all(promises);

      const deletedOrder = await Order.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Hủy đơn hàng thành công",
        data: deletedOrder,
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Hủy đơn hàng thất bại.",
        error: error,
      });
    }
  });
};

module.exports = {
  createOrder,
  getAllOrder,
  getDetailsOrder,
  cancelOrder,
};
