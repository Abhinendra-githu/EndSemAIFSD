import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/complaints', config);
        setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [user.token]);

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-4rem)]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  const userComplaints = user.role === 'admin' ? complaints : complaints.filter(c => c.email === user.email);
  
  const stats = {
    total: userComplaints.length,
    pending: userComplaints.filter(c => c.status === 'Pending').length,
    resolved: userComplaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your smart complaint system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border-t-4 border-t-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Complaints</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <FiAlertCircle size={24} />
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 border-t-4 border-t-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
              <FiClock size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-t-4 border-t-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.resolved}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <FiCheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity / AI Summary */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Complaints AI Insights</h2>
        <div className="space-y-4">
          {userComplaints.slice(0, 5).map((complaint) => (
            <div key={complaint._id} className="border border-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow bg-gray-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{complaint.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">AI Summary: {complaint.aiSummary || 'Analysis pending'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                  complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {complaint.priority || 'Unassigned'}
                </span>
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Dept: {complaint.department || 'N/A'}</span>
                <span className={`px-2 py-1 rounded ${
                  complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                }`}>Status: {complaint.status}</span>
              </div>
            </div>
          ))}
          {userComplaints.length === 0 && (
            <p className="text-gray-500 text-center py-4">No complaints registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
