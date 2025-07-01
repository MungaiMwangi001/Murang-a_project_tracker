# Murang'a Project Tracker - Backend

A robust Node.js backend API for the Murang'a County Project Tracker system. Built with Express, TypeScript, and Prisma ORM for scalable and maintainable server-side development.

## 🚀 Features

### **🔐 Authentication & Authorization**
- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: PUBLIC, STAFF, and ADMIN role management
- **Password Hashing**: bcrypt encryption for secure password storage
- **Staff Approval Workflow**: Admin approval for new staff accounts
- **Session Management**: Secure token storage and validation

### **📊 Project Management API**
- **CRUD Operations**: Complete Create, Read, Update, Delete for projects
- **Advanced Filtering**: Multi-criteria project filtering and search
- **Geographic Organization**: Sub-county and ward-based project organization
- **Status Tracking**: Real-time project status updates
- **Budget Management**: Financial tracking and reporting

### **💬 Communication System**
- **Public Comments**: Anonymous commenting with user name input
- **Authenticated Comments**: Staff/admin commenting with account attribution
- **Real-time Updates**: Immediate comment posting and retrieval
- **Threaded Discussions**: Support for comment replies
- **User Attribution**: Clear identification of comment authors

### **🗄️ Database Management**
- **Prisma ORM**: Type-safe database operations
- **PostgreSQL**: Robust relational database
- **Migration System**: Version-controlled database schema changes
- **Data Integrity**: Foreign key constraints and cascading operations
- **Query Optimization**: Efficient database queries and indexing

### **🔧 Development Tools**
- **TypeScript**: Type safety and better development experience
- **Hot Reload**: Automatic server restart on code changes
- **Error Handling**: Comprehensive error management and logging
- **API Documentation**: Clear endpoint documentation
- **Testing Support**: Unit and integration testing setup

## 🛠️ Technology Stack

- **Node.js 18+** - JavaScript runtime
- **Express 4.18.2** - Web application framework
- **TypeScript 5.1.6** - Type safety and modern JavaScript features
- **Prisma 5.2.0** - Database ORM and migration tool
- **PostgreSQL 14+** - Primary database
- **bcrypt 5.1.0** - Password hashing
- **jsonwebtoken 9.0.2** - JWT authentication
- **cors 2.8.5** - Cross-origin resource sharing
- **helmet 7.0.0** - Security middleware

## 📁 Project Structure

```
server/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts # Authentication logic
│   │   ├── project.controller.ts # Project CRUD operations
│   │   ├── comment.controller.ts # Comment management
│   │   └── user.controller.ts # User management
│   ├── routes/                # API route definitions
│   │   ├── auth.routes.ts     # Authentication endpoints
│   │   ├── project.routes.ts  # Project endpoints
│   │   ├── comment.routes.ts  # Comment endpoints
│   │   └── user.routes.ts     # User endpoints
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.ts # JWT authentication
│   │   └── error.middleware.ts # Error handling
│   ├── services/              # Business logic
│   │   └── auth.service.ts    # Authentication service
│   ├── utils/                 # Utility functions
│   │   ├── jwt.utils.ts       # JWT helper functions
│   │   └── password.utils.ts  # Password utilities
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts          # Shared types
│   └── index.ts              # Application entry point
├── prisma/                    # Database schema and migrations
│   ├── schema.prisma         # Database schema definition
│   ├── migrations/           # Database migration files
│   └── migration_lock.toml   # Migration lock file
├── scripts/                   # Utility scripts
│   └── updateAdminPassword.ts # Admin password update script
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── nodemon.json              # Development server configuration
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git for version control

### **1. Install Dependencies**
```bash
cd Murang-a_project_tracker/server
npm install
```

### **2. Environment Configuration**
Create a `.env` file in the server directory:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/muranga_project_tracker"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: CORS Configuration
CORS_ORIGIN="http://localhost:5173"
```

### **3. Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed database with initial data
npx prisma db seed
```

### **4. Start Development Server**
```bash
npm run dev
```

### **5. Verify Installation**
The API will be running at: http://localhost:5000

Test the health endpoint: http://localhost:5000/api/health

## 📋 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Build TypeScript to JavaScript
npm run build

# Run TypeScript compiler in watch mode
npm run watch

# Run database migrations
npm run migrate

# Generate Prisma client
npm run prisma:generate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npm run db:reset
```

## 🔌 API Endpoints

### **Authentication**
```
POST   /api/auth/login          # User login
POST   /api/auth/register       # Staff registration
POST   /api/auth/logout         # User logout
GET    /api/auth/me             # Get current user
PUT    /api/auth/approve-staff  # Approve staff account (admin only)
```

### **Projects**
```
GET    /api/projects            # Get all projects with filters
GET    /api/projects/:id        # Get specific project
POST   /api/projects            # Create new project (staff/admin)
PUT    /api/projects/:id        # Update project (staff/admin)
DELETE /api/projects/:id        # Delete project (admin only)
GET    /api/projects/stats      # Get project statistics
```

### **Comments**
```
GET    /api/comments/:projectId # Get project comments
POST   /api/comments            # Add new comment
PUT    /api/comments/:id        # Update comment (author only)
DELETE /api/comments/:id        # Delete comment (author/admin)
```

### **Users**
```
GET    /api/users               # Get all users (admin only)
GET    /api/users/:id           # Get specific user
PUT    /api/users/:id           # Update user profile
DELETE /api/users/:id           # Delete user (admin only)
```

## 🗄️ Database Schema

### **Users Table**
```sql
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'PUBLIC',
  "isApproved" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
```

