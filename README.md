# Smart Local Service Marketplace

A robust and modern MERN (MongoDB, Express, React, Node.js) stack application designed to connect customers with local service professionals. The platform provides a seamless experience for booking, managing, and reviewing services like plumbing, electrical work, cleaning, and more.

## 🚀 Key Features

### 👥 Role-Based Dashboards
- **Customer Dashboard**: Track bookings, manage favorites, write reviews, and update profile details.
- **Provider Dashboard**: Manage service listings, track job requests, view earnings, and toggle availability.
- **Admin Dashboard**: Moderate reviews, manage user/provider accounts, and oversee platform statistics.

### 📅 Booking & Management
- Real-time service booking with custom date and time selection.
- Comprehensive status tracking: `Pending`, `Accepted`, `Completed`, and `Cancelled`.
- Automatic unique Booking ID generation.

### 📧 Automated Notifications
- **Email Alerts**: Powered by Nodemailer, sending automated confirmations and status updates to customers.

### ⭐ Reviews & Ratings
- Verified review system allowing customers to rate services after completion.
- Admin approval workflow for quality control.

### 🖼️ Profile & Customization
- Customizable profiles with avatar upload support (via Multer).
- Dark/Light mode support for a premium user experience.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Authentication**: JWT (JSON Web Tokens) with secure local storage persistence.
- **Utilities**: Nodemailer (Email Service), Multer (File Handling), Dotenv (Environment Management).

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Running locally on `127.0.0.1:27017` or a cloud instance)

### 1. Clone the Repository
```bash
git clone https://github.com/rushabh07/local_service.git
cd local_service
```

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Create a .env file in the root directory
# Add the following:
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
PORT=3000
```

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Run the Application
**Backend:**
```bash
# From the root directory
nodemon index.js
```

**Frontend:**
```bash
# From the client directory
npm start
```

---

## 📂 Project Structure

```text
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI parts
│   │   ├── context/       # Auth & Theme states
│   │   ├── pages/         # Dashboard & Public pages
│   │   └── services/      # API integration
├── config/                # Database configuration
├── middleware/            # Auth & File upload logic
├── models/                # Mongoose Schemas
├── routes/                # API Endpoints
├── utils/                 # Email & Helper utilities
└── index.js               # Main entry point
```

---

## 📧 Email Service Configuration
To enable email notifications:
1. Go to your Google Account settings.
2. Enable **2-Step Verification**.
3. Create an **App Password**.
4. Use that password in the `EMAIL_PASS` field of your `.env` file.

---

## 📜 License
This project is licensed under the ISC License.
