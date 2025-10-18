# ColdPitch Email Backend

Simple Node.js backend for sending emails via SendGrid.

## Setup

1. **Install dependencies:**
   ```bash
   cd email-backend
   npm install
   ```

2. **Configure environment:**
   - Edit `.env` file
   - Add your SendGrid API key

3. **Start server:**
   ```bash
   npm start
   ```

Server runs on http://localhost:3001

## API Endpoints

### Health Check
```
GET http://localhost:3001/health
```

### Send Credentials Email
```
POST http://localhost:3001/api/send-credentials
Content-Type: application/json

{
  "to": "user@example.com",
  "name": "John Doe",
  "password": "tempPassword123",
  "loginUrl": "http://localhost:5174/login"
}
```

## Usage

Keep this server running in a separate terminal while using the ColdPitch app.

The frontend will automatically call this backend when adding new staff members.
