import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiSearch, FiFilter } from 'react-icons/fi';

const ComplaintList = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const categories = ['', 'Water Supply', 'Electricity', 'Sanitation', 'Road Damage', 'Public Safety', 'Other'];

  const fetchComplaints = async () => {
      try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      let url = '/api/complaints';
      
      if (search) {
        url = `/api/complaints/search?location=${search}`;
      } else if (categoryFilter) {
        url = `/api/complaints/filter?category=${categoryFilter}`;
      }

      const { data } = await axios.get(url, config);
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [search, categoryFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/complaints/${id}`, { status: newStatus }, config);
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  // Admin sees all, users see their own
  const visibleComplaints = user.role === 'admin' ? complaints : complaints.filter(c => c.email === user.email);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Complaints</h1>
          <p className="text-gray-600">Track and manage complaints</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="input-field pl-10 appearance-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.filter(c => c).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleComplaints.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
              No complaints found matching your criteria.
            </div>
          ) : (
            visibleComplaints.map(complaint => (
              <div key={complaint._id} className="glass-card flex flex-col overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                <div className={`h-2 ${complaint.priority === 'High' ? 'bg-red-500' : complaint.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {complaint.category}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{complaint.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{complaint.description}</p>
                  
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <p><strong>Location:</strong> {complaint.location}</p>
                    <p><strong>Dept:</strong> {complaint.department || 'Pending assignment'}</p>
                    <p><strong>Date:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                  </div>

                  {user.role === 'admin' && (
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <select
                        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        value={complaint.status}
                        onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
