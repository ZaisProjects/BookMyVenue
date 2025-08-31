# Book My Venue - Online Venue Booking Platform

## Overview

Book My Venue is a modern web platform where users can easily search, explore, and book venues for events like weddings, meetings, stays or parties. It combines a clean EJS (template-based) frontend with a powerful Node.js + Express.js backend, MongoDB for database and RazorPay For Payment System. Users can browse venues by category, view maps, contact owners, and admins have full control over listings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Templates**: EJS (renders HTML pages dynamically).
- **UI Framework**: Bootstrap 5 for responsive and modern design
- **Styling**: Bootstrap and Custom CSS for extra polish and animations.
- **Navigation**: Express routing with dynamic EJS page rendering.
- **Search Interface**: Node.js with Express.js framework.


### Backend Architecture

- **Server**: Node.js with Express.js framework.
- **Language**: JavaScript with ES6 modules.
- **API Pattern**: RESTful route handlers for dynamic pages and form processing.
- **Middleware**: Body parsing, logging, image handling via Multer or Cloudinary.
- **Session Management**: User sessions handled with Express sessions.

### Database Layer

- **Database**: MongoDB Atlas (cloud-hosted).
- **ODM**: Mongoose for schema-based modeling and validation.
- **Collections**: Venues, Users and  Reviews.

## Key Components

### Data Models
- **Listings**: Core entity with categories (events, hotels, meetings, weddings), pricing, amenities, and location data.
- **Users**: Includes regular users and a special owner and super admin with elevated privileges
- **Reviews**: Users Submitted reviews on venue listed
- **Bookings**: User Booked Venue Details


### Frontend Components

- **Search Interface**: Keyword and category-based search input with results display
- **Category Browsing**: Buttons or cards for venue types (e.g., Wedding, Meeting)
- **Venue Listings**: Card-based layout with thumbnails, price, and location info
- **Detail Page**: Venue-specific page with description, map, and inquiry form
- **Admin Panel**: Admin access to view/edit/delete all listings
-**Payment**: RazorPay Payment System Integration for booking venue

### Backend Services

- **Venue Management**: Full CRUD operations (create, read, update, delete) with category-based filtering.
- **Admin Authorization**: Super admin verification to access privileged routes
- **File Upload Handling**: Upload venue images using Multer and optionally store them on Cloudinary
- **Payment Authorization**: Robust Payment Handling and Authorization via RazorPay


## Data Flow

1. **Client Requests**: Users submit forms or click buttons that trigger Express route handlers
2. **Route Handling**: Server processes data, validates input, and interacts with MongoDB
3. **Database Operations**: MongoDB stores and retrieves listings, users, and form data
4. **Response Handling**: EJS templates render data dynamically as HTML pages
5. **UI Updates**: Pages refresh or redirect based on the results of user actions


## External Dependencies

### Core Dependencies

- `express` – Web server and routing
- `mongoose` – MongoDB modeling and schema enforcement
- `ejs` – Dynamic template rendering
- `bootstrap` – UI framework for layout and styling
- `multer` – File upload handling (used for venue images)
- `cloudinary` (optional) – Cloud-based image hosting and delivery
- `dotenv` – Manage environment variables like MongoDB URI or API keys

### Development Tools

- `nodemon` – Automatically restarts the server on code changes
- `express-session` – For managing user sessions (if authentication is used)
- `morgan` – HTTP request logging
- `body-parser` – Parsing form input data

## Deployment Strategy

### Development Environment

- **Local Development**: Runs on Node.js server with live reload using nodemon.
- **Template Rendering**: EJS pages updated instantly from backend routes.
- **Image Storage**: Local or Cloudinary for storing uploaded venue images.

### Production Build

- **Hosting**: Deployed using Render.
- **Frontend**: Served via Express as dynamic EJS templates.
- **Backend**: Node.js + Express.js running as a web server.
- **Database**: MongoDB Atlas connected using environment variable `MONGODB_URI`
- **Image Hosting**: Uses Cloudinary in production for fast delivery.

### Configuration

- **Environment Variables**: `MONGODB_URI`, `CLOUDINARY_API_KEY`, and other secrets
- **Startup Scripts**: Separate scripts for starting server locally or on deployment
- **Validation & Logging**: Middleware and dev tools used for form checking and debugging

## Summary

Book My Venue is a smart, clean, and practical venue booking platform built using Node.js, Express, MongoDB, and EJS. It supports:

- User friendly UI
- Payment System Authorization
- Powerful venue search  
- Category browsing  
- Super admin control  
- Listings control to its owner  

All working together smoothly in a way that’s fast, secure, and easy to use for both customers and admins.