# Credit Wallet System Implementation

## Overview
This implementation adds a credit wallet system that rewards buyers for purchasing eco-friendly bags. The system awards 1 credit point for every 100 eco-friendly bags purchased, and each point provides a ₹10 discount on future purchases.

## Features

### 1. Credit Wallet Structure
- **Points**: Current available credit points
- **Total Earned**: Total points ever earned
- **Total Used**: Total points ever used
- **Eco Points**: Legacy eco points field for backward compatibility

### 2. Backend Implementation

#### Database Schema
**Buyer Model:**
```javascript
creditWallet: {
  points: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalUsed: { type: Number, default: 0 }
}
```

**Product Model:**
```javascript
isEcoFriendly: { type: Boolean, default: false }
```

#### API Endpoints
- `GET /api/buyer/credit-wallet/:buyerId` - Get credit wallet information
- `POST /api/buyer/apply-credit-points/:buyerId` - Apply credit points to payment
- `POST /api/buyer/place-order` - Place order with automatic eco-friendly point calculation

#### Key Functions
- `calculateEcoFriendlyPoints(products)` - Calculate points based on eco-friendly bags in cart
- `awardEcoFriendlyPoints(buyerId, points)` - Award calculated points to buyer
- `useCreditPoints(buyerId, pointsToUse)` - Use points during payment

### 3. Frontend Implementation

#### Cart Component Features
- Credit wallet display with available points
- Point application interface
- Real-time discount calculation
- Loading states and error handling
- Automatic point calculation based on cart contents

#### Credit Wallet Component
- Visual display of credit wallet balance
- Statistics (total earned/used)
- How-to-earn instructions
- Point value information

## Usage Flow

### 1. Earning Points
1. Buyer adds eco-friendly bags to cart
2. System automatically calculates points (1 point per 100 bags)
3. Buyer places order
4. System awards calculated credit points
5. Credit wallet balance updates

### 2. Using Points
1. Buyer views cart with available credit points
2. Buyer enters number of points to use
3. Buyer clicks "Apply" button
4. System calculates discount (1 point = ₹10)
5. Final total updates with applied discount
6. Points are deducted from wallet upon order placement

## Technical Details

### Point Calculation
- **1 Credit Point = 100 Eco-friendly Bags**
- Points are calculated as: `Math.floor(totalEcoFriendlyBags / 100)`
- Only products marked with `isEcoFriendly: true` count towards points
- Points are awarded automatically upon order placement

### Point Value
- 1 Credit Point = ₹10 discount
- Points can only be used in whole numbers
- Insufficient points will show error message

### Security
- All buyer routes require authentication
- Points can only be used by the wallet owner
- Server validates point availability before applying

### Error Handling
- Insufficient points error
- Network error handling
- Loading states for better UX
- Fallback to mock data for demo purposes

## Files Modified/Created

### Backend
- `models/Buyer.js` - Added credit wallet schema
- `models/Product.js` - Added isEcoFriendly field
- `controllers/buyerController.js` - Added credit wallet functions and eco-friendly calculation
- `routes/buyerRoute.js` - New buyer routes
- `server.js` - Registered buyer routes

### Frontend
- `pages/Home/Cart.jsx` - Added credit wallet UI and functionality
- `services/creditWalletService.js` - API service functions
- `components/CreditWallet/CreditWallet.jsx` - Credit wallet display component

## Example Scenarios

### Scenario 1: Small Purchase
- Buyer purchases 50 eco-friendly bags
- Points earned: `Math.floor(50 / 100) = 0` points
- No points awarded

### Scenario 2: Large Purchase
- Buyer purchases 250 eco-friendly bags
- Points earned: `Math.floor(250 / 100) = 2` points
- 2 credit points awarded (worth ₹20 discount)

### Scenario 3: Mixed Cart
- Buyer purchases 150 eco-friendly bags + other items
- Points earned: `Math.floor(150 / 100) = 1` point
- 1 credit point awarded (worth ₹10 discount)

## Future Enhancements
- Referral system for additional points
- Point expiration system
- Tier-based point earning (more points for larger orders)
- Point transfer between users
- Admin dashboard for point management
- Bulk eco-friendly bag purchases with bonus points 