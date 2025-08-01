import React, { useEffect, useState } from 'react';

const Notification = ({ message, type = 'success', isVisible, onClose }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(() => onClose(), 300); // Wait for animation to complete
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getNotificationStyle = () => {
    const baseStyle = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
      maxWidth: '400px',
      minWidth: '300px',
      transform: isShowing ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      border: '1px solid',
      animation: 'slideIn 0.3s ease-out'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          borderColor: '#10b981',
          color: '#065f46'
        };
      case 'error':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          borderColor: '#ef4444',
          color: '#991b1b'
        };
      case 'warning':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          borderColor: '#f59e0b',
          color: '#92400e'
        };
      default:
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          borderColor: '#6366f1',
          color: '#3730a3'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div style={getNotificationStyle()}>
      <span style={{ fontSize: '20px' }}>{getIcon()}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
          {type === 'success' ? 'Booking Confirmed!' : 
           type === 'error' ? 'Booking Failed!' : 
           type === 'warning' ? 'Booking Warning!' : 'Notification'}
        </div>
        <div style={{ fontSize: '13px', opacity: 0.9 }}>{message}</div>
      </div>
      <button
        onClick={() => {
          setIsShowing(false);
          setTimeout(() => onClose(), 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          opacity: 0.7,
          padding: '4px',
          borderRadius: '4px',
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        ×
      </button>
    </div>
  );
};

export default Notification; 