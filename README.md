# FinQuest Backend API

A Node.js/Express backend API for managing financial transactions with PostgreSQL database.

## Features

- ✅ Add new transactions
- ✅ Retrieve transactions by user
- ✅ PostgreSQL database with Prisma ORM
- ✅ Railway deployment ready
- ✅ Input validation and error handling
- ✅ CORS enabled for frontend integration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Deployment**: Railway

## API Endpoints

### Health Check
```
GET /
```
Returns server status.

### Add Transaction
```
POST /transactions
```
**Request Body:**
```json
{
  "amount": 100.50,
  "type": "Grocery shopping",
  "category": "Food",
  "subcategory": "Groceries", // optional
  "comments": "Weekly grocery shopping", // optional
  "date": "2024-01-15T10:30:00Z", // optional, defaults to current date
  "userId": 1
}
```

**Response:**
```json
{
  "message": "Transaction added successfully",
  "transaction": {
    "id": 1,
    "amount": 100.50,
    "type": "Grocery shopping",
    "category": "Food",
    "subcategory": "Groceries",
    "comments": "Weekly grocery shopping",
    "date": "2024-01-15T10:30:00Z",
    "userId": 1,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Transactions
```
GET /transactions?userId=1
```
**Response:**
```json
{
  "transactions": [
    {
      "id": 1,
      "amount": 100.50,
      "type": "Grocery shopping",
      "category": "Food",
      "subcategory": "Groceries",
      "comments": "Weekly grocery shopping",
      "date": "2024-01-15T10:30:00Z",
      "userId": 1,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/finquest"
PORT=3000
NODE_ENV=development
```

3. **Set up the database:**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

4. **Start the development server:**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Railway Deployment

### Prerequisites
- Railway account
- GitHub repository with this code

### Deployment Steps

1. **Connect to Railway:**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Create a new project

2. **Add PostgreSQL Database:**
   - In your Railway project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically set the `DATABASE_URL` environment variable

3. **Deploy the Application:**
   - Railway will automatically detect the Node.js app
   - The `start` script in `package.json` will be used
   - Railway will install dependencies and start the server

4. **Set up the Database:**
   - After deployment, run database migrations:
   ```bash
   # Connect to Railway shell or use Railway CLI
   npx prisma db push
   ```

### Environment Variables for Railway
Railway will automatically set:
- `DATABASE_URL` (from PostgreSQL service)
- `PORT` (Railway sets this automatically)

### Custom Domain (Optional)
- In Railway dashboard, go to your service
- Click "Settings" → "Domains"
- Add your custom domain

## Testing the API

### Using curl

**Health Check:**
```bash
curl http://localhost:3000/
```

**Add Transaction:**
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.50,
    "type": "Grocery shopping",
    "category": "Food",
    "subcategory": "Groceries",
    "comments": "Weekly grocery shopping",
    "userId": 1
  }'
```

**Get Transactions:**
```bash
curl "http://localhost:3000/transactions?userId=1"
```

### Using Postman or similar tools
Import these requests:

1. **Health Check:**
   - Method: GET
   - URL: `http://localhost:3000/`

2. **Add Transaction:**
   - Method: POST
   - URL: `http://localhost:3000/transactions`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "amount": 100.50,
     "type": "Grocery shopping",
     "category": "Food",
     "subcategory": "Groceries",
     "comments": "Weekly grocery shopping",
     "userId": 1
   }
   ```

3. **Get Transactions:**
   - Method: GET
   - URL: `http://localhost:3000/transactions?userId=1`

## Database Schema

The `Transaction` model includes:
- `id`: Auto-incrementing primary key
- `amount`: Decimal field for transaction amount
- `type`: Text description of the transaction
- `category`: Transaction category (e.g., Food, Transport, etc.)
- `subcategory`: Optional subcategory for more detailed classification
- `comments`: Optional additional notes or comments
- `date`: Transaction date (defaults to current date)
- `userId`: User identifier (for future user system)
- `createdAt`: Timestamp when record was created
- `updatedAt`: Timestamp when record was last updated

## Error Handling

The API includes comprehensive error handling:
- **400 Bad Request**: Missing required fields or invalid data
- **500 Internal Server Error**: Database or server errors

All errors return JSON responses with error details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License 