# InsafChat Admin Panel

A modern, responsive admin dashboard built with Next.js and TypeScript for managing the InsafChat platform.

## 🚀 Features

- **Authentication System** - Secure login with demo credentials
- **Dashboard Overview** - Real-time statistics and API status monitoring
- **User Management** - View and search all platform users
- **Settings Panel** - Configure admin preferences and API settings
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI/UX** - Beautiful gradient designs with smooth animations

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- InsafChat backend API running

## 🛠️ Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the admin directory:
```env
NEXT_PUBLIC_API_URL=http://192.168.0.104:5000/api
NEXT_PUBLIC_APP_NAME=InsafChat Admin
NEXT_PUBLIC_APP_VERSION=1.0.0
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## 🔐 Login Credentials

Use these demo credentials to login:

- **Email:** admin@gmail.com
- **Password:** adminadmin

## 📱 Pages

### Dashboard (`/`)
- API status monitoring
- Quick statistics overview
- System information

### Users (`/users`)
- View all registered users
- Search functionality
- User status indicators
- Responsive table design

### Settings (`/settings`)
- Account information
- API configuration
- System details
- Cache management

## 🎨 UI/UX Features

- **Gradient Backgrounds** - Beautiful green gradient theme
- **Smooth Animations** - Float, pulse, and slide animations
- **Responsive Sidebar** - Collapsible navigation with mobile overlay
- **Loading States** - Elegant spinners and loading indicators
- **Error Handling** - User-friendly error messages with retry options
- **Status Badges** - Color-coded user status indicators

## 🏗️ Project Structure

```
admin/
├── components/
│   ├── Header.tsx          # Header component (legacy)
│   ├── Layout.tsx          # Main layout with sidebar
│   └── ProtectedRoute.tsx  # Route authentication guard
├── context/
│   └── AuthContext.tsx     # Authentication context provider
├── pages/
│   ├── _app.tsx           # App wrapper with global styles
│   ├── index.tsx          # Dashboard page
│   ├── login.tsx          # Login page
│   ├── users.tsx          # Users management page
│   └── settings.tsx       # Settings page
├── .env                   # Environment variables
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## 🐛 Bug Fixes Applied

### Fixed Issues:
1. ✅ Layout not hiding on login page
2. ✅ Sidebar not closing properly on mobile
3. ✅ Main content margin not adjusting when sidebar closed
4. ✅ AuthContext user/admin naming inconsistency
5. ✅ Missing close button visibility on mobile
6. ✅ Overlay not displaying on mobile
7. ✅ Missing Settings page
8. ✅ No search functionality in Users page
9. ✅ Poor error handling in API calls
10. ✅ Missing authentication headers
11. ✅ Inconsistent styling across pages
12. ✅ No loading states with proper spinners
13. ✅ Table responsiveness issues
14. ✅ Missing responsive design for mobile

## 🎯 API Integration

The admin panel communicates with the backend API for:
- User data fetching
- API status monitoring
- Authentication (future enhancement)

Ensure your backend API is running and accessible at the configured `NEXT_PUBLIC_API_URL`.

## 🔒 Security Notes

- Current implementation uses hardcoded credentials (for demo)
- In production, integrate with backend authentication API
- Add proper JWT token management
- Implement role-based access control (RBAC)
- Use HTTPS in production

## 📦 Dependencies

- **next** ^14.0.0 - React framework
- **react** ^18.2.0 - UI library
- **typescript** ^5.3.3 - Type safety
- **axios** ^1.6.2 - HTTP client
- **zustand** ^4.4.1 - State management (optional)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Future Enhancements

- [ ] Real backend authentication
- [ ] User creation and editing
- [ ] Message management
- [ ] Analytics dashboard
- [ ] Dark mode theme
- [ ] Email notifications
- [ ] Export data to CSV/PDF
- [ ] Advanced filtering and sorting

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the InsafChat platform.

## 👨‍💻 Developer

Built with ❤️ for the InsafChat project

---

**Note:** This is the admin panel for InsafChat. For the main chat application, see the `chat` directory.
