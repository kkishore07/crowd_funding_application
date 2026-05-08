# CrowdFunding MERN Application - Viva Preparation Guide

---

## 📋 PROJECT OVERVIEW

### Project Title
**CrowdFunding Platform** - A full-stack web application for creating and managing crowdfunding campaigns

### Problem Statement
Create a platform where:
- Users can create campaigns to raise funds for various causes
- Donors can contribute to active campaigns
- Admins can approve/reject campaigns and manage the platform
- Creators can track their campaign performance
- The system includes fraud detection to prevent suspicious activities

### Key Objectives
✅ Role-based access control (User, Creator, Admin)  
✅ Secure authentication using JWT tokens  
✅ Real-time campaign tracking with current vs target amounts  
✅ Fraud detection in donations  
✅ Campaign rating system  
✅ Refund request mechanism  
✅ Admin dashboard for platform management  

---

## 🏗️ ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + TypeScript)            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pages: Login, Register, Dashboard, Campaigns         │   │
│  │ Components: Forms, Cards, Tables, Dashboards        │   │
│  │ Context: GlobalContext (Auth, User State)           │   │
│  │ Libraries: React Query, ShadCN UI, TailwindCSS      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Express)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Routes: /auth, /campaign, /donation                 │   │
│  │ Controllers: Business Logic                          │   │
│  │ Middleware: Authentication, File Upload, Validation │   │
│  │ Utilities: JWT verification, Fraud Detection         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ Mongoose
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (MongoDB)                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Collections: users, campaigns, donations            │   │
│  │ Relationships: Referenced relationships              │   │
│  │ Indexes: Email (unique), status, creator, donor     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcryptjs),
  role: String (enum: "user", "creator", "admin"),
  createdAt: Date,
  updatedAt: Date
}
```

### Campaigns Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  targetAmount: Number,
  currentAmount: Number (default: 0),
  endDate: Date,
  isExpired: Boolean,
  creator: ObjectId (ref: "users"),
  creatorName: String,
  status: String (enum: "pending", "approved", "rejected", "closed"),
  rejectionReason: String,
  image: String (file path),
  averageRating: Number (0-5),
  totalRatings: Number,
  ratings: [{
    user: ObjectId,
    rating: Number,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Donations Collection
```javascript
{
  _id: ObjectId,
  donor: ObjectId (ref: "users"),
  donorName: String,
  campaign: ObjectId (ref: "campaigns"),
  amount: Number,
  paymentStatus: String (enum: "pending", "processing", "completed", "failed", "refunded"),
  paymentMethod: String (enum: "credit_card", "debit_card", "upi", "net_banking", "wallet"),
  transactionId: String,
  refundStatus: String (enum: "none", "requested", "processing", "completed", "rejected"),
  refundReason: String,
  refundedAt: Date,
  isSuspicious: Boolean,
  suspiciousReason: String,
  createdAt: Date
}
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Authentication Flow

```
1. User Registration
   ├─ POST /auth/register
   ├─ Hash password with bcrypt (10 salt rounds)
   ├─ Check if email already exists
   └─ Store user in DB

2. User Login
   ├─ POST /auth/login
   ├─ Find user by email
   ├─ Compare passwords using bcrypt
   ├─ Generate JWT token (expires in 1h)
   ├─ Return user + token
   └─ Frontend stores token in localStorage

3. Protected Requests
   ├─ Include token in Authorization header: "Bearer <token>"
   ├─ Backend verifies JWT signature
   ├─ Extract user info from decoded token
   └─ Allow/deny based on role
```

### Middleware - Role-Based Access Control

```javascript
verifyToken() 
  ├─ Checks if token exists
  ├─ Decodes JWT
  └─ Sets req.user

verifyTokenAndAdmin()
  ├─ Calls verifyToken()
  └─ Checks if role === "admin"

verifyTokenAndCreator()
  ├─ Calls verifyToken()
  └─ Checks if role === "creator"

verifyTokenAndAuthorization()
  ├─ Calls verifyToken()
  └─ Allows if own user or admin
```

---

## 🔗 API ENDPOINTS

### Authentication Routes
```
POST   /auth/register       - Create new user
POST   /auth/login          - Login user
GET    /auth/users          - Get all users (Admin only)
```

### Campaign Routes
```
GET    /campaign                      - Get all campaigns (public)
POST   /campaign                      - Create campaign (Creator only, with image upload)
GET    /campaign/:id                  - Get campaign details
GET    /campaign/creator/my-campaigns - Get creator's campaigns
GET    /campaign/creator/analytics    - Get creator analytics
PUT    /campaign/:id                  - Update campaign (Creator, with image)
DELETE /campaign/:id                  - Delete campaign (Creator)
PUT    /campaign/:id/approve          - Approve campaign (Admin)
PUT    /campaign/:id/reject           - Reject campaign (Admin)
POST   /campaign/:id/rate             - Rate campaign (Any logged-in user)
```

