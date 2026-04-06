# Connect Fintech Portal — Backend API

A production-ready Node.js + Express + MySQL backend for the **Connect** Branch Manager Portal (inspired by Arihant Capital).

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js >= 18.x
- MySQL >= 8.x running locally

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` and set your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=connect_fintech
JWT_SECRET=your_strong_secret_here
```

### 4. Create MySQL Database
```sql
CREATE DATABASE connect_fintech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Seed Dummy Data
```bash
npm run seed
```
This creates all tables and inserts test data matching the portal screenshots.

### 6. Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 🔐 Authentication Flow

```
1. POST /api/auth/login       → Sends OTP (printed to console in dev mode)
2. POST /api/auth/verify-otp  → Returns JWT token
3. Use token in all protected routes: Authorization: Bearer <token>
```

### Test Credentials (after seeding)
| Manager ID  | Name           |
|-------------|----------------|
| `BRAP21001` | ACML - PANKAJ  |
| `BRAP21002` | ACML - DEMO    |

---

## 📡 API Reference

### Auth Endpoints

#### `POST /api/auth/login`
```json
Request:  { "manager_id": "BRAP21001" }
Response: { "success": true, "data": { "message": "OTP sent", "otp_dev_only": "123456" } }
```

#### `POST /api/auth/verify-otp`
```json
Request:  { "manager_id": "BRAP21001", "otp": "123456" }
Response: { "success": true, "data": { "token": "eyJ...", "expires_in": "8h", "manager": {...} } }
```

#### `POST /api/auth/resend-otp`
```json
Request:  { "manager_id": "BRAP21001" }
Note: Returns 429 error if called within 30 seconds of last OTP.
```

---

### Dashboard (Protected)

#### `GET /api/dashboard/stats`
```
Headers: Authorization: Bearer <token>
Response:
{
  "success": true,
  "data": {
    "totalClients": 11,
    "activeClients": 10,
    "newClients": 0,
    "inactiveClients": 1,
    "totalAppLogin": 4
  }
}
```

---

### Clients (Protected)

#### `GET /api/clients`
#### `GET /api/clients?status=active`
#### `GET /api/clients?status=inactive`
#### `GET /api/clients?status=new`
```
Headers: Authorization: Bearer <token>
Response: List of clients with masked PAN, Mobile, Email.
```

---

### Reports (Protected)

#### `GET /api/reports/holdings`
#### `GET /api/reports/holdings?client_code=AP2100001`
#### `GET /api/reports/holdings?date=2026-04-05`

#### `GET /api/reports/positions?type=open`
#### `GET /api/reports/positions?type=global`
#### `GET /api/reports/positions?type=fo_global`
#### `GET /api/reports/positions?type=open&client_code=AP2100001`

---

## 🏗 Project Structure

```
/src
  /config        → database.js, seed.js
  /controllers   → authController, dashboardController, clientController, reportsController
  /middlewares   → authMiddleware (JWT), errorHandler, validators
  /models        → Manager, Client, Holding, Position, OTP, index (associations)
  /routes        → authRoutes, dashboardRoutes, clientRoutes, reportsRoutes
  /services      → authService, dashboardService, clientService, reportsService
  /utils         → otpHelper, maskHelper, responseHelper
  app.js         → Express app setup
  server.js      → Entry point
```

---

## 🔒 Security Features
- **Helmet** — HTTP security headers
- **CORS** — Configurable allowed origins
- **Rate Limiting** — 200 req/15min globally, 20 req/15min on auth endpoints
- **JWT Auth** — 8-hour session tokens
- **OTP Cooldown** — 30-second resend throttle
- **Input Validation** — express-validator on all inputs
- **Data Masking** — PAN, Mobile, Email masked in all client responses

---

## 🌱 Health Check

```
GET /health
→ { "success": true, "message": "Connect API is running.", "timestamp": "..." }
```
