# Resident Portal – Full-Stack MERN SaaS

A modern, business-grade Resident Portal for apartment communities, built with the MERN stack (MongoDB, Express, React, Node.js). The portal provides a seamless, premium experience for residents to manage notices, complaints, rent, maintenance, and more.

---

## Features

### **Authentication**
- **JWT-based Sign Up, Login, and Logout**
- Secure user registration and login with token storage in localStorage
- Protected routes for all resident features

### **Dashboard**
- **Professional Welcome & Navigation**
- Three main cards (Notices, Complaints, Rent) always displayed in a single row for quick access
- Modern, responsive, and visually appealing layout

### **Analytics**
- **Insightful Dashboard Analytics**
- Pie and doughnut charts (Chart.js) for:
  - Complaints by status
  - Rent paid vs due
- Business-grade, premium look

### **Live Issue Tracker**
- **Delivery-Tracker Style Complaint Progress**
- Real-time status updates for ongoing complaints (dummy data, ready for Socket.IO integration)
- Statuses like "Plumber Assigned", "In Progress", "Resolved" visualized as a tracker

### **Maintenance Booking System**
- **Book Maintenance Slots (Frontend Only)**
- Residents can view a weekly calendar for each service (Pest Control, Plumbing, Electrical)
- Book available slots instantly (all logic in React state, no backend required)
- Services are stacked vertically, each with its own booking table

### **Notices**
- **Community Notices Feed**
- Uniform, professional cards for each notice
- "See Details" modal for full notice content

### **Complaints**
- **Submit and Track Complaints**
- Submit new complaints via a styled form
- View all complaints, filter by status, and see details in a modal
- Mark complaints as closed

### **Rent**
- **Rent Payment History**
- Table of rent records with clear spacing and status badges
- "See Details" modal for each payment
- Dummy data for demo, ready for backend integration

### **Profile**
- **Resident Profile Management**
- View and edit profile details and avatar
- LocalStorage persistence

### **Dark Mode**
- **Full-Screen, Site-Wide Dark Mode**
- Toggle in the navbar, with premium color palette and smooth transitions

---

## Tech Stack

- **Frontend:** React (Vite), Chart.js (react-chartjs-2), Tailwind CSS (customized), pure CSS
- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **Authentication:** JWT (JSON Web Token)
- **State Management:** React hooks, localStorage
- **API Calls:** Centralized Axios instance (`api.js`)
- **Real-Time Ready:** Socket.IO client installed (for future live updates)

---

## Project Structure

```
Final/
  backend/
    models/         # Mongoose models (User, Complaint, Rent, Notice, Booking)
    routes/         # Express routes (auth, complaints, rent, notices, bookings)
    index.js        # Server entry point
  frontend/
    src/
      pages/        # Main pages (Dashboard, Login, Register, Notices, Complaints, Rent, Profile)
      components/   # Shared components (Navbar, Toast, ProtectedRoute)
      api.js        # Centralized Axios instance
      App.css       # Main CSS (with dark mode)
    public/         # Static assets (logo, images)
```

---

## How to Run

1. **Install dependencies:**
   - In `/backend`: `npm install`
   - In `/frontend`: `npm install`

2. **Set up environment variables:**
   - Backend: `.env` with `MONGO_URI` and `JWT_SECRET`
   - Frontend: `.env` with `VITE_API_URL=http://localhost:5000/api`

3. **Start MongoDB** (if using locally)

4. **Start servers:**
   - Backend: `node index.js` or `npm start`
   - Frontend: `npm run dev`

5. **Access the app:**  
   - Go to `http://localhost:5173` (or your Vite port)

---

## Notes

- **Booking system** is currently frontend-only for demo reliability. Backend code is present and ready for integration.
- **Live Issue Tracker** uses dummy data but is ready for real-time updates via Socket.IO.
- **All features are responsive, dark-mode ready, and styled for a premium SaaS experience.**

---

## Future Enhancements

- Connect maintenance booking to backend for multi-user, persistent bookings
- Enable real-time updates for complaints and bookings via Socket.IO
- Admin dashboard for management and analytics
- Email/SMS notifications for residents

---

**Built for a seamless, modern, and connected resident experience.** 