### **Projects Table**
```sql
CREATE TABLE "Project" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "subCounty" VARCHAR(255) NOT NULL,
  "ward" VARCHAR(255) NOT NULL,
  "department" VARCHAR(255) NOT NULL,
  "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
  "budgetedCost" DECIMAL(15,2),
  "contractCost" DECIMAL(15,2),
  "financialYear" VARCHAR(9) NOT NULL,
  "contractPeriod" VARCHAR(255),
  "startDate" DATE,
  "endDate" DATE,
  "implementationStatus" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
```

### **Comments Table**
```sql
CREATE TABLE "Comment" (
  "id" SERIAL PRIMARY KEY,
  "content" TEXT NOT NULL,
  "userName" VARCHAR(255) NOT NULL,
  "userId" INTEGER REFERENCES "User"("id") ON DELETE SET NULL,
  "projectId" INTEGER NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "parentId" INTEGER REFERENCES "Comment"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
```

## 🔧 Key Components

### **Authentication Middleware**
```typescript
// Middleware for protecting routes
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

### **Project Controller**
```typescript
// Example project filtering
const getProjects = async (req: Request, res: Response) => {
  try {
    const { status, subCounty, ward, department, financialYear } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (subCounty) where.subCounty = subCounty;
    if (ward) where.ward = ward;
    if (department) where.department = department;
    if (financialYear) where.financialYear = financialYear;
    
    const projects = await prisma.project.findMany({
      where,
      include: { comments: true }
    });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};
```

### **Comment System**
```typescript
// Public comment posting
const addComment = async (req: Request, res: Response) => {
  try {
    const { content, userName, projectId, parentId } = req.body;
    const userId = req.user?.id; // Optional for public comments
    
    const comment = await prisma.comment.create({
      data: {
        content,
        userName: userName || req.user?.email,
        userId,
        projectId,
        parentId
      }
    });
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};
```

## 🎯 Recent Updates

### **Public Comments System** ✅
- **Anonymous commenting**: Public users can post comments with name input
- **User attribution**: Clear identification of comment authors
- **Threaded discussions**: Support for comment replies
- **Real-time updates**: Comments appear immediately after posting

### **Constituency → Sub-County Rename** ✅
- **Database migration**: Updated schema to use `subCounty` instead of `constituency`
- **API endpoints**: Updated all references in routes and controllers
- **Data migration**: Preserved existing data during schema changes
- **Type definitions**: Updated TypeScript interfaces

### **Enhanced Error Handling** ✅
- **Comprehensive error middleware**: Centralized error handling
- **Validation errors**: Detailed validation error messages
- **Database error handling**: Proper handling of database constraints
- **Security improvements**: Input validation and sanitization

## 🔧 Common Issues & Solutions

### **Database Connection Issues**
```bash
# Error: Connection refused
# Solution: Ensure PostgreSQL is running
sudo service postgresql start  # Linux
brew services start postgresql  # macOS
# Windows: Start PostgreSQL service from Services
```

### **Prisma Migration Issues**
```bash
# Error: Migration conflicts
# Solution: Reset and regenerate
npx prisma migrate reset
npx prisma migrate dev --name init
```

### **JWT Token Issues**
```bash
# Error: JWT_SECRET not defined
# Solution: Add JWT_SECRET to .env file
echo "JWT_SECRET=your-super-secret-key" >> .env
```

### **Port Conflicts**
```bash
# Error: Port 5000 already in use
# Solution: Change port or kill process
lsof -ti:5000 | xargs kill -9  # Kill process on port 5000
# Or change PORT in .env file
```

### **TypeScript Compilation Errors**
```bash
# Error: Type definitions missing
# Solution: Install missing types
npm install --save-dev @types/node @types/express @types/bcrypt @types/jsonwebtoken
```

### **Database Schema Issues**
```bash
# Error: Schema out of sync
# Solution: Regenerate Prisma client
npx prisma generate
npx prisma migrate dev
```

## 🔒 Security Considerations

### **Authentication Security**
- JWT tokens with expiration
- Secure password hashing with bcrypt
- Role-based access control
- Input validation and sanitization

### **Database Security**
- Parameterized queries (Prisma ORM)
- Foreign key constraints
- Data validation at schema level
- Regular security updates

### **API Security**
- CORS configuration
- Helmet.js security headers
- Rate limiting (recommended)
- Input validation middleware

## 🧪 Testing

### **API Testing with Postman**
1. Import the API collection
2. Set up environment variables
3. Test authentication endpoints first
4. Test protected endpoints with valid tokens

### **Database Testing**
```bash
# Test database connection
npx prisma db pull

# Test migrations
npx prisma migrate dev --name test

# Reset test database
npx prisma migrate reset
```

### **Load Testing**
```bash
# Install artillery for load testing
npm install -g artillery

# Run load test
artillery run load-test.yml
```

## 📊 Monitoring & Logging

### **Error Logging**
```typescript
// Example error logging
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});
```

### **Performance Monitoring**
- API response times
- Database query performance
- Memory usage monitoring
- Error rate tracking

## 🔄 Deployment

### **Production Build**
```bash
npm run build
npm start
```

### **Environment Variables for Production**
```env
DATABASE_URL="postgresql://prod_user:prod_password@prod_host:5432/prod_db"
JWT_SECRET="production-super-secret-key"
NODE_ENV=production
PORT=5000
CORS_ORIGIN="https://your-frontend-domain.com"
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Add proper error handling
4. Write tests for new features
5. Update API documentation
6. Follow security best practices

## 📞 Support

For backend-specific issues:
- Check server logs for error messages
- Verify database connectivity
- Test API endpoints with Postman
- Review TypeScript compilation errors
- Check environment variable configuration

---

**Backend Development Team** 🚀 