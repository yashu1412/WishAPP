# Technical Approach Document

## Problem Solving Approach

### Image Overlay Logic Implementation

The core feature of the Wishes App is the ability to overlay a user's name and photo on template images and export the result as a single image. Here's how this was implemented:

#### 1. Template Data Structure
Each template in the database includes an `overlayConfig` field that defines:
```javascript
{
  photoX: number,        // X position of photo overlay (percentage)
  photoY: number,        // Y position of photo overlay (percentage)
  photoSize: number,     // Size of photo overlay (pixels)
  textX: number,         // X position of name text (percentage)
  textY: number,         // Y position of name text (percentage)
  fontSize: number,      // Font size for name text (pixels)
  fontColor: string      // Font color for name text (hex)
}
```

#### 2. HTML/CSS Overlay
The template preview is rendered as HTML with:
- A container div that holds the template image
- An absolutely positioned photo div at `(photoX%, photoY%)`
- An absolutely positioned name text div at `(textX%, textY%)`
- CSS ensures proper z-indexing (photo and text on top)

```tsx
<div ref={templateRef} className="relative">
  <img src={templateImageDataUrl} alt="Template" />
  <div 
    className="absolute rounded-full overflow-hidden"
    style={{
      left: `${template.overlayConfig.photoX}%`,
      top: `${template.overlayConfig.photoY}%`,
      width: `${template.overlayConfig.photoSize}px`,
      height: `${template.overlayConfig.photoSize}px`,
    }}
  >
    {user?.imageUrl ? (
      <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full bg-primary/30 flex items-center justify-center">
        <User className="w-12 h-12 text-white" />
      </div>
    )}
  </div>
  <div 
    className="absolute font-bold"
    style={{
      left: `${template.overlayConfig.textX}%`,
      top: `${template.overlayConfig.textY}%`,
      fontSize: `${template.overlayConfig.fontSize}px`,
      color: template.overlayConfig.fontColor,
      transform: 'translate(-50%, -50%)',
    }}
  >
    {name}
  </div>
</div>
```

#### 3. Image Export
To export the composite image:
- Use `html2canvas` library to capture the entire container DOM element
- Convert the result to a data URL
- Create a temporary `<a>` element to trigger download
- For sharing, use the Web Share API or fall back to clipboard

### Cross-Origin Resource Sharing (CORS)
- Images from Unsplash needed proper CORS handling
- Used `fetch` to retrieve images and convert to data URLs before rendering
- Added `crossOrigin="anonymous"` to img tags

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.1 | Full-stack React framework with App Router |
| React | 19 | UI library |
| TypeScript | - | Type safety |
| Tailwind CSS | - | Utility-first CSS framework |
| Framer Motion | - | Smooth animations |
| Clerk | - | User authentication and session management |
| html2canvas | - | Convert HTML elements to images |
| Lucide React | - | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | JavaScript runtime |
| Express.js | - | Web application framework |
| MongoDB | - | NoSQL database |
| Mongoose | - | MongoDB ODM |
| Cloudinary | - | Cloud image storage (placeholder) |
| Razorpay | - | Payment integration (placeholder) |

---

## Challenges Faced & Solutions

### 1. Next.js Static File 404 Errors
**Problem**: Application showed 404 errors for CSS and JS chunks when accessing http://localhost:3000

**Root Cause**: The app was started in production mode (`next start`) without first running a build (`npm run build`).

**Solution**: 
- Cleared the `.next` cache folder
- Restarted in development mode (`npm run dev`)
- Development mode automatically generates and serves static files on demand

### 2. Invalid example.com Image URL
**Problem**: Next.js Image component threw an error because `https://example.com/new-photo.jpg` wasn't configured in `next.config.js`

**Root Cause**: Old authentication system had placeholder URLs that still lingered in user data.

**Solutions**:
1. Added `example.com` to allowed domains in `next.config.js`
2. Updated profile components to fallback to regular `<img>` tags for potentially invalid URLs
3. Added validation to skip Next Image for example.com URLs

### 3. Clerk Integration Issues
**Problem**: `<SignIn />` component errors about missing catch-all routes

**Root Cause**: Clerk expects specific route patterns for authentication flows.

**Solutions**:
1. Added `routing="hash"` prop to `<SignIn />` to avoid route conflicts
2. Simplified middleware to use default Clerk configuration
3. Replaced custom AuthContext entirely with Clerk's `useAuth()`, `useUser()`, and `<SignOutButton />`

### 4. CORS with html2canvas
**Problem**: Unsplash images caused tainted canvas errors when trying to export

**Root Cause**: Browser security prevents capturing cross-origin images to canvas without proper CORS headers.

**Solutions**:
1. First fetch the image with `fetch()`
2. Convert to Blob, then to data URL
3. Render the data URL in the img tag instead of the original URL
4. This ensures the canvas isn't tainted and can be exported

### 5. TypeScript and Refactoring
**Problem**: Changing authentication systems required refactoring many files

**Solution**:
- Created an incremental refactoring plan
- Kept old code working while implementing new features
- Tested each change before moving on

---

## Future Improvements & Scalability

### Short-Term Improvements
1. **Proper Clerk User Sync**:
   - Create backend webhook endpoint to sync Clerk users to MongoDB
   - Store premium status, share history, etc., linked to Clerk user ID

2. **Image Upload**:
   - Add Cloudinary integration for profile photo uploads
   - Let users upload their own template backgrounds

3. **Real Payment Integration**:
   - Implement full Razorpay flow
   - Webhook to verify payments and update user premium status

### Medium-Term Scalability
1. **Caching Layer**:
   - Add Redis to cache templates and categories
   - Reduce database queries for frequently accessed data

2. **Image CDN**:
   - Use Cloudflare or Cloudinary CDN for all images
   - Reduce latency and server load

3. **Rate Limiting**:
   - Add `express-rate-limit` to backend
   - Prevent API abuse

### Long-Term Scalability
1. **Database Scaling**:
   - Add MongoDB read replicas
   - Implement sharding for large datasets

2. **Containerization & Orchestration**:
   - Dockerize frontend and backend
   - Deploy to Kubernetes or ECS for auto-scaling

3. **CI/CD Pipeline**:
   - GitHub Actions for automated testing
   - Deploy to staging/production on merge
   - Run end-to-end tests before releases

4. **Analytics & Monitoring**:
   - Add Sentry for error tracking
   - Add Google Analytics or PostHog for product analytics
   - Monitor server metrics with Prometheus + Grafana

5. **Multi-Region Deployment**:
   - Deploy app to multiple AWS/GCP regions
   - Use global load balancer
   - Reduce latency for users worldwide
