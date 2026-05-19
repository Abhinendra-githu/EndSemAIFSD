import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiCpu } from 'react-icons/fi';

const RegisterComplaint = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Water Supply',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const categories = [
    'Water Supply', 'Electricity', 'Sanitation', 
    'Road Damage', 'Public Safety', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // 1. Analyze with AI
      let aiData = { priority: 'Medium', department: 'General', summary: 'AI Analysis unavailable', autoResponse: 'We have received your complaint.' };
      try {
        const aiResponse = await axios.post('http://localhost:5000/api/ai/analyze', {
          description: formData.description
        }, config);
        if (aiResponse.data) {
          aiData = aiResponse.data;
        }
      } catch (aiErr) {
        console.error('AI Analysis failed, proceeding with defaults', aiErr);
      }

      // 2. Submit Complaint
      const complaintData = {
        name: user.name,
        email: user.email,
        ...formData,
        priority: aiData.priority,
        department: aiData.department,
        aiSummary: aiData.summary,
        autoResponse: aiData.autoResponse
      };

      await axios.post('http://localhost:5000/api/complaints', complaintData, config);
      navigate('/complaints');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="glass-card p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
            <FiCpu size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Register Complaint</h2>
            <p className="text-gray-600">Our AI will automatically categorize and forward your issue.</p>
          </div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              required
              className="input-field"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
            <textarea
              name="description"
              required
              rows="4"
              className="input-field resize-none"
              placeholder="Provide all necessary details..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                className="input-field"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                required
                className="input-field"
                placeholder="City, Area, or Landmark"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex justify-center items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing & Submitting...</span>
                </>
              ) : (
                <span>Submit Complaint</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterComplaint;
