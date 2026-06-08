# ADR Shield - Render Deployment Guide

## Project Structure

This is a full-stack application with:
- **Frontend**: React + TypeScript + Vite (in `adr-shield/`)
- **Backend**: Express + TypeScript (in `api-server/`)

## Deployment Architecture

The application is configured to run as a single service on Render:
1. Frontend is built during the build process
2. Backend serves the frontend as static files
3. Backend API is available at `/api/*` routes
4. Single port (3000) handles both frontend and backend

## How to Deploy on Render

### Step 1: Connect Your GitHub Repository
1. Go to [render.com](https://render.com)
2. Sign in with your GitHub account
3. Click "New +" → "Web Service"
4. Select your repository: `shashank-1010/ADR`
5. Configure the service:
   - **Name**: `adr-shield`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run install-deps && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter (as per your choice)

### Step 2: Set Environment Variables
In the Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=3000
```

### Step 3: Deploy
- Click "Create Web Service"
- Render will automatically:
  1. Install root dependencies (`npm install`)
  2. Install frontend dependencies (`cd adr-shield && npm install`)
  3. Install backend dependencies (`cd api-server && npm install`)
  4. Build frontend (`cd adr-shield && npm run build`)
  5. Build backend (`cd api-server && npm run build`)
  6. Start the server (`cd api-server && npm start`)

## Local Development

### Install Dependencies
```bash
npm run install-deps
```

### Development Mode
```bash
npm run dev
```
This will start both frontend (port 5173) and backend (port 3001) concurrently.

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Project Structure Explanation

```
.
├── package.json          # Root package.json for orchestration
├── build.mjs             # Custom build script
├── render.yaml           # Render deployment configuration
├── Procfile              # Procfile for backup deployment
├── .nvmrc                # Node version specification
├── adr-shield/           # Frontend React application
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── dist/             # Built frontend (generated)
└── api-server/           # Backend Express application
    ├── src/
    ├── package.json
    └── dist/             # Built backend (generated)
```

## How It Works

1. **Build Phase**:
   - Root `build.mjs` script runs
   - Frontend builds to `adr-shield/dist/`
   - Backend builds to `api-server/dist/`

2. **Runtime Phase**:
   - Backend starts on PORT (default 3000)
   - Frontend static files are served from `adr-shield/dist/`
   - API requests to `/api/*` are handled by Express routes
   - All other requests serve `index.html` for SPA routing

3. **API Communication**:
   - In development: Frontend calls `http://localhost:3001/api`
   - In production: Frontend calls `/api` (same origin)

## Troubleshooting

### Build Fails
- Ensure both `adr-shield/package.json` and `api-server/package.json` exist
- Check that Node version matches `.nvmrc` (20.11.0)
- Clear build artifacts: `rm -rf adr-shield/dist api-server/dist`

### Frontend Not Loading
- Check that `adr-shield/dist/index.html` exists after build
- Verify Express is serving static files correctly
- Check browser console for API errors

### API Errors
- Ensure backend is running on correct port
- Check environment variables in Render dashboard
- Verify API client is using `/api` endpoint in production

## Additional Commands

```bash
# Build only frontend
npm run build:frontend

# Build only backend
npm run build:backend

# Development with live reload
npm run dev

# Run tests (when configured)
npm test
```

## Notes for Render Platform

- The application expects to run from the **root directory**
- All dependencies must be installable via `npm install`
- The build process is fully automated via `render.yaml`
- Environment variables should be set in the Render dashboard, not in `.env` files
- Free tier has some limitations on build time and storage

## Support

For more information:
- [Render Documentation](https://render.com/docs)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)
- [GitHub Repository](https://github.com/shashank-1010/ADR)
