# Murang'a Project Tracker - Frontend

A modern React-based frontend application for the Murang'a County Project Tracker system. Built with TypeScript, Vite, and Tailwind CSS for optimal performance and developer experience.

## 🚀 Features

### **📊 Dashboard & Analytics**
- **Interactive Statistics Cards**: Clickable cards that link to filtered project views
- **Real-time Data**: Live project counts and budget summaries
- **Status Distribution**: Visual breakdown of projects by status
- **Financial Year Filtering**: Dynamic filtering by fiscal years
- **Export Capabilities**: Excel, PDF, and PowerPoint report generation

### **🗺️ Geographic Organization**
- **Sub-County Views**: Projects organized by sub-counties with dropdown selection
- **Ward-Level Filtering**: Detailed project breakdown within sub-counties
- **Department Categorization**: Projects grouped by government departments
- **"View All" Options**: Expandable views for comprehensive project lists

### **👥 User Management**
- **Multi-Role Support**: PUBLIC, STAFF, and ADMIN interfaces
- **Authentication Flow**: Secure login/logout with JWT tokens
- **Context-Based Navigation**: Role-specific routing and access control
- **Profile Management**: User profile updates and settings

### **💬 Communication System**
- **Public Comments**: Anonymous users can post comments with name input
- **Authenticated Comments**: Staff/admin can post using their accounts
- **Real-time Updates**: Comments appear immediately after posting
- **Threaded Discussions**: Support for comment replies
- **User Attribution**: Clear identification of comment authors

### **🔍 Advanced Filtering & Search**
- **Multi-Criteria Filtering**: Status, year, location, department combinations
- **Dynamic Search**: Real-time project search functionality
- **URL State Sync**: Filter states preserved in URL parameters
- **Responsive Filters**: Mobile-friendly filter interfaces

## 🛠️ Technology Stack

- **React 18.2.0** - Modern React with concurrent features
- **TypeScript 5.0.2** - Type safety and better development experience
- **Vite 4.4.5** - Fast development server and build tool
- **Tailwind CSS 3.3.2** - Utility-first CSS framework
- **React Router DOM 6.15.0** - Client-side routing
- **Axios 1.5.0** - HTTP client for API communication
- **Recharts 2.8.0** - Chart library for analytics
- **XLSX 0.18.5** - Excel file generation
- **jsPDF 2.5.1** - PDF generation
- **pptxgenjs 3.12.0** - PowerPoint generation

## 📁 Project Structure

```
client/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.tsx       # Navigation component
│   │   ├── ProjectCard.tsx  # Project display card
│   │   ├── ProjectGrid.tsx  # Project grid layout
│   │   ├── ProjectList.tsx  # Project list view
│   │   ├── SearchBar.tsx    # Search functionality
│   │   ├── StatusSummary.tsx # Status statistics
│   │   └── ProjectComments.tsx # Comments system
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── Login.tsx        # Authentication page
│   │   ├── ProjectsPage.tsx # Main projects view
│   │   ├── AdminDashboard.tsx # Admin interface
│   │   ├── StaffDashboard.tsx # Staff interface
│   │   └── ProjectDetailPage.tsx # Project details
│   ├── context/             # React context providers
│   │   └── UserContext.tsx  # User authentication context
│   ├── services/            # API service functions
│   │   └── api.ts          # API communication layer
│   ├── types/               # TypeScript type definitions
│   │   ├── project.ts      # Project-related types
│   │   └── projects.ts     # Project list types
│   ├── layouts/             # Layout components
│   │   └── RootLayout.tsx  # Main layout wrapper
│   ├── assets/              # Static assets
│   │   └── images/         # Image files
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                  # Public assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- Backend server running (see server README)
- Git for version control

### **1. Install Dependencies**
```bash
cd Murang-a_project_tracker/client
npm install
```

### **2. Environment Configuration**
Create a `.env` file in the client directory (optional, uses defaults):
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME="Murang'a Project Tracker"
```

### **3. Start Development Server**
```bash
npm run dev
```

### **4. Access the Application**
Open your browser and navigate to: http://localhost:5173

## 📋 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

## 🔧 Key Components

### **UserContext.tsx**
```typescript
// Manages user authentication state
const { user, login, logout, isLoading } = useUser();
```

