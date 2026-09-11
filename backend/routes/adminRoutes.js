const express = require('express');
const {
  getPlatformStats,
  getPendingProperties,
  verifyProperty,
  getUsers,
  toggleUserStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/properties/pending', getPendingProperties);
router.put('/properties/:id/verify', verifyProperty);
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);

module.exports = router;
