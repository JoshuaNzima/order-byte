# OrderByte - Digital Menu & Ordering System

## Overview

OrderByte is a complete QR code-based digital menu and ordering platform designed for hospitality establishments. The application allows restaurants and cafes to display their menus digitally through QR codes, enabling customers to browse menus and place orders directly from their tables without requiring accounts or app downloads. Built with Next.js and deployed on Cloudflare Workers, the system supports multiple organizations with customizable themes, full ordering capabilities, and comprehensive staff management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with React 19 using the App Router architecture
- **Styling**: Tailwind CSS 4 with custom CSS variables for theming and gradients
- **TypeScript**: Full type safety with strict configuration
- **State Management**: React Context for cart management across components
- **Component Structure**: Enhanced modular component design with animations and interactivity
  - `MenuPageWrapper`: Handles suspense boundaries and loading states
  - `MenuPage`: Main menu display logic with URL parameter handling and landing page
  - `MenuHeader`: Enhanced organization branding with gradient text and contact icons
  - `MenuCategory`: Category grouping and item organization
  - `MenuItem`: Interactive menu items with add-to-cart functionality and success animations
  - `Cart`: Floating cart with full ordering capabilities
  - `Button`: Reusable button component with multiple variants and loading states
  - `Card`: Enhanced card component with hover effects and animations

### Deployment Architecture
- **Platform**: Cloudflare Workers for serverless deployment
- **Adapter**: OpenNext Cloudflare adapter for Next.js compatibility
- **Build Tool**: OpenNext for transforming Next.js build output
- **Development**: Local development with hostname binding for Replit compatibility

### Data Architecture
- **Data Source**: In-memory data storage with full CRUD operations
- **Type System**: Comprehensive TypeScript interfaces for menu, order, and staff entities
- **Organization Model**: Multi-tenant design supporting multiple restaurants
- **Menu Structure**: Hierarchical category-based organization with item-level controls
- **Order Management**: Complete order lifecycle from placement to delivery
- **API Layer**: RESTful API endpoints for order management and staff operations

### Routing Strategy
- **URL Parameters**: Organization identification through query parameters (`?org=organization-id`)
- **Fallback Handling**: Default organization and graceful error states
- **Client-Side Routing**: Search parameter handling with Next.js navigation

### Theming System
- **Customizable Colors**: Per-organization primary, secondary, and accent colors
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Accessibility**: Proper contrast ratios and minimum touch target sizes

### State Management
- **Cart Management**: React Context with custom hooks for cart operations
- **Loading States**: Suspense boundaries and loading animations throughout the app
- **Error Handling**: Graceful fallbacks for missing data and API failures
- **Real-time Updates**: Dynamic order status updates in staff dashboard

## External Dependencies

### Core Framework Dependencies
- **Next.js 15.3.3**: React-based framework for full-stack development
- **React 19.0.0**: Core UI library with concurrent features
- **React DOM 19.0.0**: DOM rendering for React applications

### Deployment Dependencies
- **@opennextjs/cloudflare 1.3.0**: Cloudflare adapter for Next.js applications
- **Wrangler 4.21.x**: Cloudflare Workers CLI and development tools

### Styling Dependencies
- **Tailwind CSS 4.1.1**: Utility-first CSS framework
- **@tailwindcss/postcss 4.1.4**: PostCSS integration for Tailwind
- **Geist Font Family**: Custom Google Fonts (Geist and Geist Mono)

### Development Dependencies
- **TypeScript 5.8.3**: Type checking and development tooling
- **ESLint 9.27.0**: Code linting with Next.js configuration
- **Various @types packages**: Type definitions for Node.js and React

### Cloudflare Integration
- **Workers Runtime**: Serverless execution environment
- **Assets Fetcher**: Static asset serving through Cloudflare
- **Environment Types**: Generated type definitions for Cloudflare-specific APIs