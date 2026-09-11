const express = require('express');
const {
  createMaintenanceRequest,
  getTenantMaintenanceRequests,
  getOwnerMaintenanceRequests,
  updateMaintenanceStatus,
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('tenant'), createMaintenanceRequest);
router.get('/tenant', protect, authorize('tenant'), getTenantMaintenanceRequests);
router.get('/owner', protect, authorize('owner', 'admin'), getOwnerMaintenanceRequests);
router.put('/:id/status', protect, authorize('owner', 'admin'), updateMaintenanceStatus);

module.exports = router;
