const express = require('express');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  upload,
} = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - Public
router.get('/', getProducts);

// POST /api/products - Admin only
const uploadMiddleware = (req, res, next) => {
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ])(req, res, (err) => {
    if (err) {
      console.error('Upload Error:', err);
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'خطأ في رفع الملف', error: err.message });
      }
      return res.status(500).json({ message: 'حدث خطأ أثناء رفع الملف', error: err.message });
    }
    next();
  });
};

router.post(
  '/',
  authenticate,
  authorizeAdmin,
  uploadMiddleware,
  createProduct
);

// PUT /api/products/:id - Admin only
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  uploadMiddleware,
  updateProduct
);

// DELETE /api/products/:id - Admin only
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

module.exports = router;