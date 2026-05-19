const express = require('express');
const router = express.Router();
const {
  addComplaint,
  getComplaints,
  updateComplaint,
  deleteComplaint,
  searchByLocation,
  filterByCategory
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', searchByLocation);
router.get('/filter', filterByCategory);
router.route('/').post(protect, addComplaint).get(getComplaints);
router.route('/:id').put(protect, updateComplaint).delete(protect, deleteComplaint);

module.exports = router;
