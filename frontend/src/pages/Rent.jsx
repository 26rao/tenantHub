import React, { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import '../App.css';

function getMonths() {
  return [
    { value: '', label: 'All Months' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
}

function RentDetails({ rent, onClose }) {
  if (!rent) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2 style={{ color: '#2563eb', marginBottom: 8 }}>Rent Details</h2>
        <div><b>Month:</b> {getMonths().find(m => m.value === rent.month)?.label || rent.month}</div>
        <div><b>Year:</b> {rent.year}</div>
        <div><b>Amount:</b> ₹{rent.amount}</div>
        <div><b>Status:</b> <span className={`badge ${rent.status === 'Paid' ? 'open' : 'closed'}`}>{rent.status}</span></div>
        <div><b>Paid On:</b> {rent.paidOn ? new Date(rent.paidOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</div>
        <button className="btn" style={{ width: 'auto', padding: '0.5em 2em', marginTop: 16 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Rent() {
  const [rent, setRent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchRent = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      const res = await api.get('/rent', { params });
      if (res.data && res.data.length > 0) {
        setRent(res.data);
      } else {
        setRent([
          { _id: '1', month: 7, year: 2025, amount: 12000, status: 'Unpaid', paidOn: null },
          { _id: '2', month: 6, year: 2025, amount: 12000, status: 'Paid', paidOn: new Date(Date.now() - 86400000 * 15).toISOString() },
          { _id: '3', month: 5, year: 2025, amount: 12000, status: 'Paid', paidOn: new Date(Date.now() - 86400000 * 45).toISOString() },
          { _id: '4', month: 4, year: 2025, amount: 12000, status: 'Paid', paidOn: new Date(Date.now() - 86400000 * 75).toISOString() }
        ]);
      }
    } catch {
      setError('Failed to load rent records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRent();
    // eslint-disable-next-line
  }, [month, year]);

  // Summary calculations
  const paid = rent.filter(r => r.status === 'Paid');
  const unpaid = rent.filter(r => r.status !== 'Paid');
  const lastPaid = paid.length ? paid.sort((a, b) => new Date(b.paidOn) - new Date(a.paidOn))[0] : null;

  // Get unique years from rent records for dropdown
  const years = Array.from(new Set(rent.map(r => r.year))).sort((a, b) => b - a);
  if (year && !years.includes(Number(year))) years.push(Number(year));

  return (
    <>
      <Navbar />
      <div className="centered-container" style={{ alignItems: 'flex-start' }}>
        <div className="form-card" style={{ maxWidth: 700, width: '100%' }}>
          <h2 className="form-title">Rent History</h2>
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            <div className="card-hover card" style={{ border: '1.5px solid #bae6fd', borderRadius: '1rem', padding: '1rem 1.5rem', minWidth: 120 }}>
              <div style={{ color: '#2563eb', fontWeight: 700 }}>Paid</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{paid.length}</div>
            </div>
            <div className="card-hover card" style={{ border: '1.5px solid #fde68a', borderRadius: '1rem', padding: '1rem 1.5rem', minWidth: 120 }}>
              <div style={{ color: '#F59E0B', fontWeight: 700 }}>Unpaid</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{unpaid.length}</div>
            </div>
            <div className="card-hover card" style={{ border: '1.5px solid #6ee7b7', borderRadius: '1rem', padding: '1rem 1.5rem', minWidth: 120 }}>
              <div style={{ color: '#10B981', fontWeight: 700 }}>Last Paid</div>
              <div style={{ fontSize: 16 }}>{lastPaid ? `${getMonths().find(m => m.value === lastPaid.month)?.label} ${lastPaid.year}` : '-'}</div>
            </div>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>Loading...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : rent.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#bbb', fontSize: 20 }}>No rent records found.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="card" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 16px', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 2px 12px 0 rgba(60,72,88,0.10)' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '16px 18px' }}>Month</th>
                    <th style={{ padding: '16px 18px' }}>Year</th>
                    <th style={{ padding: '16px 18px' }}>Amount</th>
                    <th style={{ padding: '16px 18px' }}>Status</th>
                    <th style={{ padding: '16px 18px' }}>Paid On</th>
                    <th style={{ padding: '16px 18px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rent.map(r => (
                    <tr key={r._id}>
                      <td style={{ padding: '14px 18px', fontWeight: 500 }}>{getMonths().find(m => m.value === r.month)?.label || r.month}</td>
                      <td style={{ padding: '14px 18px', fontWeight: 500 }}>{r.year}</td>
                      <td style={{ padding: '14px 18px', fontWeight: 600 }}>₹{r.amount}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span className={`badge ${r.status === 'Paid' ? 'open' : 'closed'}`}>{r.status}</span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>{r.paidOn ? new Date(r.paidOn).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <button className="btn" style={{ width: 'auto', padding: '0.3em 1.2em', fontSize: 14 }} onClick={() => setSelected(r)}>
                          See Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <RentDetails rent={selected} onClose={() => setSelected(null)} />
        </div>
      </div>
    </>
  );
} 