### Donation Routes
```
POST   /donation                   - Create donation (Logged-in users)
GET    /donation/my-donations      - Get user's donations
GET    /donation/suspicious        - Get suspicious donations (Admin)
POST   /donation/request-refund    - Request refund (within 7 days)
POST   /donation/process-refund    - Process refund (Admin)
GET    /donation/analytics         - Get donation analytics (Admin)
```

---

## 🛡️ FRAUD DETECTION SYSTEM

The application implements smart fraud detection to flag suspicious donations:

```javascript
Fraud Detection Rules:
1. Duplicate Donations → If same donor donates to same campaign within 1 minute
2. Unusually High Amount → If donation amount > ₹1,000,000
3. Rapid Multiple Donations → If donor makes 5+ donations within 1 hour
```

**Impact**: Flagged donations are NOT added to campaign's current amount until admin reviews them

---

## 📊 KEY FEATURES BREAKDOWN

### 1. Campaign Lifecycle
```
User creates campaign → Campaign status = "pending"
                ↓
      Admin reviews → Approve/Reject
                ↓
    If Approved → status = "approved"
                ↓
    Campaign appears on platform → Can receive donations
                ↓
    End Date expires OR Target reached → Campaign "closed"
```

### 2. Donation Process
```
Donor selects campaign → Enters donation amount
            ↓
  Backend validates:
  ├─ Campaign is approved
  ├─ Target not already reached
  ├─ Donation doesn't exceed remaining amount
  ├─ Campaign not expired
  └─ Fraud checks
            ↓
  Create donation record → Update campaign amount (if not suspicious)
            ↓
  Return success/flag status
```

### 3. Refund System
```
Donor requests refund → Within 7 days of donation
            ↓
     Admin reviews → Approve/Reject
            ↓
  If approved → Refund amount → Deduct from campaign
```

### 4. Rating System
```
Donor rates campaign → 1-5 stars
            ↓
  Store rating in ratings array
            ↓
  Recalculate averageRating = sum of ratings / totalRatings
```

---

## 💡 IMPORTANT DESIGN DECISIONS

### 1. **JWT over Sessions**
- **Why**: Stateless authentication, better for scalability
- **Token**: Contains id, email, role
- **Expiry**: 1 hour (configurable via ENV)

### 2. **Password Hashing - bcryptjs**
- **Why**: Industry standard for password security
- **Salt Rounds**: 10 (provides balance between security and performance)
- **Comparison**: Never store plain passwords, always compare hashed versions

### 3. **Reference-based Relationships**
- **Why**: Flexibility in MongoDB, avoid data duplication in some cases
- **Example**: Campaign stores creator's ObjectId (not embedded full user object)

### 4. **Fraud Detection Logic**
- **Why**: Prevent suspicious activities while maintaining UX
- **Approach**: Flag donations but don't automatically reject them
- **Admin Review**: Allows admins to decide final action

### 5. **Frontend State Management**
- **GlobalContext**: Handles user authentication state
- **LocalStorage**: Persists token and user across page refreshes
- **React Query**: Manages server state and API caching

### 6. **File Upload with Multer**
- **Why**: Handle campaign images
- **Path**: `/uploads` directory
- **Served**: Via static middleware at `/uploads/:filename`

---

## 🎯 POTENTIAL INTERVIEW QUESTIONS & ANSWERS

### Basic Understanding

**Q1: What is the main purpose of this application?**
A: This is a crowdfunding platform where creators can raise funds for campaigns. Users can donate to approved campaigns, admins can manage the platform, and the system includes fraud detection and refund mechanisms.

**Q2: What are the three roles in the system?**
A: 
- **User**: Can view campaigns, donate, rate campaigns, request refunds
- **Creator**: Can create campaigns, edit them, view analytics
- **Admin**: Can approve/reject campaigns, manage users, process refunds, view suspicious donations

**Q3: How is authentication handled?**
A: JWT-based authentication. User logs in with email/password, backend verifies credentials using bcryptjs, generates JWT token, frontend stores it in localStorage, and includes it in subsequent API requests.

---

### Architecture & Design

**Q4: Why did you choose JWT over sessions?**
A: JWT is stateless - no need to store session data on server. Scales better for distributed systems, reduces database queries for session verification, and works well with single-page applications and mobile apps.

**Q5: How does the fraud detection work?**
A: The system checks for:
1. Duplicate donations to same campaign within 1 minute
2. Donation amounts exceeding ₹1,000,000
3. More than 5 donations by same user within 1 hour

Flagged donations are stored but not added to campaign amount until admin review.

**Q6: Why use reference-based relationships instead of embedding user data in campaigns?**
A: References reduce data duplication. If user changes their name, it updates everywhere automatically. Embedded documents would require updates in multiple places. MongoDB's `populate()` makes fetching related data simple.

