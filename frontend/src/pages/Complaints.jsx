import React, { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import '../App.css';

function ComplaintDetailsModal({ complaint, onClose, onCloseComplaint }) {
  if (!complaint) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2 style={{ color: '#2563eb', marginBottom: 12, fontWeight: 800, fontSize: 24 }}>{complaint.title}</h2>
        <div style={{ color: '#444', marginBottom: 20, fontSize: 17, lineHeight: 1.6, whiteSpace: 'pre-line', wordBreak: 'break-word', background: 'rgba(99,102,241,0.06)', borderRadius: 10, padding: 16, fontWeight: 500 }}>{complaint.description}</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 18 }}>
          {new Date(complaint.createdAt).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </div>
        <div style={{ marginBottom: 18 }}>
          <span className={`badge ${complaint.status === 'Open' ? 'open' : 'closed'}`}>{complaint.status}</span>
        </div>
        {complaint.status === 'Open' && (
          <button className="btn" style={{ width: '100%', marginBottom: 12 }} onClick={() => onCloseComplaint(complaint._id)}>
            Mark as Closed
          </button>
        )}
        <button className="btn" style={{ width: '100%' }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchComplaints = async (status = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/complaints${status ? `?status=${status}` : ''}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setComplaints(res.data);
      } else {
        // Show dummy complaints if backend returns empty
        setComplaints([
          { _id: 'dummy1', title: 'Leaking Tap', description: 'The kitchen tap is leaking continuously.', status: 'Open', createdAt: new Date().toISOString() },
          { _id: 'dummy2', title: 'Noisy Neighbors', description: 'Loud music from apartment 302 every night.', status: 'Closed', createdAt: new Date(Date.now() - 86400000).toISOString() },
          { _id: 'dummy3', title: 'Broken Elevator', description: 'Elevator A is not working since yesterday.', status: 'Open', createdAt: new Date(Date.now() - 2*86400000).toISOString() }
        ]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints');
      // Show dummy complaints if backend is unreachable
      setComplaints([
        { _id: 'dummy1', title: 'Leaking Tap', description: 'The kitchen tap is leaking continuously.', status: 'Open', createdAt: new Date().toISOString() },
        { _id: 'dummy2', title: 'Noisy Neighbors', description: 'Loud music from apartment 302 every night.', status: 'Closed', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: 'dummy3', title: 'Broken Elevator', description: 'Elevator A is not working since yesterday.', status: 'Open', createdAt: new Date(Date.now() - 2*86400000).toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(filter);
    // eslint-disable-next-line
  }, [filter]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/complaints', form);
      setForm({ title: '', description: '' });
      setSuccess('Complaint submitted successfully!');
      // Always fetch from backend after submit
      fetchComplaints(filter);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const closeComplaint = async id => {
    try {
      await api.patch(`/complaints/${id}/status`);
      setSuccess('Complaint closed.');
      fetchComplaints(filter);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close complaint');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 className="form-title">Complaints</h2>
        <div className="card" style={{ maxWidth: 500, margin: '0 auto 2rem auto' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Complaint title"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your issue..."
                className="form-textarea"
                required
                style={{ minHeight: 120, width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="form-select"
            style={{ maxWidth: 180 }}
          >
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888', fontSize: 18 }}>Loading...</div>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#bbb', fontSize: 20 }}>No complaints found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
            {complaints.map(c => (
              <div key={c._id} className="card" style={{ minHeight: 160 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 18, color: '#6366f1' }}>{c.title}</h3>
                  <span className={`badge ${c.status === 'Open' ? 'open' : 'closed'}`}>{c.status}</span>
                </div>
                <button className="btn" style={{ width: '100%', marginTop: 8 }} onClick={() => setSelected(c)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
        <ComplaintDetailsModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onCloseComplaint={closeComplaint}
        />
        <Toast message={error} type="error" onClose={() => setError('')} />
        <Toast message={success} type="success" onClose={() => setSuccess('')} />
      </div>
    </>
  );
} 