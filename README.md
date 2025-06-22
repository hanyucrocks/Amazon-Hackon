# 🏦 VaultX - Secure Payment Platform

> **Amazon HackOn Season 5 Submission**  
> A revolutionary payment platform powered by Amazon Pay with SmartCoins rewards and advanced seller trust scoring.

## 🌐 Vercel Link

**Live Demo**: [VaultX - Secure Payment Platform](https://vaultxzip.vercel.app/)

![VaultX Banner](https://img.shields.io/badge/VaultX-Secure%20Payment%20Platform-orange?style=for-the-badge&logo=amazon)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![AWS DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-orange?style=for-the-badge&logo=amazon-aws)

## 📋 Table of Contents

- [🚀 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [🚀 Usage](#-usage)
- [📊 API Endpoints](#-api-endpoints)
- [🎯 Key Components](#-key-components)
- [🔐 Security Features](#-security-features)
- [📱 Screenshots](#-screenshots)
- [🤝 Acknowledgments](#-Acknowledgments)


## 🚀 Overview

VaultX is a cutting-edge payment platform that combines the reliability of Amazon Pay with innovative features like SmartCoins rewards and comprehensive seller trust scoring. Built for the modern e-commerce landscape, VaultX provides a secure, user-friendly, and feature-rich payment experience.

### 🎯 Project Goals

- **Secure Payments**: Biometric authentication and PIN-based security
- **Smart Rewards**: SmartCoins system for customer loyalty
- **Trust Scoring**: Advanced seller trust and safety metrics
- **Offline-First**: Robust offline payment processing
- **Price Intelligence**: Real-time price tracking and history

## ✨ Features

### 💳 Payment Features
- **Biometric Authentication**: Fingerprint and PIN-based security
- **Offline Processing**: Payments work without internet connection
- **Transaction Sync**: Automatic synchronization when online
- **Multi-factor Security**: PIN lockout protection and retry limits

### 🪙 SmartCoins System
- **Refund Rewards**: Earn SmartCoins from product refunds
- **Balance Tracking**: Real-time SmartCoins balance
- **Transaction History**: Complete refund and reward history
- **Price History Access**: Direct access to product price charts

### 🛡️ Trust & Safety
- **Seller Trust Scoring**: Multi-dimensional trust analysis
- **Safe Shopping Score**: Comprehensive safety metrics
- **Price Drop Tracking**: Monitor product price changes
- **Refund Rate Analysis**: Seller reliability indicators

### 📊 Analytics & Insights
- **Price History Dashboard**: Interactive price charts
- **Seller Performance**: Detailed seller analytics
- **Transaction Monitoring**: Real-time payment tracking
- **Network Status**: Connectivity monitoring

## 🏗️ Architecture

```
VaultX/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── products/             # Product management
│   │   ├── smartcoins/           # SmartCoins system
│   │   ├── seller-trust/         # Trust scoring
│   │   └── transactions/         # Payment processing
│   ├── components/               # React components
│   ├── dashboard/                # Analytics dashboard
│   ├── vaultx/                   # Main VaultX interface
│   └── auth/                     # Authentication pages
├── components/                   # Shared UI components
├── lib/                          # Utility functions
├── public/                       # Static assets
└── styles/                       # Global styles
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **TypeScript 5.0** - Type-safe JavaScript
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Chart.js** - Interactive charts and graphs

### Backend & Database
- **AWS DynamoDB** - NoSQL database for scalability
- **Next.js API Routes** - Serverless API endpoints
- **IndexedDB** - Client-side data storage
- **LocalStorage** - Fallback storage

### Authentication & Security
- **Biometric Auth** - Fingerprint and PIN security
- **PIN Management** - Secure PIN storage and validation
- **Offline Security** - Local data encryption

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- AWS Account (for DynamoDB)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Amazon-HackOn-Season-5.git
   cd Amazon-HackOn-Season-5
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Vercel Link

**Live Demo**: [VaultX - Secure Payment Platform](https://your-vercel-link.vercel.app)

> 🚀 Experience VaultX in action with our live demo hosted on Vercel!

## 🔧 Configuration

### AWS DynamoDB Setup

1. **Create DynamoDB Tables**
   ```bash
   # Products table
   aws dynamodb create-table \
     --table-name products \
     --attribute-definitions AttributeName=id,AttributeType=N \
     --key-schema AttributeName=id,KeyType=HASH \
     --billing-mode PAY_PER_REQUEST

   # Price history table
   aws dynamodb create-table \
     --table-name price_history \
     --attribute-definitions AttributeName=id,AttributeType=S \
     --key-schema AttributeName=id,KeyType=HASH \
     --billing-mode PAY_PER_REQUEST

   # Refunds table
   aws dynamodb create-table \
     --table-name refunds \
     --attribute-definitions AttributeName=id,AttributeType=S \
     --key-schema AttributeName=id,KeyType=HASH \
     --billing-mode PAY_PER_REQUEST
   ```

2. **Configure IAM Permissions**
   Ensure your AWS credentials have DynamoDB read/write permissions.

## 🚀 Usage

### For Customers

1. **Browse Products**: Visit the homepage to see featured products
2. **Make Payment**: Click "Pay Now" and authenticate with PIN
3. **Earn SmartCoins**: Get rewarded for refunds and price drops
4. **Track History**: View transaction and price history

### For Developers

1. **API Integration**: Use the RESTful API endpoints
2. **Custom Components**: Extend the UI component library
3. **Database Operations**: Work with DynamoDB tables
4. **Authentication**: Implement custom auth flows

## 📊 API Endpoints

### Products
- `GET /api/products/[id]` - Get product details
- `PATCH /api/products/[id]/price` - Update product price
- `POST /api/products/[id]/price-drop` - Process price drop
- `GET /api/products/[id]/price-history` - Get price history

### SmartCoins
- `GET /api/smartcoins?userId={id}` - Get user's SmartCoins balance

### Seller Trust
- `GET /api/seller-trust` - Get all sellers with trust scores
- `GET /api/seller-trust?sellerId={id}` - Get specific seller details

### Transactions
- `POST /api/transactions` - Process payment transactions

## 🎯 Key Components

### BiometricAuth Component
```typescript
// Secure PIN-based authentication with offline support
<BiometricAuth 
  onSuccess={handleTransactionSuccess}
  onError={handleError}
  amount={100}
  productId="123"
/>
```

### Price History Dashboard
```typescript
// Interactive price charts with real-time data
<PriceHistoryChart 
  productId="123"
  data={priceHistoryData}
/>
```

### Seller Trust Modal
```typescript
// Comprehensive seller trust analysis
<SellerDetailModal 
  sellerId="seller_001"
  isOpen={true}
  onClose={handleClose}
/>
```

## 🔐 Security Features

### Authentication
- **6-digit PIN**: Secure numeric authentication
- **Lockout Protection**: 5 failed attempts trigger 20-second lockout
- **Biometric Support**: Fingerprint authentication ready
- **Offline Security**: Local data protection

### Data Protection
- **Encrypted Storage**: Sensitive data encryption
- **Secure APIs**: Parameterized queries prevent injection
- **Network Security**: HTTPS enforcement
- **Session Management**: Secure session handling

### Privacy
- **User Anonymization**: User ID generation
- **Data Minimization**: Only necessary data collection
- **Local Processing**: Offline-first approach

## 📱 Screenshots

### Main Interface
![VaultX Main Interface](./screenshots/main-interface.png)

### SmartCoins Dashboard
![SmartCoins Dashboard](./screenshots/smartcoins-dashboard.png)

### Price History Charts
![Price History](./screenshots/price-history-charts.png)

### Seller Trust Analysis
![Seller Trust](./screenshots/seller-trust-analysis.png)

## 🙏 Acknowledgments

- **Amazon Web Services** for DynamoDB infrastructure
- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible components
- **HackOn Season 5** organizers for the opportunity
- **Nikhil** for building the APIs and Backend
- **Shreelekha** for building the Face-ID Biometric and PPT
- **Mansi** for building the Seller Trust and UI and PPT

---

**Built with ❤️ for Amazon HackOn Season 5**

