import React, { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import '../App.css';

function NoticeDetails({ notice, onClose }) {
  if (!notice) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2 style={{ color: '#2563eb', marginBottom: 8 }}>{notice.title}</h2>
        <div style={{ color: '#444', marginBottom: 16 }}>{notice.content}</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          {new Date(notice.createdAt).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </div>
        <button className="btn" style={{ width: 'auto', padding: '0.5em 2em' }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/notices');
        if (res.data && res.data.length > 0) {
          setNotices(res.data);
        } else {
          setNotices([
            { _id: '1', title: 'Holiday Notice - Independence Day', content: 'The society will be closed on 15th August 2025 for Independence Day celebrations. Security will remain active. Please plan accordingly.', createdAt: new Date().toISOString() },
            { _id: '2', title: 'Water Supply Maintenance', content: 'Scheduled water supply interruption on 20th August 2025 from 9am to 1pm for pipeline maintenance. Please store water in advance.', createdAt: new Date(Date.now() - 86400000).toISOString() },
            { _id: '3', title: 'Fire Safety Drill', content: 'Mandatory fire safety drill will be conducted on 25th August 2025 at 6pm. All residents must participate. Meet at the main lobby.', createdAt: new Date(Date.now() - 2*86400000).toISOString() },
            { _id: '4', title: 'Elevator Maintenance Schedule', content: 'Elevator A will undergo maintenance from 28th-30th August 2025. Please use Elevator B during this period. We apologize for the inconvenience.', createdAt: new Date(Date.now() - 3*86400000).toISOString() },
            { _id: '5', title: 'Garbage Collection Time Change', content: 'Effective 1st September 2025, garbage collection time has been changed to 7:30 AM. Please ensure your waste is placed outside by 7:00 AM.', createdAt: new Date(Date.now() - 4*86400000).toISOString() }
          ]);
        }
      } catch (err) {
        setNotices([
          { _id: '1', title: 'Holiday Notice - Independence Day', content: 'The society will be closed on 15th August 2025 for Independence Day celebrations. Security will remain active. Please plan accordingly.', createdAt: new Date().toISOString() },
          { _id: '2', title: 'Water Supply Maintenance', content: 'Scheduled water supply interruption on 20th August 2025 from 9am to 1pm for pipeline maintenance. Please store water in advance.', createdAt: new Date(Date.now() - 86400000).toISOString() },
          { _id: '3', title: 'Fire Safety Drill', content: 'Mandatory fire safety drill will be conducted on 25th August 2025 at 6pm. All residents must participate. Meet at the main lobby.', createdAt: new Date(Date.now() - 2*86400000).toISOString() },
          { _id: '4', title: 'Elevator Maintenance Schedule', content: 'Elevator A will undergo maintenance from 28th-30th August 2025. Please use Elevator B during this period. We apologize for the inconvenience.', createdAt: new Date(Date.now() - 3*86400000).toISOString() },
          { _id: '5', title: 'Garbage Collection Time Change', content: 'Effective 1st September 2025, garbage collection time has been changed to 7:30 AM. Please ensure your waste is placed outside by 7:00 AM.', createdAt: new Date(Date.now() - 4*86400000).toISOString() }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <>
      <Navbar />
      <div className="centered-container" style={{ alignItems: 'flex-start', padding: '20px' }}>
        <div className="form-card" style={{ maxWidth: 800, width: '100%' }}>
          <h2 className="form-title">Community Notices</h2>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#888', fontSize: 18, padding: '40px 0' }}>Loading...</div>
          ) : error ? (
            <Toast message={error} type="error" onClose={() => setError('')} />
          ) : notices.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#bbb', fontSize: 20, padding: '40px 0' }}>No notices available.</div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: '20px',
              '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr'
              }
            }}>
              {notices.map(notice => (
                <div key={notice._id} className="card" style={{ 
                  borderRadius: '1rem', 
                  boxShadow: '0 4px 20px 0 rgba(60,72,88,0.12)', 
                  padding: '1.5rem', 
                  minHeight: '200px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  border: '1px solid #f0f0f0'
                }} onClick={() => setSelected(notice)}>
                  <div>
                    <div style={{ 
                      fontWeight: 700, 
                      fontSize: '18px', 
                      color: '#2563eb', 
                      marginBottom: '12px',
                      lineHeight: '1.3'
                    }}>{notice.title}</div>
                    <div style={{ 
                      color: '#444', 
                      marginBottom: '16px', 
                      fontSize: '15px', 
                      lineHeight: '1.6', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical',
                      minHeight: '60px'
                    }}>{notice.content}</div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <span style={{ 
                      fontSize: '13px', 
                      color: '#888',
                      fontWeight: '500'
                    }}>
                      {new Date(notice.createdAt).toLocaleString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    <button className="btn" style={{ 
                      width: 'auto', 
                      padding: '0.5em 1.5em', 
                      fontSize: '14px',
                      borderRadius: '8px'
                    }} onClick={(e) => {
                      e.stopPropagation();
                      setSelected(notice);
                    }}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <NoticeDetails notice={selected} onClose={() => setSelected(null)} />
      </div>
    </>
  );
} 