---

### Technical Implementation

**Q7: Explain the authentication middleware flow.**
A: 
1. Frontend sends request with Authorization header containing JWT
2. Backend middleware extracts token
3. Verifies JWT signature using secret key
4. If valid, decodes token to get user info (id, email, role)
5. Attaches user object to request
6. Next middleware/controller can access `req.user`

**Q8: What happens when a campaign expires?**
A: Campaign has `checkExpired()` method that sets `isExpired = true` if current date > endDate. When user tries to donate, backend checks this and rejects donation if expired. Campaign status changes to "closed".

**Q9: How is password security ensured?**
A: 
- Passwords are hashed using bcryptjs with 10 salt rounds
- When user registers, password is hashed before storage
- During login, entered password is hashed and compared with stored hash
- Never store or transmit plain passwords

**Q10: Can a user donate more than the remaining target amount?**
A: No. Backend validates that donation amount doesn't exceed `(targetAmount - currentAmount)`. If it would exceed, the request is rejected with message showing remaining amount.

---

### Database & Data

**Q11: Why doesn't the donation decrease campaign amount if marked suspicious?**
A: Suspicious donations might be legitimate. Flagging them for admin review allows verification first. Once admin approves, the amount is confirmed added. This prevents legitimate large donations from being incorrectly excluded.

**Q12: How does the rating system work?**
A: 
- Each campaign has a `ratings` array storing user ratings (1-5)
- When user rates: new rating object is added to array
- `averageRating = sum of all ratings / totalRatings`
- Frontend displays this average to users

**Q13: What are the donation statuses?**
A: `pending`, `processing`, `completed`, `failed`, `refunded`
(Current implementation uses "completed" as default, others available for future payment gateway integration)

---

### Problem Solving

**Q14: What happens if admin approves a campaign but then the creator deletes it?**
A: Creator can delete their campaign. Existing donations remain as records but no longer display since they reference a deleted campaign. Frontend filters out donations with null campaign references.

**Q15: Can a user request multiple refunds for same donation?**
A: No. Backend checks refundStatus. If already "requested" or "completed" or "rejected", the request is denied. User must wait for admin decision.

**Q16: What if campaign target is reached mid-day? Can new donations come in?**
A: No. Backend checks `if (currentAmount >= targetAmount)` and rejects donation. Campaign then "closes". This prevents over-funding.

---

### Frontend Specifics

**Q17: How does the frontend maintain authentication across page refreshes?**
A: 
- On app load, GlobalContext useEffect runs
- It checks localStorage for "cf_user" and "cf_token"
- If both exist, user state is restored
- Token is included in all subsequent API requests

**Q18: What UI library is being used?**
A: ShadCN UI - a React component library built on Radix UI primitives, styled with TailwindCSS. Provides accessible, unstyled components.

---

### Advanced Questions

**Q19: What would you improve in this application?**
A: Potential improvements:
1. **Email verification** - For account security
2. **Real payment gateway** - Instead of mock transactions
3. **Analytics** - More detailed dashboard insights
4. **Notification system** - Notify creators when donations received
5. **Campaign categories** - Filter campaigns by type
6. **Search & filtering** - Advanced campaign search
7. **Rate limiting** - Prevent abuse
8. **Caching** - Redis for frequently accessed data

**Q20: How would you handle if multiple admins process refunds simultaneously?**
A: 
- Add optimistic locking using version numbers
- Or use transactions if MongoDB supports it
- Check refundStatus before processing
- Store which admin processed refund for audit trail

---

## 🧪 TESTING SCENARIOS

### Test Case 1: User Registration & Login
```
1. Register with new email
   ✓ Should create user account
   ✓ Should hash password

2. Login with correct credentials
   ✓ Should return JWT token
   ✓ Should return user data

3. Login with wrong password
   ✓ Should return 401 Unauthorized
```

### Test Case 2: Campaign Creation & Approval
```
1. Creator creates campaign
   ✓ Campaign status should be "pending"
   ✓ Should store image if uploaded

2. Admin approves campaign
   ✓ Status should change to "approved"
   ✓ Should appear in public campaigns list

3. Non-admin tries to approve
   ✓ Should get 403 Forbidden
```

### Test Case 3: Fraud Detection
```
1. User donates twice to same campaign within 1 minute
   ✓ Second donation should be marked suspicious
   ✓ Amount should not be added to campaign

2. Donation exceeds ₹1,000,000
   ✓ Should be marked suspicious

3. Admin reviews and approves suspicious donation
   ✓ Amount should be added to campaign
   ✓ Status should be "completed"
```

