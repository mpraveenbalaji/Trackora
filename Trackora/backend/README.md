# Trackora Backend API

A RESTful API backend for the **Trackora Sales Field Intelligence Platform**, built with Node.js, Express, and SQLite (better-sqlite3).

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start the server (automatically seeds demo data on first run)
npm start

# Development mode (with nodemon auto-reload)
npm run dev
```

Server runs at: **http://localhost:5000**

## 👤 Default Users (Seeded on First Run)

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| admin@trackora.in | admin123 | admin | Single Master Admin (All India Central Command) |
| praveen@trackora.in | sales123 | sales_rep | Field Sales Rep (Chennai & Tamil Nadu) |
| inthiyaz@trackora.in | sales123 | sales_rep | Field Sales Rep (Bengaluru & Karnataka) |

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |
| POST | `/api/auth/logout` | Logout (client discards token) |
| POST | `/api/auth/change-password` | Change password |

### Visits
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/visits` | List visits (own or all) | All roles |
| POST | `/api/visits` | Log a new visit | sales_rep |
| GET | `/api/visits/:id` | Get a single visit | All roles |
| PATCH | `/api/visits/:id` | Update visit | Owner or admin |
| DELETE | `/api/visits/:id` | Delete visit | Owner or admin |
| PATCH | `/api/visits/:id/approve` | Approve visit | manager, admin |
| PATCH | `/api/visits/:id/reject` | Reject visit | manager, admin |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance/checkin` | Daily GPS check-in |
| PATCH | `/api/attendance/checkout` | GPS check-out |
| GET | `/api/attendance/today` | Today's status |
| GET | `/api/attendance/history` | Attendance history |
| GET | `/api/attendance` | All attendance (manager/admin) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | KPI summary for current user |
| GET | `/api/dashboard/stats` | Admin aggregated stats |
| GET | `/api/dashboard/leaderboard` | Sales rep leaderboard |
| GET | `/api/dashboard/notifications` | User notifications |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/overview` | Full admin overview |
| GET | `/api/admin/pending-visits` | Pending approvals list |
| GET | `/api/admin/users` | All users with stats |
| GET | `/api/admin/reports` | Monthly reports |
| GET | `/api/admin/clients` | Client list |
| POST | `/api/admin/clients` | Create client |
| GET | `/api/admin/targets` | View targets |
| POST | `/api/admin/targets` | Set user target |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users (manager/admin) |
| GET | `/api/users/me/profile` | Current user profile with stats |
| GET | `/api/users/:id` | Get a user |
| POST | `/api/users` | Create user (admin only) |
| PATCH | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Deactivate user (admin only) |

## 🔐 Authentication

Include the JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

## 🗄️ Database

- Uses **SQLite** via `better-sqlite3` for embedded, zero-config storage
- Database file: `./data/trackora.db` (auto-created on first run)
- Tables: `users`, `visits`, `attendance`, `clients`, `targets`, `notifications`

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.js              # Main entry point
│   ├── database/
│   │   └── init.js            # DB schema + seed data
│   ├── middleware/
│   │   └── auth.middleware.js # JWT auth + RBAC
│   └── routes/
│       ├── auth.routes.js     # Authentication
│       ├── visit.routes.js    # Visit management
│       ├── attendance.routes.js # Attendance
│       ├── dashboard.routes.js  # KPI dashboard
│       ├── user.routes.js     # User management
│       └── admin.routes.js    # Admin panel
├── data/                      # SQLite database (auto-created)
├── .env                       # Environment config (not committed)
├── .env.example               # Environment template
└── package.json
```

## 🛠️ Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: SQLite via better-sqlite3
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: express-validator
- **Logging**: morgan
