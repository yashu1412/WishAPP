# Wishes App

Create personalized wishes in seconds! Beautiful templates, easy customization, share anywhere.

## 🚀 Features

### 2.1 Authentication
- **User Login flow**: Google, Email, or Guest
- **Profile setup**: Capture user name and profile picture

### 2.2 Home Page
- **Categorized templates**: Birthday, Anniversary, Festivals, etc.
- **Image Listing**: Grid view showing background images
- **Live Preview**: Templates display user's name and photo as overlay

### 2.3 Personalization & Sharing
- **Download Button**: Merges layers into a single image
- **Share Button**: Social integration (WhatsApp, Instagram, Email, etc.) via native share sheet

### 2.4 Monetization (Premium Features)
- **Content Status**: Clearly distinguish between 'Free' and 'Premium' images
- **Subscription Trigger**: Premium popup when clicking premium images

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.1**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animations
- **Clerk**: Authentication service
- **html2canvas**: HTML to image conversion
- **Lucide React**: Icons

### Backend
- **Node.js**: Runtime
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **Cloudinary**: Image storage (placeholder)
- **Razorpay**: Payment integration (placeholder)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB account (local or Atlas)
- Clerk account for authentication

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in `backend/` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/wishes-app
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. **Start the backend server**:
   ```bash
   npm start
   ```
   Backend will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2hhbXBpb24tbW9yYXktMTQuY2xlcmsuYWNjb3VudHMuZGV2JA
   CLERK_SECRET_KEY=sk_test_YGdvo2l8eVXELgrof1IQQmG2AhKhkDqlt91VPDuYCl
   ```

4. **Start the frontend dev server**:
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:3000 (or 3001 if 3000 is in use)

## 🌱 Usage

1. Open http://localhost:3001 in your browser
2. Sign in with Clerk
3. Browse categorized templates
4. Click on a template to preview it
5. Personalize with your name and photo
6. Download or share the customized wish!

## 🎯 Project Structure

```
Wishes App/
├── backend/
│   ├── src/
│   │   ├── config/        # Database, Cloudinary config
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── seeds/         # Seed data
│   │   └── app.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── app/
    │   ├── dashboard/     # Home page with templates
    │   ├── profile/       # User profile page
    │   └── template/      # Template preview & customization
    ├── components/ui/     # Reusable UI components
    ├── contexts/          # React contexts
    ├── lib/               # API client
    └── package.json
```

## 🤔 Technical Approach

### Image Overlay Logic
Templates are rendered as HTML with absolute-positioned layers:
- Background image
- User photo overlay at configured position/size
- User name overlay with custom font and color

When downloading/sharing, `html2canvas` captures the entire DOM element as a single image.

### Authentication
Clerk handles:
- User sign-in (email, social)
- User session management
- Profile data storage

### Challenges Overcome
- **CORS issues with image rendering**: Used html2canvas and converted images to data URLs
- **404 errors with Next.js static assets**: Cleared cache and restarted dev server
- **Clerk integration**: Followed Clerk's Next.js quickstart guide for proper setup

## 🚀 Future Improvements

### Scalability Considerations
- **Database**: Add read replicas for MongoDB
- **Caching**: Implement Redis for template and user data caching
- **CDN**: Serve images via Cloudflare CDN
- **Rate Limiting**: Add express-rate-limit to prevent API abuse
- **Containerization**: Dockerize the app for easy deployment
- **CI/CD**: Set up GitHub Actions for automated testing and deployment

### Feature Enhancements
- More template categories
- Custom text colors/fonts
- User-uploaded templates
- Advanced photo editing
- Analytics dashboard

## 📄 License

MIT

## 📞 Support

For questions or issues, please open a GitHub issue!
