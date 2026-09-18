# VELORA Frontend Development Guide

## ✅ Backend Status: 100% COMPLETE

The backend is fully implemented and production-ready. All APIs are functional and tested.

## 📋 Frontend Implementation Checklist

### Phase 1: Core Setup
- [ ] Create main App.jsx with routing
- [ ] Set up React Router with all routes
- [ ] Create layout components (Navbar, Footer, Sidebar)
- [ ] Create Zustand stores (auth, cart, product, etc.)
- [ ] Style with Tailwind CSS

### Phase 2: Authentication Pages
- [ ] Login page
- [ ] Register page
- [ ] Forgot password page
- [ ] Authentication context/store
- [ ] Protected route wrapper

### Phase 3: Public Pages
- [ ] Home page with hero section
- [ ] Shop page with product grid
- [ ] Product details page
- [ ] Category filter pages
- [ ] Search results page
- [ ] 404 page

### Phase 4: User Features
- [ ] Shopping cart page
- [ ] Cart operations (add, remove, update quantity)
- [ ] Wishlist page
- [ ] Wishlist operations
- [ ] Checkout process
- [ ] Order confirmation page

### Phase 5: User Account
- [ ] User profile page
- [ ] Edit profile page
- [ ] Address management
- [ ] My orders page
- [ ] Order details page
- [ ] Order tracking

### Phase 6: Admin Dashboard
- [ ] Admin dashboard layout
- [ ] Dashboard statistics
- [ ] Product management pages
- [ ] Category management
- [ ] User management
- [ ] Order management
- [ ] Review management

### Phase 7: Polish & Optimization
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Form validation

## 🚀 Getting Started with Frontend

### 1. Create App.jsx with Routing

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetailsPage /></Layout>} />
        <Route path="/search" element={<Layout><SearchPage /></Layout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Layout><CartPage /></Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Layout><CheckoutPage /></Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute>
              <Layout><WishlistPage /></Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout><ProfilePage /></Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <Layout><OrdersPage /></Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Layout><AdminDashboard /></Layout>
            </AdminRoute>
          } 
        />
        
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. Create Zustand Stores

#### Auth Store
```javascript
// src/stores/authStore.js
import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', response.data.token);
    set({ 
      token: response.data.token, 
      user: response.data.data,
      isAuthenticated: true 
    });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    set({ 
      token: response.data.token, 
      user: response.data.data,
      isAuthenticated: true 
    });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    set({ user: response.data.data });
    return response.data.data;
  },
}));
```

#### Cart Store
```javascript
// src/stores/cartStore.js
import { create } from 'zustand';
import api from '../services/api';

export const useCartStore = create((set, get) => ({
  cart: { items: [], subtotal: 0, total: 0, shippingCost: 0 },
  
  fetchCart: async () => {
    try {
      const response = await api.get('/cart');
      set({ cart: response.data.data });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  },
  
  addToCart: async (productId, quantity) => {
    const response = await api.post('/cart', { productId, quantity });
    set({ cart: response.data.data });
  },
  
  updateQuantity: async (productId, quantity) => {
    const response = await api.put(`/cart/${productId}`, { quantity });
    set({ cart: response.data.data });
  },
  
  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/${productId}`);
    set({ cart: response.data.data });
  },
  
  clearCart: async () => {
    const response = await api.delete('/cart');
    set({ cart: response.data.data });
  },
}));
```

#### Product Store
```javascript
// src/stores/productStore.js
import { create } from 'zustand';
import api from '../services/api';

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  
  fetchProducts: async (filters = {}) => {
    set({ loading: true });
    try {
      const response = await api.get('/products', { params: filters });
      set({ products: response.data.data });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  fetchProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },
}));
```

### 3. Create Layout Component

```jsx
// src/layouts/Layout.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

### 4. Create Navbar Component

