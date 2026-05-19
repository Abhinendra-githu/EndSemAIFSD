const Complaint = require('../models/Complaint');

// Add Complaint
const addComplaint = async (req, res) => {
  try {
    const { name, email, title, description, category, location } = req.body;
    
    if (!title || !description || !location || !email || !name) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const complaint = await Complaint.create(req.body);
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Complaints
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Complaint Status
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Complaint
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    await complaint.deleteOne();
    res.json({ id: req.params.id, message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Complaint by Location
const searchByLocation = async (req, res) => {
  try {
    const location = req.query.location;
    const complaints = await Complaint.find({ location: new RegExp(location, 'i') });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filter by Category
const filterByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    const complaints = await Complaint.find({ category: new RegExp(category, 'i') });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComplaint,
  getComplaints,
  updateComplaint,
  deleteComplaint,
  searchByLocation,
  filterByCategory
};
