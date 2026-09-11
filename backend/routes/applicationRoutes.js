const express = require('express');
const {
  applyForProperty,
  getTenantApplications,
  getOwnerApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('tenant'), applyForProperty);
router.get('/tenant', protect, authorize('tenant'), getTenantApplications);
router.get('/owner', protect, authorize('owner', 'admin'), getOwnerApplications);
router.put('/:id/status', protect, authorize('owner', 'admin'), updateApplicationStatus);

module.exports = router;
