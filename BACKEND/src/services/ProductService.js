const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      rating,
      description,
      discount,
    } = newProduct;

    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct != null) {
        resolve({
          status: "OK",
          message: "The name of product is already registered",
        });
      }

      const newProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
        discount,
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "Product created successfully.",
          data: newProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });

      if (!checkProduct) {
        resolve({
          status: "OK",
          message: "The product is not defined.",
        });
        return;
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "Success",
        data: updatedProduct,
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Failed to update product.",
        error: error,
      });
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });

      if (!checkProduct) {
        resolve({
          status: "OK",
          message: "The product is not defined.",
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Failed to delete product.",
        error: error,
      });
    }
  });
};
const deleteManyProducts = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Failed to delete product.",
        error: error,
      });
    }
  });
};

const getAllProducts = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};

      // Xử lý filter
      if (filter?.field && filter?.value) {
        query = {
          [filter.field]: { $regex: filter.value, $options: "i" },
        };
      }

      // Xử lý phân trang
      const limitNumber = parseInt(limit) || 10;
      const pageNumber = parseInt(page) || 0;

      // Thực hiện query
      let productsQuery = Product.find(query);

      // Xử lý sort nếu có
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        productsQuery = productsQuery.sort(objectSort);
      }

      // Thêm limit và skip
      let products;
      if (!limit) {
        products = await productsQuery;
      } else {
        products = await productsQuery
          .limit(limitNumber)
          .skip(pageNumber * limitNumber);
      }

      // Đếm tổng số sản phẩm sau khi filter
      const filteredCount = await Product.countDocuments(query);

      resolve({
        status: "OK",
        message: "Success",
        data: products,
        totalProducts: filteredCount,
        currentPage: Number(pageNumber + 1),
        totalPages: Math.ceil(filteredCount / limitNumber),
      });
    } catch (error) {
      reject({
        status: error.name === "ValidationError" ? 400 : 500,
        message:
          error.name === "ValidationError"
            ? "Invalid input"
            : "Failed to get products",
        error: error.message,
      });
    }
  });
};

const getAllTypes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allTypes = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "Success",
        data: allTypes,
      });
    } catch (error) {
      reject({
        status: error.name === "ValidationError" ? 400 : 500,
        error: error.message,
      });
    }
  });
};
const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id });

      if (!product) {
        resolve({
          status: "OK",
          message: "The product is not defined.",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: product,
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Failed to get product.",
        error: error,
      });
    }
  });
};
module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProducts,
  deleteManyProducts,
  getAllTypes,
};
