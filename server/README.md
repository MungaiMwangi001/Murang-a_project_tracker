# Project Tracker Backend API

A comprehensive backend API for the Murang'a County Project Tracker system, built with Node.js, Express, TypeScript, and PostgreSQL.

## 🎯 Project Overview

This backend serves a project tracking system for Murang'a County with three user roles:
- **PUBLIC**: Can view projects and comment
- **STAFF**: Can manage assigned projects and respond to comments
- **ADMIN**: Full system access and user management

## 🏗️ Architecture

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Security**: bcrypt password hashing, helmet, CORS

## 📋 Development Phases

### Phase 1: Database Schema Design ✅

**Achievements:**
- Designed comprehensive database schema with three main entities
- Implemented proper relationships between User, Project, and Comment models
- Added audit trail fields for tracking who created/edited projects
- Created role-based enum system (PUBLIC, STAFF, ADMIN)

**Schema Structure:**
```prisma
model User {
  id, name, email, password, role, createdAt, updatedAt
  projects (as staff), comments, editedProjects, createdProjects
}

model Project {
  id, title, description, status, priority, dueDate, createdAt, updatedAt
  staffId, createdById, lastEditedById
  staff, createdBy, lastEditedBy, comments
}

model Comment {
  id, content, createdAt, updatedAt
  userId, projectId
  user, project
}
```

**Problems Encountered:**
- Initial schema had only USER/ADMIN roles, needed to add STAFF role
- Missing audit trail fields for project tracking
- Schema relationships needed clarification for staff assignment

**Solutions:**
- Updated Role enum to include PUBLIC, STAFF, ADMIN
- Added createdById and lastEditedById fields to Project model
- Implemented proper foreign key relationships with cascade deletes

### Phase 2: Authentication & Authorization ✅

**Achievements:**
- Implemented JWT-based authentication system
- Created comprehensive middleware for role-based access control
- Added project ownership verification for staff members
- Implemented secure password hashing with bcrypt

**Features Implemented:**
- User registration and login
- JWT token generation and verification
- Role-based route protection
- Project ownership middleware
- Logout functionality

**Problems Encountered:**
- JWT token validation errors due to missing JWT_SECRET
- Route conflicts between different API endpoints
- Middleware parameter extraction issues

**Solutions:**
- Created proper .env file with JWT_SECRET
- Separated route mounting to avoid conflicts (/api/projects, /api/comments, /api/users)
- Fixed middleware to use correct parameter names (req.params.id vs req.params.projectId)

### Phase 3: Project Management ✅

**Achievements:**
- Complete CRUD operations for projects
- Staff assignment and ownership tracking
- Project filtering and search capabilities
- Audit trail implementation

**API Endpoints:**
- `GET /api/projects` - Get all projects (public)
- `GET /api/projects/:id` - Get project by ID (public)
- `POST /api/projects` - Create project (staff/admin)
- `PUT /api/projects/:id` - Update project (staff/admin)
- `DELETE /api/projects/:id` - Delete project (admin only)
- `GET /api/projects/staff/projects` - Get staff's projects

**Problems Encountered:**
- Project ownership middleware looking for wrong parameter
- Staff assignment validation issues
- Route mounting conflicts

**Solutions:**
- Fixed middleware to use req.params.id instead of req.params.projectId
- Added proper staff role validation in project creation
- Separated route mounting to prevent conflicts

### Phase 4: Comment System ✅

**Achievements:**
- Complete comment CRUD operations
- Role-based comment permissions
- Comment filtering by project and user
- Proper user authorization for comment management

**API Endpoints:**
- `GET /api/comments/projects/:projectId` - Get project comments (public)
- `POST /api/comments` - Create comment (authenticated users)
- `PUT /api/comments/:id` - Update comment (owner/staff/admin)
- `DELETE /api/comments/:id` - Delete comment (owner/staff/admin)
- `GET /api/comments/users/:userId` - Get user comments

**Permission System:**
- Users can edit/delete their own comments
- Staff can manage comments on their assigned projects
- Admins can manage all comments

