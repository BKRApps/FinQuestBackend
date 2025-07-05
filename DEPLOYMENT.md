# Railway Deployment Guide

## Prisma Client Generation Issue - SOLVED ✅

### Problem
```
Error: @prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.
```

### Solution Applied
1. **Fixed Schema Type**: Changed `Float` to `Decimal` for amount field
2. **Removed Custom Output Path**: Prisma client now generates in default location
3. **Added Build Script**: `npm run build` generates Prisma client
4. **Updated Railway Config**: Ensures build runs before start

### Files Modified
- `prisma/schema.prisma`: Fixed Decimal type and removed custom output
- `server.js`: Added Decimal import and proper type handling
- `package.json`: Added build script
- `railway.json`: Updated start command to run build first

## Railway Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Fix Prisma client generation for Railway deployment"
git push
```

### 2. Deploy on Railway
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add PostgreSQL database service
4. Railway will automatically:
   - Run `npm install`
   - Run `npm run build` (generates Prisma client)
   - Run `npm start`

### 3. Set up Database
After deployment, in Railway shell:
```bash
npx prisma db push
```

### 4. Verify Deployment
- Health check: `https://your-app.railway.app/`
- Should return: `{"message":"FinQuest Backend API is running!"}`

## Environment Variables for Railway

Railway automatically sets:
- `DATABASE_URL` (from PostgreSQL service)
- `PORT` (Railway sets this)

## Testing the Deployed API

### Health Check
```bash
curl https://your-app.railway.app/
```

### Add Transaction
```bash
curl -X POST https://your-app.railway.app/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.50,
    "type": "Test transaction",
    "category": "Test",
    "subcategory": "API Test",
    "comments": "Testing deployed API",
    "userId": 1
  }'
```

### Get Transactions
```bash
curl "https://your-app.railway.app/transactions?userId=1"
```

## Troubleshooting

### If Prisma Client Still Fails
1. Check Railway logs for build errors
2. Ensure `DATABASE_URL` is set correctly
3. Verify PostgreSQL service is running

### If Database Connection Fails
1. Check `DATABASE_URL` format in Railway
2. Ensure database is accessible from app
3. Run `npx prisma db push` in Railway shell

### If API Returns 500 Errors
1. Check Railway logs for detailed error messages
2. Verify database schema is pushed correctly
3. Test with simple health check first

## Local Testing Before Deployment

```bash
# Generate Prisma client
npm run build

# Start server
npm run dev

# Test API
node test-api.js
```

## Success Indicators
- ✅ Health check returns success message
- ✅ Add transaction endpoint accepts requests
- ✅ Database operations work without errors
- ✅ Railway logs show successful build and start 