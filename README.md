# Smart Clothing – Full-Stack E-commerce (Admin + Storefront + API)

A full-stack clothing e-commerce platform featuring a customer storefront, an admin dashboard, and a Node/Express/MongoDB backend with auth, Cloudinary image storage, and Stripe payments.


## 🔥 Features
- **Storefront**
  - Browse by category/subcategory; search, price filter & sorting (low→high, high→low, latest, trending).
  - Product page with multiple images, size selection (S–XXL), related products.
  - Cart management, address form, place order (Stripe Payment Intent and COD).
  - JWT auth (signup/login), order history per user.
- **Admin**
  - Product CRUD with **Cloudinary** multi-image upload & image replacement.
  - Manage orders; update status (Packing → Shipped → Out for delivery → Delivered).
- **Backend**
  - Express routers: users, products, orders.
  - Auth middleware, Mongoose models, Stripe integration, delivery charge logic.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Context API, Axios, Tailwind CSS.
- **Backend:** Node.js, Express, MongoDB (Mongoose), Cloudinary, Stripe.

## ⚙️ Environment Variables
Create a `.env` file inside **backend/** with:
MONGODB_URI
CLOUDINARY_API_KEY 
CLOUDINARY_SECRET_KEY
CLOUDINARY_NAME 
JWT_SECRET 
ADMIN_EMAIL 
ADMIN_PASSWORD 
STRIPE_SECRET_KEY 

