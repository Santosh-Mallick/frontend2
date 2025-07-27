# Cloudinary Integration Setup Guide

This guide explains how to set up Cloudinary for image uploads in your application.

## Backend Setup

### 1. Install Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
npm install cloudinary multer
```

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
```

### 3. Get Cloudinary Credentials

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Replace the placeholder values in your `.env` file

## Frontend Setup

### 1. Environment Variables (Optional)

If you want to configure the API URL, create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Add Product with Image
- **URL**: `POST /api/seller/add-product`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `name` (string, required)
  - `price` (number, required)
  - `description` (string, optional)
  - `category` (string, required)
  - `unit` (string, required) - enum: ['pieces', 'kg', 'gram', 'litre', 'ml', 'packet']
  - `quantity` (number, required)
  - `pricePerUnitOption` (string, required) - enum: ['pieces', 'kg', 'gram', 'litre', 'ml', 'packet']
  - `image` (file, optional) - image file
  - `seller` (string, optional) - seller ID

### Response Format
```json
{
  "message": "Product added successfully",
  "product": {
    "_id": "product_id",
    "name": "Product Name",
    "price": 50.00,
    "description": "Product description",
    "category": "Fruits",
    "seller": "seller_id",
    "quantity": 10,
    "unit": "kg",
    "pricePerUnitOption": "kg",
    "image": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/products/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Features

### Image Processing
- Images are automatically optimized and resized to 500x500 pixels
- Quality is automatically adjusted for optimal file size
- Images are stored in a 'products' folder in Cloudinary
- Secure HTTPS URLs are returned for display

### File Validation
- Only image files are allowed (JPEG, PNG, GIF, etc.)
- Maximum file size: 5MB
- File type validation on both frontend and backend

### Error Handling
- Comprehensive error messages for upload failures
- Validation errors for missing required fields
- Network error handling

## Usage Example

```javascript
// Frontend form submission
const formData = new FormData();
formData.append('name', 'Organic Apples');
formData.append('price', '50.00');
formData.append('category', 'Fruits');
formData.append('unit', 'kg');
formData.append('quantity', '10');
formData.append('pricePerUnitOption', 'kg');
formData.append('image', imageFile); // File object

const response = await fetch('/api/seller/add-product', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.product.image); // Cloudinary URL
```

## Security Considerations

1. **API Key Protection**: Never expose your Cloudinary API secret in frontend code
2. **File Validation**: Always validate file types and sizes on the backend
3. **Rate Limiting**: Consider implementing rate limiting for upload endpoints
4. **Authentication**: Ensure upload endpoints are protected with proper authentication

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend CORS configuration includes your frontend URL
2. **File Upload Failures**: Check file size and type restrictions
3. **Cloudinary Errors**: Verify your Cloudinary credentials are correct
4. **Database Errors**: Ensure your MongoDB connection is working

### Debug Steps

1. Check browser console for frontend errors
2. Check server logs for backend errors
3. Verify environment variables are loaded correctly
4. Test API endpoints with tools like Postman 