import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import '../styles.css';
import { useNavigate } from 'react-router-dom';

// Mock user data (replace with real localStorage/user context in production)
const getUser = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  return {
    name: user.name || 'John Doe',
    email: user.email || 'john@example.com',
    phone: user.phone || '9876543210',
    flat: user.flat || 'A-101',
    apartment: user.apartment || 'Sunshine Residency',
    avatar: user.avatar || '/logo.png',
  };
};

export default function Profile() {
  const [user, setUser] = useState(getUser());
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(user);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = () => setEdit(true);
  const handleCancel = () => {
    setForm(user);
    setAvatarPreview(user.avatar);
    setEdit(false);
  };
  const handleSave = e => {
    e.preventDefault();
    const updated = { ...form, avatar: avatarPreview };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    setEdit(false);
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
    <Navbar />
      <div className="background"></div>
      <div className="centered-container">
        <div className="form-card" style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
            <img
              src={avatarPreview || '/logo.png'}
              alt="Profile"
              className="logo"
            />
            {edit && (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: '#0ea5e9',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px 0 rgba(60,72,88,0.12)',
                  cursor: 'pointer',
                  fontSize: 20,
                  outline: 'none',
                  borderWidth: 0
                }}
                title="Change avatar"
              >
                <span role="img" aria-label="Edit">✏️</span>
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          <div className="form-title" style={{ marginBottom: 28 }}>My Profile</div>
          {!edit ? (
            <>
              <div style={{ textAlign: 'left', marginBottom: 24 }}>
                <ProfileRow label="Name" value={user.name} />
                <ProfileRow label="Email" value={user.email} />
                <ProfileRow label="Phone" value={user.phone} />
                <ProfileRow label="Flat Number" value={user.flat} />
                <ProfileRow label="Apartment" value={user.apartment} />
              </div>
              <button className="btn" style={{ width: 'auto', padding: '0.7em 2.5em' }} onClick={handleEdit}>
                Edit
              </button>
            </>
          ) : (
            <form onSubmit={handleSave} style={{ textAlign: 'left' }}>
              <ProfileEdit label="Name" name="name" value={form.name} onChange={handleChange} />
              <ProfileEdit label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
              <ProfileEdit label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <ProfileEdit label="Flat Number" name="flat" value={form.flat} onChange={handleChange} />
              <ProfileEdit label="Apartment" name="apartment" value={form.apartment} onChange={handleChange} />
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="submit" className="btn" style={{ width: '50%' }}>Save</button>
                <button type="button" className="btn" style={{ width: '50%', background: '#e5e7eb', color: '#2563eb', boxShadow: 'none' }} onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          )}
          <div style={{ marginTop: 32 }}>
            <button className="btn" style={{ width: '100%' }} onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <span style={{ display: 'block', fontWeight: 600, color: '#2563eb', fontSize: 15 }}>{label}</span>
      <span style={{ display: 'block', color: '#222', fontSize: 17, marginTop: 2 }}>{value}</span>
    </div>
  );
}

function ProfileEdit({ label, name, value, onChange, type = 'text' }) {
  return (
    <div className="form-group" style={{ marginBottom: 18 }}>
      <label className="form-label" htmlFor={name}>{label}</label>
      <input
        className="form-input"
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
} 