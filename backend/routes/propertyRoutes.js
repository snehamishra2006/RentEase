const express = require('express');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getOwnerProperties,
  uploadImage,
  getVerifiedOwners,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getProperties);
router.get('/owners/verified', getVerifiedOwners);
router.get('/owner/my-properties', protect, authorize('owner', 'admin'), getOwnerProperties);
router.get('/:id', getPropertyById);

router.post('/', protect, authorize('owner', 'admin'), createProperty);
router.post('/upload', protect, authorize('owner', 'admin'), upload.single('image'), uploadImage);
router.put('/:id', protect, authorize('owner', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;
