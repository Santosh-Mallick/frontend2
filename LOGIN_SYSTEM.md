# Login System Documentation

## Overview
The login system has been successfully connected and implemented with the following features:

- **Authentication Flow**: Complete login/logout functionality
- **Route Protection**: Protected routes for authenticated users
- **User Type Support**: Separate flows for buyers and sellers
- **Local Storage**: User information stored in localStorage
- **Navigation**: Seamless navigation between different sections

## Routes

### Public Routes
- `/` - Home page (accessible to everyone, shows different content for authenticated users)
- `/login` - Login page (redirects to home if already authenticated)

### Protected Routes
- `/products` - Products page (requires authentication)
- `/buyer/*` - Buyer-specific routes (requires buyer authentication)
- `/seller/*` - Seller-specific routes (requires seller authentication)

## Authentication Flow

### 1. Login Process
1. User visits `/login`
2. User selects user type (Buyer/Seller)
3. User enters email, phone, and password
4. System validates credentials with backend
5. On success:
   - User information is stored in localStorage
   - User is redirected to `/` (home page)
   - Success message is displayed

### 2. Route Protection
- **ProtectedRoute**: Redirects to `/login` if not authenticated
- **PublicRoute**: Redirects to `/` if already authenticated
- **User Type Protection**: Ensures users can only access appropriate routes

### 3. Logout Process
1. User clicks logout button
2. All localStorage data is cleared
3. User is redirected to `/login`

## Home Page Features

### For Non-Authenticated Users:
- Welcome message about connecting suppliers and sellers
- Call-to-action buttons to login
- Product provider showcase
- Basic navigation

### For Authenticated Users:
- Personalized welcome message with user's name
- User-specific action buttons
- Access to protected features
- User profile dropdown with logout option

## Stored User Information

### For Buyers:
- `userName` - Buyer's name
- `userEmail` - Buyer's email
- `userPhone` - Buyer's phone number

### For Sellers:
- `shopName` - Shop/Stall name
- `ownerName` - Owner's name
- `userEmail` - Seller's email
- `userPhone` - Seller's phone number

### For Both:
- `token` - Authentication token
- `userType` - 'buyer' or 'seller'
- `user` - Complete user object

## Components

### Core Components
- `LoginPage` - Main login page with form switching
- `LoginForm` - Login form with validation
- `Home` - Main home page (public with authenticated features)
- `Navbar` - Navigation bar for authenticated users

### Utility Components
- `ProtectedRoute` - Route protection component
- `PublicRoute` - Public route component
- `AuthenticatedLayout` - Layout wrapper for authenticated pages

## API Endpoints

The system connects to these backend endpoints:
- `POST /api/auth/buyer/login` - Buyer login
- `POST /api/auth/seller/login` - Seller login
- `POST /api/auth/buyer/register` - Buyer registration
- `POST /api/auth/seller/register` - Seller registration

## Usage Examples

### Accessing User Information
```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  
  console.log('User name:', userInfo?.name);
  console.log('User email:', userInfo?.email);
};
```

### Using Utility Functions
```javascript
import { getStoredUserInfo, getUserDisplayName } from '../utils/userStorage';

const userInfo = getStoredUserInfo();
const displayName = getUserDisplayName();
```

### Navigation
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard'); // Navigate to dashboard
navigate('/login'); // Navigate to login
```

## Features

### ✅ Implemented
- Complete authentication flow
- Route protection
- User type-specific routing
- Local storage management
- Navigation system
- Success/error messages
- Loading states
- Responsive design
- Public home page with authenticated features

### 🔄 Ready for Extension
- Registration form
- Password reset
- Email verification
- Profile management
- Advanced user settings

## Security Features

- **Token-based authentication**
- **Route protection**
- **User type validation**
- **Secure localStorage handling**
- **Automatic logout on invalid sessions**

## Testing the System

1. **Start the application**: `npm run dev`
2. **Visit**: `http://localhost:5173`
3. **You'll see the home page** (accessible to everyone)
4. **Click login or use profile dropdown** to access `/login`
5. **Login with valid credentials**
6. **You'll be redirected to home page** with authenticated features
7. **Test navigation between different sections**
8. **Test logout functionality**

## User Experience Flow

### Non-Authenticated Users:
1. Visit home page → See public content
2. Click login → Go to login page
3. Login → Redirected to home with authenticated features

### Authenticated Users:
1. Visit any page → See authenticated content
2. Use navigation → Access protected features
3. Logout → Redirected to login page

## Troubleshooting

### Common Issues
1. **Login not working**: Check backend server is running
2. **Routes not loading**: Check authentication state
3. **User info not showing**: Check localStorage data
4. **Navigation issues**: Check route configuration

### Debug Information
- Check browser console for error messages
- Check localStorage in browser dev tools
- Verify API endpoints are accessible
- Check network requests in dev tools 