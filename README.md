# Shobha Medical Stores - Demo
This is a small static demo for a medical store.

## New: Optional customer name on checkout
When the cart sidebar is open you can now enter an optional "Customer name" before clicking "Proceed to Checkout". The site will include that name in the WhatsApp order message (and save it locally so it persists across page reloads). Files changed to add this feature: `script.js`, `styles.css`, and the cart markup in all pages (`index.html`, `products.html`, `product.html`, `about.html`, `contact.html`, `prescription.html`).
# SHOBHA MEDICAL STORES - Ecommerce Website

A modern, responsive ecommerce website for a medical store built with HTML, CSS, and JavaScript.

## 🌟 Features

### Pages
- **Home Page** - Hero slider, categories, featured products, services, special offers
- **Products Page** - Product grid with advanced filtering (category, price, discount, availability)
- **Single Product Page** - Detailed product view with add to cart and buy now
- **About Us Page** - Company story, statistics, mission/vision, certifications
- **Contact Page** - Contact form, location map, store hours
- **Upload Prescription Page** - Drag & drop file upload with WhatsApp integration

### Core Features
✅ Sticky Navigation Bar
✅ Search Functionality
✅ Shopping Cart with localStorage
✅ Category Filtering System
✅ Price Range Filter
✅ Discount Filter
✅ Product Quick View
✅ WhatsApp Order Integration
✅ WhatsApp Floating Button
✅ Responsive Design (Mobile & Desktop)
✅ Smooth Animations & Transitions
✅ SEO Optimized

### Product Categories
- Medicines (OTC + Prescription)
- Cosmetics & Beauty Products
- Baby Care Products
- Personal Care Items
- Health Supplements
- Packed Food

### Design Features
- Clean Medical Theme
- White, Green & Blue Color Palette
- Glassmorphism Effects
- Gradient Backgrounds
- Professional Icons (Font Awesome)
- Modern Typography (Inter & Outfit fonts)
- Smooth Hover Effects
- Micro-animations

## 📁 File Structure

```
d:/html/p12/
├── index.html          # Home page
├── products.html       # Products listing with filters
├── product.html        # Single product details
├── about.html          # About us page
├── contact.html        # Contact page with form & map
├── prescription.html   # Prescription upload page
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript file
└── README.md          # This file
```

## 🎨 Color Scheme

- **Primary Green**: #00A896
- **Secondary Blue**: #4A90E2
- **Accent Teal**: #00D9D0
- **Background**: #F8FAFB
- **Text Primary**: #1A2B3D
- **Text Secondary**: #5A6C7D

## 🚀 How to Use

1. Open `index.html` in your web browser
2. Navigate through different pages using the navigation menu
3. Browse products and use filters on the products page
4. Add items to cart and proceed to WhatsApp checkout
5. Upload prescriptions through the dedicated page

## 💡 Key Functionality

### Shopping Cart
- Add/remove items
- Update quantities
- LocalStorage persistence
- WhatsApp checkout integration

### Search & Filters
- Category-based filtering
- Price range selection
- Discount percentage filter
- Stock availability filter
- Sort by: Price, Name, Discount

### WhatsApp Integration
- Order checkout via WhatsApp
- Contact form submission
- Prescription upload notification
- Floating WhatsApp button for support

## 📱 Responsive Breakpoints

- Desktop: > 968px
- Tablet: 768px - 968px
- Mobile: < 768px

## 🎯 Browser Compatibility

- Chrome (Recommended)
- Firefox
- Safari
- Edge
- Opera

## 📞 Support

For support and queries:
- Phone: +91 1234567890
- Email: info@shobhamedical.com
- WhatsApp: Chat via floating button

## 🔧 Customization

### Update Contact Information
Edit the phone number and email in all HTML files:
- Search for `+91 1234567890` and replace
- Search for `info@shobhamedical.com` and replace

### Update Store Address
Edit the address in footer sections:
```html
<span>123 Main Street, Medical Plaza<br>City, State 123456</span>
```

### Update Google Maps
Replace the iframe src in `contact.html` with your Google Maps embed link

### Add More Products
Edit the `products` array in `script.js`:
```javascript
const products = [
    {
        id: 9,
        name: 'Your Product Name',
        category: 'medicines',
        price: 299,
        originalPrice: 399,
        discount: 25,
        image: 'your-image-url',
        inStock: true,
        description: 'Product description'
    }
];
```

## 🌐 Deployment

To deploy this website:
1. Upload all files to your web hosting
2. Ensure all file paths are correct
3. Update contact information and links
4. Test all functionality

## 📝 License

© 2024 SHOBHA MEDICAL STORES. All rights reserved.

## 🎉 Credits

- Icons: Font Awesome
- Fonts: Google Fonts (Inter, Outfit)
- Design: Custom Medical Theme

---

**Note**: Remember to replace placeholder content (phone numbers, addresses, map embeds) with actual business information before going live!
