# OrderByte - Digital Menu System

## Overview

OrderByte is a QR code-based digital menu platform designed for hospitality establishments. The application allows restaurants and cafes to display their menus digitally through QR codes, providing customers with an interactive and responsive menu browsing experience. Built with Next.js and deployed on Cloudflare Workers, the system supports multiple organizations with customizable themes and menu structures.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with React 19 using the App Router architecture
- **Styling**: Tailwind CSS 4 with custom CSS variables for theming
- **TypeScript**: Full type safety with strict configuration
- **Component Structure**: Modular component design with clear separation of concerns
  - `MenuPageWrapper`: Handles suspense boundaries and loading states
  - `MenuPage`: Main menu display logic with URL parameter handling
  - `MenuHeader`: Organization branding and contact information
  - `MenuCategory`: Category grouping and item organization
  - `MenuItem`: Individual menu item display with dietary indicators

### Deployment Architecture
- **Platform**: Cloudflare Workers for serverless deployment
- **Adapter**: OpenNext Cloudflare adapter for Next.js compatibility
- **Build Tool**: OpenNext for transforming Next.js build output
- **Development**: Local development with hostname binding for Replit compatibility

### Data Architecture
- **Data Source**: Static sample data structure (ready for database integration)
- **Type System**: Comprehensive TypeScript interfaces for menu entities
- **Organization Model**: Multi-tenant design supporting multiple restaurants
- **Menu Structure**: Hierarchical category-based organization with item-level controls

### Routing Strategy
- **URL Parameters**: Organization identification through query parameters (`?org=organization-id`)
- **Fallback Handling**: Default organization and graceful error states
- **Client-Side Routing**: Search parameter handling with Next.js navigation

### Theming System
- **Customizable Colors**: Per-organization primary, secondary, and accent colors
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Accessibility**: Proper contrast ratios and minimum touch target sizes

### State Management
- **Approach**: Props-based data flow without external state management
- **Loading States**: Suspense boundaries for better user experience
- **Error Handling**: Graceful fallbacks for missing data

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