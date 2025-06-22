# Pokemon MERN App - Deployment Guide

## 🚀 Deployment Options

### Option 1: Render (Recommended - Free)

1. **Create Render Account**: Go to [render.com](https://render.com) and sign up
2. **Connect GitHub**: Link your GitHub account
3. **Create New Web Service**: 
   - Select your `pokemon-mern-app` repository
   - Choose "Web Service"
   - Use these settings:
     - **Build Command**: `npm run install-all && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: Node
4. **Add Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-connection-string>
   PORT=10000
   POKEAPI_BASE_URL=https://pokeapi.co/api/v2
   CORS_ORIGIN=https://your-app-name.onrender.com
   ```
5. **Create MongoDB Database**: 
   - In Render dashboard, create a new MongoDB database
   - Copy the connection string to MONGODB_URI

### Option 2: Vercel (Frontend) + Railway (Backend)

#### Deploy Frontend to Vercel:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set build settings:
   - **Framework**: React
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### Deploy Backend to Railway:
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Set environment variables
4. Add MongoDB database

### Option 3: Netlify (Frontend) + Heroku (Backend)

#### Deploy Frontend to Netlify:
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`

#### Deploy Backend to Heroku:
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Add MongoDB addon: `heroku addons:create mongolab:sandbox`
4. Deploy: `git push heroku main`

## 🔧 Environment Variables Required

### Backend (.env):
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pokemon-app
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
CORS_ORIGIN=https://your-frontend-url.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SEARCH_RATE_LIMIT_MAX=50
LOG_LEVEL=info
```

## 📝 Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB database created and accessible
- [ ] CORS origins updated for production URLs
- [ ] Build scripts tested locally
- [ ] .gitignore includes node_modules and .env files
- [ ] Repository pushed to GitHub

## 🧪 Testing Deployment

After deployment, test these endpoints:
- `GET /health` - Health check
- `GET /api/pokemon/search/pikachu` - Search functionality
- `GET /api/pokemon/daily` - Daily Pokemon
- Frontend routes: `/`, `/pokemon/:id`

## 🔍 Troubleshooting

### Common Issues:
1. **Build Fails**: Check Node.js version compatibility
2. **Database Connection**: Verify MongoDB URI format
3. **CORS Errors**: Update CORS_ORIGIN environment variable
4. **404 on Refresh**: Ensure React routing is properly configured

### Logs:
- Check deployment logs in your hosting platform
- Monitor application logs for runtime errors
- Use health check endpoint to verify server status
