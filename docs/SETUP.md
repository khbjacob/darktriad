# PersonaScope - Setup Guide

Complete guide for setting up PersonaScope for development and deployment.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Running the Application](#running-the-application)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **Python**: 3.8 or higher ([Download](https://python.org/))
- **npm** or **yarn**: Package manager for frontend
- **pip**: Python package manager
- **Git**: Version control

### Optional

- **Docker**: For containerized deployment
- **PostgreSQL**: If using database features
- **Supabase Account**: For user authentication and history features

### System Requirements

- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 2GB free
- **OS**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 20.04+)

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/personascope.git
cd personascope
```

### 2. Project Structure

```
personascope/
├── frontend/          # React + TypeScript frontend
├── backend/           # Python Flask backend
├── docs/              # Documentation
├── README.md
└── docker-compose.yml (optional)
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Configure Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url_here  # Optional
VITE_SUPABASE_ANON_KEY=your_key_here      # Optional
```

### 4. Start Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

**macOS/Linux**:
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows**:
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Note**: Installing `dlib` may require additional system dependencies:

**Ubuntu/Debian**:
```bash
sudo apt-get update
sudo apt-get install build-essential cmake
sudo apt-get install libopenblas-dev liblapack-dev
sudo apt-get install libx11-dev libgtk-3-dev
```

**macOS** (using Homebrew):
```bash
brew install cmake
brew install openblas
```

**Windows**:
- Install Visual Studio Build Tools
- Or use pre-built wheels from [here](https://github.com/sachadee/Dlib)

### 4. Configure Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-change-this
HOST=0.0.0.0
PORT=5000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
MAX_FILE_SIZE=10485760
LOG_LEVEL=INFO
```

### 5. Create Upload Directory

```bash
mkdir uploads
```

### 6. Start Development Server

```bash
python app.py
```

Backend will be available at: `http://localhost:5000`

### 7. Verify Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-08T...",
  "version": "1.0.0"
}
```

---

## Running the Application

### Development Mode

You need **two terminal windows**:

**Terminal 1 - Backend**:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

**Access Application**:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

### Testing the Analysis Flow

1. Open `http://localhost:3000` in your browser
2. Read and accept the disclaimer
3. Upload a clear face photo or use webcam
4. Wait for analysis (should take 2-5 seconds)
5. Review results with research citations

---

## Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel
```

3. **Configure Environment Variables** in Vercel dashboard:
   - `VITE_API_BASE_URL`: Your backend URL

4. **Production Deploy**:
```bash
vercel --prod
```

#### Backend on Railway

1. Create account at [railway.app](https://railway.app)

2. **Create New Project** > Deploy from GitHub

3. **Add Environment Variables**:
   - All variables from `.env.example`
   - Set `FLASK_ENV=production`
   - Set `CORS_ORIGINS` to include your Vercel domain

4. **Deploy**:
   - Railway auto-deploys from GitHub pushes

5. **Monitor**: Check logs in Railway dashboard

### Option 2: Docker Deployment

#### Create Docker Files

**frontend/Dockerfile**:
```dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**backend/Dockerfile**:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["python", "app.py"]
```

**docker-compose.yml** (in root):
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - CORS_ORIGINS=http://localhost:3000
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

**Run with Docker**:
```bash
docker-compose up --build
```

### Option 3: Traditional Server Deployment

#### Frontend (Nginx)

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Copy `dist/` to web server:
```bash
scp -r dist/* user@server:/var/www/personascope/
```

3. Nginx configuration:
```nginx
server {
    listen 80;
    server_name personascope.example.com;
    root /var/www/personascope;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Backend (systemd service)

1. Create service file `/etc/systemd/system/personascope.service`:
```ini
[Unit]
Description=PersonaScope Backend API
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/personascope/backend
Environment="PATH=/opt/personascope/backend/venv/bin"
ExecStart=/opt/personascope/backend/venv/bin/python app.py

[Install]
WantedBy=multi-user.target
```

2. Enable and start:
```bash
sudo systemctl enable personascope
sudo systemctl start personascope
```

---

## Environment-Specific Configuration

### Production Checklist

- [ ] Set `FLASK_ENV=production`
- [ ] Set `FLASK_DEBUG=False`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure proper CORS origins
- [ ] Set up HTTPS/SSL
- [ ] Configure rate limiting
- [ ] Set up logging and monitoring
- [ ] Regular security updates
- [ ] Backup strategy

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use environment variables** for all secrets
3. **Enable HTTPS** in production
4. **Keep dependencies updated**: `npm audit`, `pip list --outdated`
5. **Monitor for suspicious activity**
6. **Implement proper logging**

---

## Troubleshooting

### Common Issues

#### Frontend Issues

**Issue**: `npm install` fails
- **Solution**: Delete `node_modules` and `package-lock.json`, then retry
- Check Node.js version: `node --version` (should be 18+)

**Issue**: API requests fail with CORS error
- **Solution**: Check backend CORS_ORIGINS includes frontend URL
- Ensure backend is running

**Issue**: Build fails
- **Solution**: Clear build cache: `rm -rf dist/ node_modules/.vite`
- Check for TypeScript errors: `npm run lint`

#### Backend Issues

**Issue**: `dlib` installation fails
- **Solution**: Install system dependencies (see Backend Setup step 3)
- On Windows, use pre-built wheels

**Issue**: MediaPipe fails to load
- **Solution**: Ensure Python version is 3.8-3.11 (not 3.12+)
- Try: `pip install --upgrade mediapipe`

**Issue**: "No face detected" errors
- **Solution**: Ensure image has clear, frontal face
- Check image quality and lighting
- Try different image

**Issue**: Port already in use
- **Solution**:
  - Find process: `lsof -i :5000` (macOS/Linux) or `netstat -ano | findstr :5000` (Windows)
  - Kill process or use different port

#### Memory Issues

**Issue**: Backend crashes with memory error
- **Solution**:
  - Reduce MAX_FILE_SIZE
  - Increase system RAM
  - Use smaller image sizes

---

## Optional Features

### Supabase Integration

1. Create Supabase project at [supabase.com](https://supabase.com)

2. Get credentials from project settings

3. Add to frontend `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

4. Create tables (SQL):
```sql
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    results JSONB
);
```

5. Implement in code (frontend and backend)

---

## Development Tips

### Hot Reload

Both frontend and backend support hot reload in development:
- Frontend: Vite hot module replacement
- Backend: Flask debug mode

### Debugging

**Frontend**:
- Use React DevTools browser extension
- Check browser console for errors
- Use `console.log()` liberally

**Backend**:
- Check terminal output
- Use `logger.info()` and `logger.error()`
- Enable verbose logging: Set `LOG_LEVEL=DEBUG`

### Code Quality

**Frontend**:
```bash
npm run lint        # Check for issues
npm run type-check  # TypeScript errors
```

**Backend**:
```bash
black .             # Format code
flake8 .            # Lint
mypy .              # Type checking (if configured)
```

---

## Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: Open GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: support@personascope.example (for this demo)

---

## Next Steps

After setup:

1. **Read** `/docs/RESEARCH.md` to understand the science
2. **Review** `/docs/ETHICS.md` for usage guidelines
3. **Explore** the code and customize as needed
4. **Contribute** improvements via pull requests

---

*Last updated: January 2026*
