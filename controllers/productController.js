const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'almadina_store',
    // allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Commented out to test if format restriction is causing 500
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all products with filtering
const getProducts = async (req, res) => {
  try {
    const { category, brand, type } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (type) filter.brand = type; // For accessories, type is stored in brand field

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    console.log('=== CREATE PRODUCT REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('Request files:', req.files);

    const { name, brand, description, price, category } = req.body;

    console.log('Extracted data:', { name, brand, description, price, category });

    // Validate required fields
    if (!name || !brand || !description || !price || !category) {
      console.log('Validation failed: missing fields');
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    // Validate category
    if (!['Laptops', 'Accessories'].includes(category)) {
      console.log('Validation failed: invalid category');
      return res.status(400).json({ message: 'الفئة غير صحيحة' });
    }

    // Check if thumbnail is provided
    if (!req.files || !req.files.thumbnail || req.files.thumbnail.length === 0) {
      return res.status(400).json({ message: 'الصورة الرئيسية مطلوبة' });
    }

    console.log('Creating product object...');

    // Create URLs for images
    const thumbnail = req.files.thumbnail[0].path;

    // Upload additional images
    const images = [];
    if (req.files.images && req.files.images.length > 0) {
      req.files.images.forEach(file => {
        images.push(file.path);
      });
    }

    // Parse specifications if provided
    let specifications = {};
    if (req.body.specifications) {
      try {
        specifications = JSON.parse(req.body.specifications);
      } catch (error) {
        console.log('Error parsing specifications:', error);
      }
    }

    const product = new Product({
      name: name.trim(),
      brand: brand.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      thumbnail,
      images,
      specifications,
    });

    console.log('Product object created:', product);

    console.log('Saving to database...');
    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('=== CREATE PRODUCT ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // Return detailed error response
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'خطأ في البيانات',
        error: messages.join(', '),
        details: error.errors
      });
    }

    // Return generic server error with more details
    res.status(500).json({
      message: 'حدث خطأ في حفظ المنتج',
      error: error.message,
      type: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log('Update request body:', req.body);
    console.log('Update request files:', req.files);

    // Get existing product first
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }

    // Convert price to number if provided
    if (updates.price) {
      updates.price = Number(updates.price);
    }

    // Validate category if provided
    if (updates.category && !['Laptops', 'Accessories'].includes(updates.category)) {
      return res.status(400).json({ message: 'الفئة غير صحيحة' });
    }

    // Trim string fields
    if (updates.name) updates.name = updates.name.trim();
    if (updates.brand) updates.brand = updates.brand.trim();
    if (updates.description) updates.description = updates.description.trim();

    // Handle thumbnail update
    if (req.files?.thumbnail && req.files.thumbnail.length > 0) {
      updates.thumbnail = req.files.thumbnail[0].path;
    } else if (updates.deleteThumbnail === 'true') {
      // If deleteThumbnail flag is set but no new thumbnail, keep existing
      console.log('Warning: deleteThumbnail flag set but no new thumbnail provided');
    }

    // Handle images update with selective deletion
    let updatedImages = [...existingProduct.images]; // Start with existing images

    // Parse and filter out images marked for deletion
    if (req.body.imagesToDelete) {
      try {
        const imagesToDelete = JSON.parse(req.body.imagesToDelete);
        console.log('Images to delete:', imagesToDelete);
        updatedImages = updatedImages.filter(img => !imagesToDelete.includes(img));
      } catch (error) {
        console.log('Error parsing imagesToDelete:', error);
      }
    }

    // Add new uploaded images
    if (req.files?.images && req.files.images.length > 0) {
      req.files.images.forEach(file => {
        updatedImages.push(file.path);
      });
      console.log('Added new images, total count:', updatedImages.length);
    }

    updates.images = updatedImages;

    // Handle specifications update
    if (req.body.specifications) {
      try {
        updates.specifications = JSON.parse(req.body.specifications);
      } catch (error) {
        console.log('Error parsing specifications for update:', error);
      }
    }

    console.log('Updates to apply:', updates);

    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    console.log('Product updated successfully:', product);
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'خطأ في البيانات', error: messages.join(', ') });
    }
    res.status(500).json({ message: 'حدث خطأ في تحديث المنتج', error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  upload,
};