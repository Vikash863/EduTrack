# EduTrack - Deployment Guide

## Backend Deployment (Render/Railway)

### 1. Prepare for Production

**Update package.json scripts:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

**Create .gitignore:**
```
node_modules/
.env
.DS_Store
npm-debug.log
```

### 2. Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create New → Web Service
4. Connect GitHub repository
5. Set Environment Variables:
   - `PORT=5000`
   - `MONGO_URI=<your_mongodb_atlas_uri>`
   - `JWT_SECRET=<strong_secret>`
   - `JWT_EXPIRES_IN=7d`
6. Build Command: `npm install`
7. Start Command: `npm start`
8. Click Deploy

### 3. Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Import from GitHub
3. Add variables in project settings
4. Click Deploy

---

## Frontend Deployment (Vercel/Netlify)

### 1. Configure API URL

Create `.env.production`:
```
VITE_API_URL=https://your-backend-url.com/api
```

### 2. Build Locally

```bash
cd frontend
npm run build
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click New Project
3. Import your GitHub repository
4. Set environment variable:
   - `VITE_API_URL=<your_backend_url>`
5. Click Deploy

### 4. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

Or:
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable

---

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Environment variables set
- [ ] CORS enabled for frontend domain
- [ ] JWT secret is strong (>32 chars)
- [ ] Database backups configured
- [ ] Error logging enabled
- [ ] Rate limiting implemented
- [ ] HTTPS enabled
- [ ] Health check endpoint tested
- [ ] API tested in production

---

## Database Backup (MongoDB Atlas)

1. Go to MongoDB Atlas
2. Cluster → Backup
3. Create automated backups
4. Set retention period

---

## Monitoring

### Backend Logs
- Render: Logs tab
- Railway: Logs section

### Frontend Errors
- Vercel: Analytics & Monitoring
- Netlify: Analytics & Logging

---

## Post-Deployment

1. Test all APIs from frontend
2. Verify authentication flow
3. Check database connections
4. Monitor error logs
5. Set up alerts for downtime

---

## Common Issues

### CORS Error
**Fix:** Update `backend/src/app.js`
```javascript
app.use(cors({
  origin: 'https://your-frontend-url.com',
  credentials: true
}));
```

### API URL Not Found
**Fix:** Set correct `VITE_API_URL` in frontend .env

### Database Connection Error
**Fix:** 
- Verify MongoDB URI
- Check IP whitelist in MongoDB Atlas
- Ensure network access is allowed

---

## Scaling Tips

1. **Database**: MongoDB Atlas auto-scaling
2. **Backend**: Use multiple dyos/instances
3. **Frontend**: CDN enabled by default
4. **Caching**: Add Redis for session data
5. **Load Balancer**: Use for multiple backend instances

---

## Security Recommendations

1. Use strong JWT secret
2. Enable HTTPS only
3. Set rate limiting on APIs
4. Validate all inputs
5. Use environment variables for sensitive data
6. Enable CORS only for your domain
7. Regular security audits
8. Keep dependencies updated
