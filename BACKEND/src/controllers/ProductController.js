const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      rating,
      description,
      discount,
    } = req.body;

    if (
      !name ||
      !image ||
      !type ||
      !price ||
      !countInStock ||
      !rating ||
      !description ||
      !discount
    ) {
      return res
        .status(200)
        .json({ status: "ERR", message: "All fields product are required." });
    }

    const response = await ProductService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    if (!productId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Product ID is required." });
    }

    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Product ID is required." });
    }

    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Product ID is required." });
    }

    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};
const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Product ID is required." });
    }

    const response = await ProductService.deleteManyProducts(ids);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProducts(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const getAllTypes = async (req, res) => {
  try {
    const response = await ProductService.getAllTypes();
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
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProducts,
  deleteMany,
  getAllTypes,
};