### **ProjectCard.tsx**
```typescript
// Displays individual project information
<ProjectCard 
  project={project}
  onClick={() => navigate(`/projects/${project.id}`)}
/>
```

### **ProjectComments.tsx**
```typescript
// Handles comment display and posting
<ProjectComments 
  projectId={projectId}
  comments={comments}
  onCommentAdded={handleCommentAdded}
/>
```

## 🎯 Recent Updates

### **Public Comments System** ✅
- **Anonymous commenting**: Public users can post comments with name input
- **Real-time updates**: Comments appear immediately after posting
- **User attribution**: Clear identification of comment authors
- **Threaded discussions**: Support for comment replies

### **Constituency → Sub-County Rename** ✅
- **Route updates**: Changed from `/projects/constituency` to `/projects/sub-county`
- **UI labels**: All references updated throughout the application
- **State management**: Updated filter states and navigation logic
- **Data consistency**: Maintained compatibility with backend changes

### **Enhanced User Experience** ✅
- **Clickable statistics**: Homepage cards link to filtered project views
- **Dynamic filtering**: Real-time project filtering with URL state sync
- **Loading states**: Better user feedback during data loading
- **Responsive design**: Improved mobile experience

## 🔧 Common Issues & Solutions

### **API Connection Issues**
```bash
# Error: Cannot connect to backend
# Solution: Ensure backend server is running
cd ../server
npm run dev
```

### **Port Conflicts**
```bash
# Error: Port 5173 already in use
# Solution: Use different port
npm run dev -- --port 3000
```

### **TypeScript Errors**
```bash
# Error: Type definitions missing
# Solution: Install missing types
npm install --save-dev @types/react @types/react-dom
```

### **Build Issues**
```bash
# Error: Build fails
# Solution: Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Hot Reload Not Working**
```bash
# Error: Changes not reflecting
# Solution: Restart development server
npm run dev
```

## 🎨 Styling Guidelines

### **Tailwind CSS Classes**
```css
/* Common utility classes used */
.bg-blue-600          /* Primary blue background */
.text-white           /* White text */
.rounded-lg           /* Large border radius */
.shadow-md            /* Medium shadow */
.hover:bg-blue-700    /* Hover state */
.transition-colors    /* Smooth color transitions */
```

### **Component Styling**
```typescript
// Example component with Tailwind classes
const ProjectCard = ({ project }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
    <p className="text-gray-600 mt-2">{project.description}</p>
  </div>
);
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Mobile-First Approach**
```typescript
// Example responsive component
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {projects.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))}
</div>
```

## 🔒 Security Considerations

### **Authentication**
- JWT tokens stored in localStorage
- Automatic token refresh
- Protected routes with role-based access
- Secure logout with token cleanup

### **Data Validation**
- TypeScript for type safety
- Input validation on forms
- API error handling
- XSS prevention with proper escaping

## 🚀 Performance Optimizations

### **Code Splitting**
- Route-based code splitting with React Router
- Lazy loading of components
- Dynamic imports for heavy libraries

### **Caching**
- API response caching
- Static asset optimization
- Browser caching headers

### **Bundle Optimization**
- Tree shaking for unused code
- Minification and compression
- Image optimization

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] User authentication flow
- [ ] Project filtering and search
- [ ] Comment posting and display
- [ ] Responsive design on different devices
- [ ] Export functionality
- [ ] Navigation between pages

### **Browser Compatibility**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 Analytics & Monitoring

### **Performance Metrics**
- Page load times
- API response times
- User interaction tracking
- Error monitoring

### **User Analytics**
- Page views and navigation
- Feature usage statistics
- User engagement metrics

## 🔄 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deploy to Static Hosting**
```bash
# Example for Netlify
npm run build
# Upload dist/ folder to hosting provider
```

### **Environment Variables for Production**
```env
VITE_API_URL=https://your-api-domain.com
VITE_APP_NAME="Murang'a Project Tracker"
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Add proper error handling
4. Test on multiple devices and browsers
5. Update documentation for new features

## 📞 Support

For frontend-specific issues:
- Check the browser console for errors
- Verify API connectivity
- Review TypeScript compilation errors
- Test on different browsers and devices

---

**Frontend Development Team** 🚀