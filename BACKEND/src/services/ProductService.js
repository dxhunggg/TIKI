const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, countInStock, rating, description } =
      newProduct;

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
      console.log("Updating product with data:", data);
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

const getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const allProducts = await Product.find()
        resolve({
          status: "OK",
          message: "Success",
          data: allProducts,
        });
      } catch (error) {
        reject({
          status: 500,
          message: "Failed to get all products.",
          error: error,
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
        message: "Failed to delete product.",
        error: error,
      });
    }
  });
};
module.exports = { createProduct, updateProduct, getDetailsProduct, deleteProduct, getAllProducts };