```jsx
// src/components/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart } = useCartStore();
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          VELORA
        </Link>
        
        <div className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/shop" className="hover:text-indigo-600">Shop</Link>
          <Link to="/search" className="hover:text-indigo-600">Search</Link>
        </div>
        
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/wishlist" className="relative">
                <Heart size={24} />
              </Link>
              <Link to="/cart" className="relative">
                <ShoppingCart size={24} />
                {cart.items.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2">
                  <User size={24} />
                  {user?.name}
                </button>
                <div className="hidden group-hover:block absolute right-0 bg-white shadow-lg rounded-lg py-2 min-w-48">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin</Link>
                  )}
                  <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Register
              </Link>
            </>
          )}
        </div>
        
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4">
          <Link to="/" className="block px-4 py-2">Home</Link>
          <Link to="/shop" className="block px-4 py-2">Shop</Link>
          <Link to="/search" className="block px-4 py-2">Search</Link>
        </div>
      )}
    </nav>
  );
}
```

### 5. Create ProtectedRoute Component

```jsx
// src/components/ProtectedRoute.jsx
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
```

### 6. Create AdminRoute Component

```jsx
// src/components/AdminRoute.jsx
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { user } = useAuthStore();
  
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }
  
  return children;
}
```

## 📦 Component Structure

Create these folders and files:

```
src/components/
├── Navbar.jsx
├── Footer.jsx
├── ProductCard.jsx
├── ProductGrid.jsx
├── Cart/
│   ├── CartItem.jsx
│   └── CartSummary.jsx
├── Forms/
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   ├── CheckoutForm.jsx
│   └── ProductForm.jsx
├── Admin/
│   ├── ProductManagement.jsx
│   ├── UserManagement.jsx
│   └── OrderManagement.jsx
├── ProtectedRoute.jsx
└── AdminRoute.jsx

src/pages/
├── HomePage.jsx
├── ShopPage.jsx
├── ProductDetailsPage.jsx
├── CartPage.jsx
├── CheckoutPage.jsx
├── LoginPage.jsx
├── RegisterPage.jsx
├── ProfilePage.jsx
├── OrdersPage.jsx
├── WishlistPage.jsx
├── SearchPage.jsx
├── NotFoundPage.jsx
└── admin/
    └── AdminDashboard.jsx

src/stores/
├── authStore.js
├── cartStore.js
├── wishlistStore.js
├── productStore.js
└── orderStore.js

src/services/
└── api.js (already created)
```

## 🎨 Tailwind CSS Classes Reference

Key utility classes to use:
- `max-w-7xl` - Container
- `py-4 px-4` - Padding
- `flex gap-4` - Flexbox spacing
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4` - Responsive grid
- `bg-indigo-600` - Primary color
- `hover:bg-indigo-700` - Hover states
- `rounded-lg` - Rounded corners
- `shadow-md` - Shadows
- `transition-all` - Smooth transitions

## 🚀 Development Tips

1. **API Integration**: Always use the `api` service from `src/services/api.js`
2. **State Management**: Use Zustand stores for global state
3. **Error Handling**: Wrap API calls in try-catch and show user-friendly errors
4. **Loading States**: Show loading spinners while fetching data
5. **Responsive Design**: Mobile-first approach with Tailwind
6. **Forms**: Use controlled inputs with useState
7. **Toast Notifications**: Use Sonner for feedback

## 📞 Common API Patterns

```javascript
// Fetching data
const { products, loading } = useProductStore();

useEffect(() => {
  useProductStore.getState().fetchProducts();
}, []);

// Handling forms
const [formData, setFormData] = useState({});
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

// Error handling
try {
  await api.post('/endpoint', data);
  toast.success('Success!');
} catch (error) {
  toast.error(error.response?.data?.message || 'Error occurred');
}
```

## 🎯 Next Steps

1. Create the App.jsx with React Router
2. Build the Zustand stores
3. Create the Navbar and Footer
4. Build public pages (Home, Shop, Product Details)
5. Build user pages (Cart, Checkout, Profile)
6. Build admin pages
7. Add styling with Tailwind CSS
8. Test all functionality
9. Deploy

Good luck building the frontend! The backend is ready to serve all your requests. 🚀
