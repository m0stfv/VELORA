const Category = require('../models/Category');
const { normalizeLocalizedField } = require('../utils/localization');

// Helper function to generate slug
const generateSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
};

// GET all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories',
    });
  }
};

// GET single category
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch category',
    });
  }
};

// CREATE category (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const localizedName = normalizeLocalizedField(name, 'ar');
    const localizedDescription = normalizeLocalizedField(description, 'ar');

    const categoryExists = await Category.findOne({
      $or: [
        { name: localizedName },
        { 'name.ar': localizedName?.ar || localizedName },
        { 'name.en': localizedName?.en || localizedName },
      ],
    });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    const category = await Category.create({
      name: localizedName,
      slug: generateSlug(localizedName?.ar || localizedName?.en || localizedName || 'category'),
      description: localizedDescription,
      image,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create category',
    });
  }
};

// UPDATE category (Admin only)
const updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const localizedName = normalizeLocalizedField(name, 'ar');
    const localizedDescription = normalizeLocalizedField(description, 'ar');

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    category.name = localizedName || category.name;
    category.slug = localizedName ? generateSlug(localizedName?.ar || localizedName?.en || localizedName || category.slug) : category.slug;
    category.description = localizedDescription || category.description;
    category.image = image || category.image;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update category',
    });
  }
};

// DELETE category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete category',
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
