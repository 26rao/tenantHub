import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  // Dummy analytics data
  const complaintStats = {
    labels: ['Open', 'Closed', 'In Progress'],
    datasets: [{
      data: [7, 12, 3],
      backgroundColor: ['#6366f1', '#10b981', '#f59e42'],
      borderWidth: 1,
    }],
  };
  const rentStats = {
    labels: ['Paid', 'Due'],
    datasets: [{
      data: [9, 2],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 1,
    }],
  };
  const complaintCategories = {
    labels: ['Noise', 'Maintenance', 'Cleanliness', 'Security', 'Other'],
    datasets: [{
      label: 'Complaints',
      data: [5, 8, 3, 2, 4],
      backgroundColor: ['#6366f1', '#f59e42', '#fbbf24', '#0ea5e9', '#a78bfa'],
      borderRadius: 8,
    }],
  };

  // Live issue tracker data with actual complaints
  const [liveComplaints, setLiveComplaints] = useState([
    {
      id: 'c1',
      title: 'Water Leak in Kitchen',
      status: 'In Progress',
      priority: 'High',
      category: 'Plumbing',
      updates: [
        { label: 'Reported', time: 'Today 9:30 AM', done: true },
        { label: 'Plumber Assigned', time: 'Today 10:15 AM', done: true },
        { label: 'In Progress', time: 'Today 11:00 AM', done: true },
        { label: 'Resolved', time: '', done: false },
      ],
    },
    {
      id: 'c2',
      title: 'Elevator A Not Working',
      status: 'Technician Assigned',
      priority: 'High',
      category: 'Electrical',
      updates: [
        { label: 'Reported', time: 'Yesterday 8:00 AM', done: true },
        { label: 'Technician Assigned', time: 'Yesterday 9:00 AM', done: true },
        { label: 'In Progress', time: '', done: false },
        { label: 'Resolved', time: '', done: false },
      ],
    },
    {
      id: 'c3',
      title: 'Loud Music from Apartment 302',
      status: 'Committee Notified',
      priority: 'Medium',
      category: 'Noise',
      updates: [
        { label: 'Reported', time: '2 days ago', done: true },
        { label: 'Committee Notified', time: 'Yesterday', done: true },
        { label: 'In Progress', time: '', done: false },
        { label: 'Resolved', time: '', done: false },
      ],
    },
    {
      id: 'c4',
      title: 'Broken Street Light',
      status: 'Resolved',
      priority: 'Low',
      category: 'Electrical',
      updates: [
        { label: 'Reported', time: '3 days ago', done: true },
        { label: 'Technician Assigned', time: '2 days ago', done: true },
        { label: 'In Progress', time: 'Yesterday', done: true },
        { label: 'Resolved', time: 'Today 2:00 PM', done: true },
      ],
    },
  ]);

  // Add after other imports
  const services = [
    { key: 'pest', label: 'Pest Control', color: '#f59e42' },
    { key: 'plumbing', label: 'Plumbing', color: '#6366f1' },
    { key: 'electrical', label: 'Electrical', color: '#10b981' },
  ];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const slots = ['9:00', '11:00', '13:00', '15:00', '17:00'];

  // Dummy state for booked slots (frontend only)
  const [bookings, setBookings] = useState([
    { day: 1, slot: 0, service: 'pest', user: 'You' },
    { day: 2, slot: 2, service: 'plumbing', user: 'You' },
    { day: 4, slot: 1, service: 'electrical', user: 'Other' },
  ]);
  const [bookingMsg, setBookingMsg] = useState('');
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  function handleBook(service, dayIdx, slotIdx) {
    if (bookings.some(b => b.day === dayIdx && b.slot === slotIdx && b.service === service)) {
      setNotification({
        isVisible: true,
        message: 'This slot is already booked. Please choose another time.',
        type: 'warning'
      });
      return;
    }
    
    const serviceName = services.find(s => s.key === service)?.label || service;
    const dayName = days[dayIdx];
    const timeSlot = slots[slotIdx];
    
    setBookings([...bookings, { day: dayIdx, slot: slotIdx, service, user: 'You' }]);
    
    setNotification({
      isVisible: true,
      message: `${serviceName} appointment confirmed for ${dayName} at ${timeSlot}. You will receive a reminder 1 hour before.`,
      type: 'success'
    });
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-fullscreen" style={{ 
        minHeight: 'calc(100vh - 70px)', 
        width: '100vw', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
        margin: 0, 
        padding: '20px',
        overflowX: 'hidden'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: 1400, 
          margin: '0 auto',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '32px'
        }}>
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 className="form-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎉 Welcome, {user?.name || 'Resident'}!</h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#334155', 
              lineHeight: 1.7, 
              fontWeight: 500, 
              maxWidth: 800, 
              margin: '0 auto',
              letterSpacing: 0.1 
            }}>
              Welcome to your Resident Portal. Here you can stay informed with the latest community notices, manage your rent payments, and submit or track complaints—all in one secure, convenient place.
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', 
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6366f1', marginBottom: '8px' }}>5</div>
              <div style={{ color: '#64748b', fontSize: '1rem' }}>Active Complaints</div>
            </div>
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, #d1fae5 0%, #e0e7ff 100%)', 
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>₹12,000</div>
              <div style={{ color: '#64748b', fontSize: '1rem' }}>Rent Due</div>
            </div>
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, #fef3c7 0%, #e0e7ff 100%)', 
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>3</div>
              <div style={{ color: '#64748b', fontSize: '1rem' }}>New Notices</div>
            </div>
            <div className="card" style={{ 
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)', 
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#222', marginBottom: '8px' }}>85%</div>
              <div style={{ color: '#64748b', fontSize: '1rem' }}>Satisfaction Rate</div>
            </div>
          </div>

          {/* Navigation Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div className="card dashboard-card dashboard-square" style={{ aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', boxShadow: 'none', padding: 24, cursor: 'pointer', transition: 'transform 0.15s' }} onClick={() => navigate('/notices')} tabIndex={0} role="button" onKeyPress={e => { if (e.key === 'Enter') navigate('/notices'); }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#6366f1', marginBottom: 8, display: 'block' }}>Notices</span>
              <span style={{ color: '#64748b', fontSize: 15, textAlign: 'center' }}>Stay updated with the latest community news.</span>
            </div>
            <div className="card dashboard-card dashboard-square" style={{ aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #d1fae5 0%, #e0e7ff 100%)', boxShadow: 'none', padding: 24, cursor: 'pointer', transition: 'transform 0.15s' }} onClick={() => navigate('/complaints')} tabIndex={0} role="button" onKeyPress={e => { if (e.key === 'Enter') navigate('/complaints'); }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#10b981', marginBottom: 8, display: 'block' }}>Complaints</span>
              <span style={{ color: '#64748b', fontSize: 15, textAlign: 'center' }}>Submit and track your complaints easily.</span>
            </div>
            <div className="card dashboard-card dashboard-square" style={{ aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)', boxShadow: 'none', padding: 24, cursor: 'pointer', transition: 'transform 0.15s' }} onClick={() => navigate('/rent')} tabIndex={0} role="button" onKeyPress={e => { if (e.key === 'Enter') navigate('/rent'); }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#222', marginBottom: 8, display: 'block' }}>Rent</span>
              <span style={{ color: '#64748b', fontSize: 15, textAlign: 'center' }}>View your rent payment history.</span>
            </div>
          </div>
          <div className="card" style={{ 
            width: '100%', 
            padding: '2rem', 
            boxShadow: '0 8px 32px 0 rgba(60,72,88,0.10)', 
            border: '1.5px solid #e5e7eb', 
            borderRadius: '1.5rem',
            background: 'rgba(255,255,255,0.95)'
          }}>
            <h2 style={{ 
              fontWeight: 800, 
              fontSize: '2rem', 
              color: '#2563eb', 
              marginBottom: '2rem', 
              textAlign: 'center', 
              letterSpacing: '-1px' 
            }}>
              📊 Insightful Dashboard Analytics
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              alignItems: 'center'
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', 
                borderRadius: '16px', 
                padding: '24px', 
                boxShadow: '0 4px 20px 0 rgba(60,72,88,0.08)',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ 
                  fontWeight: 700, 
                  fontSize: '1.2rem', 
                  color: '#6366f1', 
                  marginBottom: '1rem', 
                  textAlign: 'center' 
                }}>Complaints by Status</h3>
                <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pie data={complaintStats} options={{ 
                    plugins: { 
                      legend: { 
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          font: {
                            size: 12
                          }
                        }
                      } 
                    },
                    responsive: true,
                    maintainAspectRatio: false
                  }} />
                </div>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #d1fae5 0%, #e0e7ff 100%)', 
                borderRadius: '16px', 
                padding: '24px', 
                boxShadow: '0 4px 20px 0 rgba(60,72,88,0.08)',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ 
                  fontWeight: 700, 
                  fontSize: '1.2rem', 
                  color: '#10b981', 
                  marginBottom: '1rem', 
                  textAlign: 'center' 
                }}>Rent Paid vs Due</h3>
                <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Doughnut data={rentStats} options={{ 
                    plugins: { 
                      legend: { 
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          font: {
                            size: 12
                          }
                        }
                      } 
                    },
                    responsive: true,
                    maintainAspectRatio: false
                  }} />
                </div>
              </div>
            </div>
          </div>
          <div className="card" style={{ 
            width: '100%', 
            padding: '2rem', 
            boxShadow: '0 8px 32px 0 rgba(60,72,88,0.10)', 
            border: '1.5px solid #e5e7eb', 
            borderRadius: '1.5rem',
            background: 'rgba(255,255,255,0.95)'
          }}>
            <h2 style={{ 
              fontWeight: 800, 
              fontSize: '2rem', 
              color: '#2563eb', 
              marginBottom: '2rem', 
              textAlign: 'center', 
              letterSpacing: '-1px' 
            }}>
              🚨 Live Issue Tracker
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {liveComplaints.map(c => (
                <div key={c.id} style={{ 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 4px 20px 0 rgba(60,72,88,0.08)', 
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <h3 style={{ 
                      fontWeight: 700, 
                      fontSize: '1.1rem', 
                      color: '#1e293b', 
                      margin: 0,
                      lineHeight: '1.3'
                    }}>{c.title}</h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#fff',
                      background: c.priority === 'High' ? '#ef4444' : c.priority === 'Medium' ? '#f59e0b' : '#10b981'
                    }}>{c.priority}</span>
                  </div>
                  
                  <div style={{ 
                    marginBottom: '16px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      fontWeight: 600, 
                      color: '#10b981', 
                      fontSize: '0.9rem',
                      padding: '4px 12px',
                      background: 'rgba(16,185,129,0.1)',
                      borderRadius: '8px'
                    }}>{c.status}</span>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: '#64748b',
                      fontWeight: '500'
                    }}>{c.category}</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {c.updates.map((u, idx) => (
                      <div key={u.label} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '8px 0'
                      }}>
                        <span style={{
                          display: 'inline-block',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: u.done ? '#10b981' : '#e5e7eb',
                          border: u.done ? '2px solid #10b981' : '2px solid #cbd5e1',
                          transition: 'background 0.2s',
                        }} />
                        <span style={{ 
                          fontWeight: 600, 
                          color: u.done ? '#10b981' : '#64748b', 
                          fontSize: '0.9rem',
                          flex: 1
                        }}>{u.label}</span>
                        <span style={{ 
                          color: '#888', 
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>{u.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ 
            width: '100%', 
            padding: '2rem', 
            boxShadow: '0 8px 32px 0 rgba(60,72,88,0.10)', 
            border: '1.5px solid #e5e7eb', 
            borderRadius: '1.5rem',
            background: 'rgba(255,255,255,0.95)'
          }}>
            <h2 style={{ 
              fontWeight: 800, 
              fontSize: '2rem', 
              color: '#2563eb', 
              marginBottom: '2rem', 
              textAlign: 'center', 
              letterSpacing: '-1px' 
            }}>
              🔧 Maintenance Booking System
            </h2>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '32px'
            }}>
              {services.map(service => (
                <div key={service.key} style={{ background: 'rgba(99,102,241,0.07)', borderRadius: 18, padding: 24, boxShadow: '0 2px 12px 0 rgba(60,72,88,0.08)' }}>
                  <h3 style={{ fontWeight: 700, fontSize: 20, color: service.color, marginBottom: 18, textAlign: 'left' }}>{service.label}</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: 'rgba(255,255,255,0.95)', borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(60,72,88,0.08)' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '12px 10px', fontWeight: 700, color: '#2563eb', fontSize: 16, background: 'none' }}></th>
                          {days.map((d, i) => (
                            <th key={d} style={{ padding: '12px 10px', fontWeight: 700, color: '#2563eb', fontSize: 16, background: 'none' }}>{d}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {slots.map((slot, slotIdx) => (
                          <tr key={slot}>
                            <td style={{ padding: '10px 8px', fontWeight: 600, color: '#64748b', fontSize: 15 }}>{slot}</td>
                            {days.map((d, dayIdx) => {
                              const booking = bookings.find(b => b.day === dayIdx && b.slot === slotIdx && b.service === service.key);
                              return (
                                <td key={d} style={{ padding: 0, textAlign: 'center' }}>
                                  {booking ? (
                                    <div style={{ background: booking.user === user?._id ? '#10b981' : '#6366f1', color: '#fff', borderRadius: 8, padding: '7px 0', fontWeight: 700, fontSize: 14, margin: 4, boxShadow: '0 1px 4px 0 rgba(60,72,88,0.10)' }}>
                                      {booking.user === user?._id ? 'Booked' : 'Reserved'}
                                    </div>
                                  ) : (
                                    <button className="btn" style={{ background: '#e0e7ef', color: '#2563eb', fontWeight: 700, fontSize: 14, borderRadius: 8, padding: '7px 0', width: '90%', margin: 4, border: 'none', boxShadow: 'none' }} onClick={() => handleBook(service.key, dayIdx, slotIdx)}>
                                      Book
                                    </button>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Web Push Notification */}
      <Notification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </>
  );
} 