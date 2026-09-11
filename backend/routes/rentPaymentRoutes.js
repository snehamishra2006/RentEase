const express = require('express');
const { getRentPayments, payRent, generateDuePayment } = require('../controllers/rentPaymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, getRentPayments);
router.post('/:id/pay', protect, authorize('tenant'), payRent);
router.post('/generate-due', protect, authorize('owner', 'admin'), generateDuePayment);

module.exports = router;