### Phase 5: User Management ✅

**Achievements:**
- Complete user CRUD operations (admin only)
- Role assignment and management
- Staff member listing and statistics
- User activity tracking

**API Endpoints:**
- `GET /api/users` - Get all users (admin)
- `GET /api/users/staff` - Get staff members (admin)
- `GET /api/users/:id` - Get user by ID (admin)
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

**Security Features:**
- Admin cannot delete themselves
- Role validation for user creation/updates
- Email uniqueness validation

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
{
  id: "user_id",
  email: "user@example.com",
  role: "ADMIN|STAFF|PUBLIC",
  iat: timestamp,
  exp: timestamp
}
```

### Middleware Stack
1. **verifyToken**: Validates JWT and adds user to request
2. **requireRole**: Checks if user has required role
3. **requireProjectOwnership**: Verifies staff can access project

### Role Permissions
- **PUBLIC**: View projects, create/edit own comments
- **STAFF**: Manage assigned projects, respond to comments
- **ADMIN**: Full system access, user management

## 🗄️ Database Schema

### Enums
```prisma
enum Role {
  PUBLIC
  STAFF
  ADMIN
}

enum ProjectStatus {
  PLANNING
  IN_PROGRESS
  REVIEW
  COMPLETED
  ON_HOLD
  CANCELLED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

### Key Relationships
- One staff member per project (avoid conflicts)
- Users can have multiple comments
- Projects can have multiple comments
- Audit trail for project creation and editing

## 🚀 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/create-admin` - Create initial admin (testing)

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Comments
- `GET /api/comments/projects/:projectId` - Get project comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Users
- `GET /api/users` - List all users (admin)
- `GET /api/users/staff` - List staff members (admin)
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/project_tracker"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3000
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
6. Start the server:
   ```bash
   npm run dev
   ```

### Database Setup
```bash
# Reset database (development only)
npx prisma migrate reset --force

# Create initial admin
POST /auth/create-admin
```

## 🧪 Testing

### Test Flow
1. Create admin user
2. Login to get JWT token
3. Create staff user
4. Login as staff to get staff token
5. Create projects and comments
6. Test role-based permissions

### Example Test Requests
```bash
# Create admin
curl -X POST http://localhost:3000/auth/create-admin

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@muranga.gov.ke","password":"admin123"}'

# Get users (with token)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Development Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Database
npx prisma studio
npx prisma migrate dev
npx prisma generate
```

## 📊 Current Status

### ✅ Completed Features
- [x] Database schema design and implementation
- [x] Authentication and authorization system
- [x] Project management (CRUD)
- [x] Comment system (CRUD)
- [x] User management (admin)
- [x] Role-based access control
- [x] Audit trail implementation
- [x] API testing and validation

### 🔄 Next Steps
- [ ] Frontend integration
- [ ] Image upload functionality
- [ ] Advanced search and filtering
- [ ] Real-time notifications
- [ ] API documentation (Swagger)
- [ ] Production deployment

## 🐛 Known Issues & Solutions

### Issue 1: JWT Token Validation Errors
**Problem**: "Token is invalid or expired" errors
**Solution**: Ensure JWT_SECRET is properly set in .env file

### Issue 2: Route Conflicts
**Problem**: Middleware errors due to overlapping routes
**Solution**: Separated route mounting (/api/projects, /api/comments, /api/users)

### Issue 3: Parameter Extraction
**Problem**: Middleware looking for wrong parameter names
**Solution**: Fixed to use req.params.id instead of req.params.projectId

### Issue 4: Database Migration Errors
**Problem**: Transaction errors during schema updates
**Solution**: Use `npx prisma migrate reset --force` for clean migrations

## 📝 Notes

- All timestamps are in UTC
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Cascade deletes are implemented for data integrity
- Admin users cannot delete themselves (safety feature)

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include JSDoc comments for functions
4. Test all endpoints before committing
5. Update this README for new features

## 📄 License

This project is part of the Murang'a County Project Tracker system. 