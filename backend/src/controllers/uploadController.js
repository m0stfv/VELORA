// POST /api/upload - Upload one or more product images (Admin only)
const uploadImages = (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one image to upload',
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urls = files.map((file) => `${baseUrl}/uploads/${file.filename}`);

    res.status(201).json({
      success: true,
      message: 'Images uploaded successfully',
      data: { urls },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload images',
    });
  }
};

module.exports = { uploadImages };
