const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { normalizeLocalizedField } = require('../utils/localization');

// Helper function to generate slug
const generateSlug = (name) => {
  const ascii = String(name || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
  return ascii || `item-${Date.now()}`;
};

// GET all products with filters and sorting
const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort, featured } = req.query;

    // Build filter object
    let filter = {};

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category) && String(new mongoose.Types.ObjectId(category)) === String(category)) {
        filter.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: String(category).toLowerCase() });
        if (foundCategory) filter.category = foundCategory._id;
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      const searchValue = String(search).trim();
      if (searchValue) {
        filter.$or = [
          { 'name.ar': { $regex: searchValue, $options: 'i' } },
          { 'name.en': { $regex: searchValue, $options: 'i' } },
          { name: { $regex: searchValue, $options: 'i' } },
          { 'description.ar': { $regex: searchValue, $options: 'i' } },
          { 'description.en': { $regex: searchValue, $options: 'i' } },
          { description: { $regex: searchValue, $options: 'i' } },
        ];
      }
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    // Build sort object
    let sortObj = {};
    if (sort) {
      switch (sort) {
        case 'price-low':
        case 'price-asc':
          sortObj.price = 1;
          break;
        case 'price-high':
        case 'price-desc':
          sortObj.price = -1;
          break;
        case 'newest':
          sortObj.createdAt = -1;
          break;
        case 'rating':
          sortObj.rating = -1;
          break;
        default:
          sortObj.createdAt = -1;
      }
    } else {
      sortObj.createdAt = -1;
    }

    const products = await Product.find(filter).sort(sortObj).populate('category');

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch products',
    });
  }
};

// GET single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch product',
    });
  }
};

// CREATE product (Admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, images, category, brand, stock, featured, sizes, colors } = req.body;
    const localizedName = normalizeLocalizedField(name, 'ar');
    const localizedDescription = normalizeLocalizedField(description, 'ar');

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category not found',
      });
    }

    const product = await Product.create({
      name: localizedName,
      slug: generateSlug(localizedName?.ar || localizedName?.en || localizedName || 'product'),
      description: localizedDescription,
      price,
      discountPrice,
      images: images || [],
      category,
      brand,
      stock,
      featured: featured || false,
      sizes: sizes || [],
      colors: colors || [],
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

// UPDATE product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, images, category, brand, stock, featured, sizes, colors } = req.body;
    const localizedName = normalizeLocalizedField(name, 'ar');
    const localizedDescription = normalizeLocalizedField(description, 'ar');

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found',
        });
      }
    }

    product.name = localizedName || product.name;
    product.slug = localizedName ? generateSlug(localizedName?.ar || localizedName?.en || localizedName || product.slug) : product.slug;
    product.description = localizedDescription || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.images = images || product.images;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.stock = stock || product.stock;
    product.featured = featured !== undefined ? featured : product.featured;
    if (sizes) product.sizes = sizes;
    if (colors) product.colors = colors;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

// DELETE product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product',
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
