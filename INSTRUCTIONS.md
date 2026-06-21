# KopiDuduk - Coffee Ordering System

## Getting Started

### 1. First Time Setup

When you first load the application, the database will automatically be seeded with 6 coffee products:
- Espresso (Rp 25.000)
- Cappuccino (Rp 32.000)
- Cafe Latte (Rp 35.000)
- Americano (Rp 28.000)
- Mocha (Rp 38.000)
- Caramel Macchiato (Rp 40.000)

### 2. Create Accounts

#### Create Admin Account:
1. Click "Masuk" button on the landing page
2. Click "Daftar di sini" to switch to registration
3. Fill in the form:
   - Nama Lengkap: Admin
   - Email: admin@kopiduduk.com
   - Password: admin123
   - Daftar sebagai: **Admin**
4. Click "Daftar"
5. Then login with the admin credentials

#### Create Customer Account:
1. Click "Masuk" button
2. Click "Daftar di sini"
3. Fill in the form:
   - Nama Lengkap: Customer
   - Email: customer@kopiduduk.com
   - Password: customer123
   - Daftar sebagai: **Customer**
4. Click "Daftar"
5. Then login with the customer credentials

### 3. Customer Features

Once logged in as a customer, you can:
- View dashboard with statistics (Total Products, Total Orders, Total Spending)
- Browse coffee menu (initially shows 4 products)
- Click "Lihat Lebih Banyak" to see all products
- Add products to cart using the shopping cart icon
- View and modify cart in the sidebar
- Checkout with customer name and table number
- View order history with status tracking

### 4. Admin Features

Once logged in as an admin, you can:
- View dashboard overview with:
  - Total Products
  - Total Orders
  - Total Revenue
  - Total Customers
  - Recent orders
- **Product Management**:
  - Search products
  - Add new products with name, price, stock, description, and image URL
  - Edit existing products
  - Delete products
- **Order Management**:
  - View all customer orders
  - Update order status (Pending → Processing → Completed)
  - View order details

### 5. System Flow

1. **Customer Journey**:
   - Register/Login → Browse Menu → Add to Cart → Checkout → View Order History

2. **Admin Journey**:
   - Login → Manage Products → View Orders → Update Order Status

### 6. Test Credentials

**Admin:**
- Email: admin@kopiduduk.com
- Password: admin123

**Customer:**
- Email: customer@kopiduduk.com
- Password: customer123

## Features

### Landing Page
- Hero section with call-to-action
- About section
- Benefits section with 3 cards
- Team section with 3 members
- Smooth scroll navigation
- Responsive design

### Authentication
- Register with role selection (Customer/Admin)
- Login with email/password
- Automatic session management
- Role-based routing

### Customer Dashboard
- Statistics cards
- Product catalog with lazy loading
- Shopping cart with quantity management
- Checkout with customer details
- Order history with status

### Admin Dashboard
- Sidebar navigation
- Statistics overview
- Product CRUD operations
- Order management
- Search functionality
- Status update dropdown

## Technology Stack

- **Frontend**: React, TailwindCSS v4
- **Routing**: React Router v7 (Data Mode)
- **Backend**: Supabase Edge Functions (Hono)
- **Database**: Supabase KV Store
- **Authentication**: Supabase Auth
- **UI Components**: Lucide React Icons
- **Notifications**: Sonner Toast

## Notes

- This is a university project prototype
- Images are sourced from Unsplash
- Indonesian language interface
- Warm coffee-themed color palette
- Mobile-responsive design