### Test Case 4: Refund System
```
1. User requests refund within 7 days
   ✓ Should set refundStatus to "requested"
   ✓ Should store refund reason

2. User tries to request refund after 7 days
   ✓ Should get 400 Bad Request

3. Admin processes refund
   ✓ Amount should deduct from campaign
   ✓ Donation should be marked "refunded"
```

---

## 📱 DEMO WALKTHROUGH

### Demo Flow (10-15 minutes)

**Part 1: User Registration & Login (2 min)**
1. Open home page
2. Click "Register" → Create new user account (as Creator)
3. Fill form → Submit
4. Redirect to login
5. Login with credentials → See dashboard

**Part 2: Creator - Campaign Creation (3 min)**
1. Navigate to "Create Campaign"
2. Fill campaign details (title, description, target amount, end date, image)
3. Submit → Campaign created with status "pending"
4. Show "My Campaigns" page → Campaign visible

**Part 3: Admin - Campaign Approval (2 min)**
1. Login as admin account
2. Navigate to "Campaign Approval"
3. See pending campaign
4. Approve campaign → Status changes to "approved"

**Part 4: User - Donation (3 min)**
1. Login as regular user
2. Navigate to "Browse Campaigns"
3. See approved campaign
4. Click "Donate" → Enter amount
5. Submit → Donation successful
6. Go to "My Donations" → See donation record

**Part 5: Rating System (2 min)**
1. On campaign page → Rate campaign (1-5 stars)
2. Submit rating → Average rating updates
3. Show rating reflected on campaign card

**Part 6: Admin - Fraud Detection (1 min)**
1. Login as admin
2. Navigate to "Suspicious Donations"
3. Show any flagged donations
4. Can approve/reject them

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue 1: CORS Error
**Symptom**: Frontend can't reach backend
**Solution**: 
- Check backend CORS configuration in server.js
- Ensure frontend URL is in allowedOrigins array
- Verify VITE_API_URL environment variable is set correctly

### Issue 2: Authentication Token Invalid
**Symptom**: API returns 401 Unauthorized
**Solution**:
- Verify JWT_SECRET in .env matches between login and protected requests
- Check token expiry time
- Ensure token is included in Authorization header correctly

### Issue 3: File Upload Not Working
**Symptom**: Campaign image not saved
**Solution**:
- Verify `/uploads` directory exists
- Check Multer configuration in uploadMiddleware.js
- Ensure form uses multipart/form-data

### Issue 4: Campaign Amount Not Updating
**Symptom**: Donation accepted but amount not added to campaign
**Solution**:
- Check if donation is marked suspicious
- Verify campaign status is "approved"
- Check if campaign target already reached

---

## 📝 COMMON FOLLOW-UP QUESTIONS TO PREPARE FOR

1. "Why MongoDB instead of SQL?"
   - Flexible schema, good for rapid development, JSON-like documents match JavaScript objects

2. "How would you scale this application?"
   - Database replication, caching layer (Redis), load balancing, microservices architecture

3. "What about security vulnerabilities?"
   - SQL injection: N/A for MongoDB, but NoSQL injection possible → sanitize inputs
   - XSS: React auto-escapes, but validate user-generated content
   - CSRF: Implement CSRF tokens
   - Rate limiting: Prevent brute force attacks

4. "How do you handle concurrent donations?"
   - Use atomic operations in MongoDB
   - Implement transaction logic
   - Version-based optimistic locking

5. "What error handling strategy did you use?"
   - Try-catch blocks, proper HTTP status codes, meaningful error messages, logging

---

## 🚀 TIPS FOR VIVA SUCCESS

1. **Know Your Code**: Be able to quickly locate and explain any file
2. **Explain Design Decisions**: Have reasons for every technology choice
3. **Think About Scale**: Be ready to discuss how system handles growth
4. **Security First**: Emphasize security measures (password hashing, JWT, role-based access)
5. **Real-World Thinking**: Consider payment gateways, notifications, analytics
6. **Practice Explaining**: Be clear and concise, avoid using "um" and "uh"
7. **Show Enthusiasm**: Talk about what you learned and what's challenging
8. **Be Honest**: If you don't know something, say so and explain how you'd find out
9. **Performance**: Mention optimization ideas (indexing, caching, pagination)
10. **Testing**: Talk about test cases you've considered

---

## ✅ FINAL CHECKLIST

Before viva:
- [ ] Review all database schemas
- [ ] Understand all API endpoints
- [ ] Know authentication flow completely
- [ ] Practice explaining architecture
- [ ] Prepare role-based access control examples
- [ ] Be ready to discuss fraud detection
- [ ] Know error handling approach
- [ ] Understand frontend routing
- [ ] Review tech stack choices
- [ ] Prepare deployment considerations
- [ ] Have demo ready and tested
- [ ] Know codebase structure

---

**Good luck with your viva! Remember to stay calm, think before answering, and explain your reasoning clearly.** 🎓
