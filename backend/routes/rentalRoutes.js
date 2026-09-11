const express = require('express');
const { getActiveTenantRental, getOwnerRentals, terminateRental } = require('../controllers/rentalController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/tenant/active', protect, authorize('tenant'), getActiveTenantRental);
router.get('/owner', protect, authorize('owner', 'admin'), getOwnerRentals);
router.put('/:id/terminate', protect, authorize('owner', 'admin'), terminateRental);

module.exports = router;
