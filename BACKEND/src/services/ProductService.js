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
      const totalProducts = await Product.countDocuments();
      if (filter) {
        const label = filter[0];
        const allProductsFilter = await Product.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit);
        resolve({
          status: "OK",
          message: "Success",
          data: allProductsFilter,
          totalProducts: totalProducts,
          currentPage: Number(page + 1),
          totalPages: Math.ceil(totalProducts / limit),
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allProductsSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);
        resolve({
          status: "OK",
          message: "Success",
          data: allProductsSort,
          totalProducts: totalProducts,
          currentPage: Number(page + 1),
          totalPages: Math.ceil(totalProducts / limit),
        });
      }
      const allProducts = await Product.find()
        .limit(limit)
        .skip(page * limit);
      // .sort({name:sort});
      resolve({
        status: "OK",
        message: "Success",
        data: allProducts,
        totalProducts: totalProducts,
        currentPage: Number(page + 1),
        totalPages: Math.ceil(totalProducts / limit),
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        reject({
          status: 400,
          message: "Invalid input.",
          error: error.message,
        });
      } else {
        reject({
          status: 500,
          message: "Failed to get all products.",
          error: error.message,
        });
      }
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
module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProducts,
  deleteManyProducts,
};
