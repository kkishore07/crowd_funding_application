# Viva Q&A - Frequently Asked Questions

## LEVEL 1: FOUNDATIONAL QUESTIONS

### Q: Tell us about your project in 2-3 sentences.
**A:** 
It's a CrowdFunding platform built with MERN stack that enables creators to launch fundraising campaigns and users to contribute funds. The platform includes role-based access control for users, creators, and admins, along with features like campaign approval workflows, fraud detection, donations with ratings, and refund mechanisms.

---

### Q: What problem does your application solve?
**A:** 
The application provides a centralized platform for crowdfunding with built-in governance. It solves the problem of:
- Managing campaigns safely with admin approval process
- Detecting and preventing fraudulent donations
- Allowing donors to rate and evaluate campaigns
- Providing creators with analytics
- Managing refunds transparently

---

### Q: What are the three user roles?
**A:** 
1. **User/Donor**: Can browse campaigns, make donations, rate campaigns, request refunds
2. **Creator**: Can create campaigns, edit their campaigns, view analytics
3. **Admin**: Can approve/reject campaigns, process refunds, view suspicious donations, manage platform

---

### Q: What is the tech stack?
**A:**
- **Frontend**: React 18 + TypeScript, Vite build tool, TailwindCSS styling, ShadCN UI components
- **Backend**: Node.js + Express 5.x
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs for password hashing
- **File Upload**: Multer for campaign images

---

### Q: Why did you choose MongoDB?
**A:**
MongoDB was chosen because:
1. **Flexible schema** - Great for rapid development and schema evolution
2. **JSON-like documents** - Naturally matches JavaScript objects
3. **Scalability** - Horizontal scaling with sharding
4. **Good for reads** - This app is read-heavy (viewing campaigns, donations)
5. **Less rigid** than SQL for a growing startup MVP

---

### Q: How does authentication work?
**A:**
1. User registers with email and password
2. Password is hashed using bcryptjs (10 salt rounds)
3. User logs in with credentials
4. Backend verifies password, generates JWT token
5. Frontend stores token in localStorage
6. All subsequent API requests include token in Authorization header: `Bearer <token>`
7. Backend middleware verifies token before allowing access

---

### Q: What's stored in the JWT token?
**A:**
The JWT token contains the user's:
- `id` (MongoDB ObjectId)
- `email`
- `role` (user, creator, or admin)

**Plus**: Expiry time (1 hour) and signature for verification

---

### Q: Why JWT over traditional sessions?
**A:**
JWT advantages:
1. **Stateless** - No need to store sessions on server
2. **Scalable** - Works across multiple servers without shared session store
3. **Mobile-friendly** - Works with native apps
4. **Self-contained** - Token carries all necessary info
5. **Less database queries** - No session lookups needed

---

### Q: How are passwords secured?
**A:**
1. Passwords are never stored in plain text
2. When registering, password is hashed using bcryptjs with 10 salt rounds
3. During login, the entered password is hashed and compared with stored hash
4. bcryptjs makes brute-force attacks computationally expensive
5. Even if database is breached, passwords remain protected

---

### Q: What are campaign statuses?
**A:**
- **pending**: Awaiting admin approval, cannot receive donations
- **approved**: Approved by admin, active and can receive donations
- **rejected**: Rejected by admin, not visible to users
- **closed**: Campaign expired or target amount reached, no new donations

---

### Q: How does the donation process work?
**A:**
1. User selects campaign and enters amount
2. Backend validates:
   - Campaign is approved
   - Target not already reached
   - Donation doesn't exceed remaining amount
   - Campaign not expired
   - Fraud checks
3. If valid, creates Donation record (unless flagged)
4. If not suspicious, adds amount to campaign.currentAmount
5. Returns success or flag status

---

### Q: What happens if a donation is flagged as suspicious?
**A:**
Suspicious donations:
1. Are created and stored in database
2. Are NOT added to campaign's currentAmount
3. Appear in admin's "Suspicious Donations" dashboard
4. Admin can review and approve/reject them
5. If approved, amount is added to campaign retroactively

---

### Q: What triggers fraud detection?
**A:**
Donations are flagged if:
1. **Duplicate**: Same donor donates to same campaign within 1 minute
2. **Unusual amount**: Donation exceeds ₹1,000,000
3. **Rapid donations**: User makes 5+ donations within 1 hour

---

### Q: How does the refund system work?
**A:**
1. User requests refund (within 7-day window from donation)
2. System stores refundStatus as "requested" with reason
3. Admin sees it in "Refund Requests" dashboard
4. Admin can approve or reject
5. If approved:
   - Donation marked as "refunded"
   - Amount deducted from campaign
6. Cannot refund if donation older than 7 days

---

### Q: How does the rating system work?
**A:**
1. After donating, user can rate campaign (1-5 stars)
2. Rating stored in campaign's `ratings` array
3. Each rating object contains: user ID, rating value, timestamp
4. `averageRating` = sum of all ratings / totalRatings
5. Frontend displays average rating on campaign cards

---

---

## LEVEL 2: DESIGN & ARCHITECTURE QUESTIONS

### Q: Explain the database schema relationships.
**A:**
- **User-Campaign**: One-to-Many (one creator has many campaigns)
  - Campaign stores creator ObjectId as reference
- **User-Donation**: One-to-Many (one donor makes many donations)
  - Donation stores donor ObjectId as reference
- **Campaign-Donation**: One-to-Many (one campaign receives many donations)
  - Donation stores campaign ObjectId as reference
- **Campaign-Rating**: One-to-Many (one campaign has many ratings)
  - Ratings embedded in campaign document as array

Using references instead of embedding prevents data duplication and makes updates easier.

---

### Q: Why did you use references instead of embedding user data in campaigns?
**A:**
1. **Avoid duplication**: User name appears only once, not duplicated in every campaign
2. **Single source of truth**: If user name changes, reflected everywhere automatically
3. **Flexibility**: Can fetch user details separately if needed
4. **Consistency**: Easier to maintain referential integrity
5. **Size**: Documents stay smaller, faster to query

---

### Q: What's the difference between campaign and donation collections?
**A:**
**Campaign**:
- Stores fundraising goal details
- Tracks progress (targetAmount vs currentAmount)
- Contains approval workflow
- Has status and expiry tracking
- Stores ratings

**Donation**:
- Records individual contributions
- Tracks payment and refund status
- Stores fraud detection flags
- Records transaction details

---

### Q: How do you handle concurrent donations to same campaign?
**A:**
Current implementation:
- Database handles concurrent writes
- Each donation increments campaign.currentAmount

For production:
- Implement MongoDB transactions
- Use optimistic locking with version numbers
- Atomic operations with `findByIdAndUpdate`

---

### Q: Explain the middleware authentication flow.
**A:**
```
1. Request arrives with Authorization: Bearer <token>
2. verifyToken() middleware extracts token
3. Verifies JWT signature using JWT_SECRET
4. If valid, decodes token → extracts user info
5. Sets req.user object with id, email, role
6. Calls next() to pass to route handler
7. Role-specific middleware (verifyTokenAndAdmin) checks role
8. If unauthorized, returns 403 Forbidden
9. If authorized, proceeds to controller
```

---

### Q: Why does admin approval process exist?
**A:**
1. **Quality control**: Prevents spam/inappropriate campaigns
2. **Legal compliance**: Verify campaigns comply with regulations
3. **Fraud prevention**: Catch suspicious campaigns before they're funded
4. **Platform trust**: Users trust that campaigns are vetted
5. **Flexibility**: Admins can provide rejection reasons for improvement

---

### Q: How would you optimize the database?
**A:**
1. **Indexes**: Add indexes on frequently queried fields:
   - User.email (already unique)
   - Campaign.creator
   - Campaign.status
   - Donation.donor
   - Donation.campaign
2. **Pagination**: Limit results returned (e.g., 20 campaigns per page)
3. **Aggregation**: For analytics, use MongoDB aggregation pipeline
4. **Caching**: Cache popular campaigns in Redis
5. **Denormalization**: Store creator name in campaign (already done for speed)

---

### Q: What's the frontend architecture?
**A:**
1. **React Context**: GlobalContext manages auth state
2. **LocalStorage**: Persists token and user across refreshes
3. **React Query**: Manages server state and API caching
4. **React Router**: Handles routing between pages
5. **Protected Routes**: Wrapper component checks role before rendering
6. **Component hierarchy**: Pages → Components → UI elements

---

### Q: Explain the Protected Route component.
**A:**
```
ProtectedRoute checks:
1. Is user logged in? (check token)
2. Does user have allowed role? (check role in props)
3. If yes → Render component
4. If no → Redirect to login or 403 page
```

---

### Q: How is frontend state managed?
**A:**
1. **Auth state**: GlobalContext (user, token, isLoggedIn)
2. **Server state**: React Query (campaigns, donations, etc.)
3. **Component state**: useState for form inputs, UI toggles
4. **Local storage**: Persists token and user info

---

---

## LEVEL 3: IMPLEMENTATION DETAILS

### Q: What's the donation validation logic?
**A:**
Before creating donation, check:
```
1. Campaign exists
2. Campaign.status === "approved"
3. Campaign.currentAmount < Campaign.targetAmount
4. Donation amount <= (targetAmount - currentAmount)
5. Campaign not expired (endDate > now)
6. Fraud checks pass OR flag for review
7. User is authenticated
```

---

### Q: How do you prevent over-funding?
**A:**
Two checks:
1. Before donation: Verify amount doesn't exceed remaining capacity
2. Validation: `if (currentAmount + amount > targetAmount) reject`

Also: Once target is reached, campaign status changes to "closed"

---

### Q: How does the creator analytics work?
**A:**
Shows creator:
1. Total campaigns created
2. Total funds raised across all campaigns
3. Average funds per campaign
4. Number of active vs closed campaigns
5. Number of donations per campaign
6. Rating distribution

Calculated by aggregating donations for creator's campaigns.

---

### Q: What happens when campaign expires?
**A:**
1. Campaign has `checkExpired()` method
2. Checks if `new Date() > endDate`
3. If true, sets `isExpired = true`
4. When user tries to donate → check fails → donation rejected
5. Frontend can show "Campaign Expired" message

---

### Q: How do you ensure data consistency in refunds?
**A:**
1. Check donation exists and belongs to user
2. Check refundStatus is "none" (no previous request)
3. Check within 7-day window
4. Update donation to "requested"
5. Admin approves → update to "completed"
6. Atomically update campaign amount when refund processed

---

### Q: Explain error handling approach.
**A:**
1. Backend wraps operations in try-catch
2. Returns appropriate HTTP status codes:
   - 200: Success
   - 201: Created
   - 400: Bad request (validation error)
   - 401: Unauthorized (auth failed)
   - 403: Forbidden (no permission)
   - 404: Not found
   - 500: Server error
3. Returns error message in JSON response
4. Frontend displays error to user via toast notifications

---

### Q: What file upload implementation did you use?
**A:**
Used Multer middleware:
1. Frontend sends FormData with file
2. Multer intercepts upload
3. Saves file to `/uploads` directory
4. Returns filename
5. Backend stores filename in campaign.image
6. Frontend accesses via `/uploads/:filename` endpoint

---

### Q: How do you prevent unauthorized access to other user's data?
**A:**
1. Donation queries filtered by `donor === req.user.id`
2. Campaign updates check creator matches `req.user.id`
3. Refund processing verified donation belongs to user
4. Admin actions require `role === "admin"`
5. All protected routes include middleware checks

---

### Q: What's the difference between verifyTokenAndAuthorization and verifyTokenAndAdmin?
**A:**
- **verifyTokenAndAuthorization**: Allows if user owns resource OR is admin
  - Use for: Editing own campaigns, viewing own donations
- **verifyTokenAndAdmin**: Only allows admin
  - Use for: Campaign approval, all user management, suspicious donation review

---

### Q: How would you handle if creator deletes campaign with active donations?
**A:**
Current: Donations remain in DB, reference deleted campaign
Better approach:
1. Prevent deletion if campaign has donations
2. Mark campaign as "archived" instead of deleting
3. Set up cascade delete (advanced MongoDB)
4. Frontend gracefully handles null campaign references

---

### Q: What happens in simultaneous requests?
**A:**
**Race condition example**: Two users donate simultaneously to campaign with ₹100 remaining
1. Both requests see currentAmount = ₹80
2. Both think they can donate ₹100
3. Result: currentAmount becomes ₹280 (over target)

**Solution**:
- Use MongoDB atomic operations: `findByIdAndUpdate`
- Implement optimistic locking with version numbers
- Use transactions (MongoDB 4.0+)

---

### Q: How do you validate email uniqueness?
**A:**
1. Define email field as unique in schema: `email: { unique: true }`
2. During registration, check if email exists
3. MongoDB enforces uniqueness, prevents duplicates
4. Returns 409 Conflict if duplicate email

---

### Q: Explain the token expiry strategy.
**A:**
- JWT expires in 1 hour
- User must login again after expiry
- Could implement refresh tokens for better UX
- On frontend, check token expiry before making requests
- Redirect to login if token expired

---

### Q: How do you handle file upload errors?
**A:**
1. Multer validates file type/size
2. If error, returns 400 with error message
3. Frontend displays to user
4. User can retry upload
5. Actual validation happens on backend

---

---

## LEVEL 4: ADVANCED & CRITICAL THINKING

### Q: What security vulnerabilities exist and how would you fix them?

**A:**
1. **NoSQL Injection**: Sanitize all inputs
   - Fix: Use Mongoose validation, sanitize strings

2. **XSS (Cross-Site Scripting)**: User can inject scripts
   - Fix: React auto-escapes, but validate markdown, use DOMPurify

3. **CSRF (Cross-Site Request Forgery)**: Forged requests
   - Fix: Implement CSRF tokens, SameSite cookies

4. **Weak Passwords**: No password strength requirements
   - Fix: Enforce minimum length, complexity

5. **Exposed Secrets**: JWT_SECRET in code
   - Fix: Use .env files, never commit secrets

6. **Rate Limiting**: No protection against brute force
   - Fix: Add rate limiter middleware

7. **Missing HTTPS**: Data sent in plain text
   - Fix: Deploy with HTTPS, use secure cookies

---

### Q: How would you scale this to 1 million users?

**A:**
**Database**:
- MongoDB replication (replica sets)
- Sharding by campaign ID or user ID
- Read replicas for analytics queries

**Backend**:
- Load balancing (nginx, AWS ELB)
- Horizontal scaling (multiple server instances)
- Caching layer (Redis for popular campaigns)
- CDN for static files

**Frontend**:
- Code splitting
- Image optimization
- Lazy loading components
- CDN delivery

**General**:
- Database indexing optimization
- Query optimization
- Microservices architecture (split into smaller services)
- Message queues for async operations
- Monitoring and logging (ELK, DataDog)

---

### Q: What would you add to make this production-ready?

**A:**
1. **Email verification**: Confirm email during registration
2. **Real payment gateway**: Integrate Stripe/Razorpay instead of mock
3. **Notifications**: Email when campaign approved, donation received
4. **Logging**: Comprehensive logging with timestamps
5. **Monitoring**: Track errors, performance metrics
6. **Analytics**: Campaign performance tracking
7. **User profiles**: More detailed user information
8. **Search**: Full-text search for campaigns
9. **Categories**: Filter campaigns by type
10. **Social features**: Follow creators, share campaigns
11. **Two-factor authentication**: Enhance security
12. **Admin audit log**: Track all admin actions
13. **API documentation**: Swagger/OpenAPI
14. **Unit tests**: Comprehensive test coverage
15. **Deployment**: CI/CD pipeline with automated testing

---

### Q: How would you debug a donation that didn't update campaign amount?

**A:**
Checklist:
1. Is campaign status "approved"? (Check DB)
2. Is donation marked suspicious? (Check isSuspicious field)
3. Did donation amount exceed remaining? (Check amounts)
4. Is campaign expired? (Check endDate)
5. Did database save the update? (Check campaign.currentAmount after update)
6. Is the frontend fetching latest data? (Check React Query cache)

If still unclear:
- Add logging to controller
- Check MongoDB operation logs
- Verify Mongoose save operation completed
- Check frontend is refreshing after donation

---

### Q: What's wrong with the current fraud detection approach?

**A:**
Current limitations:
1. **False positives**: Legitimate large donations flagged
2. **No user context**: Can't distinguish genuine users from fraudsters
3. **Hardcoded thresholds**: ₹1M might be arbitrary
4. **Simple checks**: Doesn't consider user history
5. **No feedback loop**: Doesn't learn from admin decisions

Better approach:
- ML-based detection (analyze patterns)
- User reputation scoring
- Device fingerprinting
- Geographic checks
- IP reputation database
- Admin feedback training

---

### Q: How would you implement real-time notifications?

**A:**
Using WebSockets (Socket.io):
1. When donation received → Notify creator in real-time
2. When campaign approved → Notify creator
3. When refund processed → Notify donor

Implementation:
```
1. Add Socket.io to backend
2. Frontend connects to socket
3. On donation event → Emit to creator's socket
4. Creator receives in real-time (no page refresh needed)
5. Can show toast notification
```

---

### Q: What's the impact of allowing anyone to create campaigns?

**A:**
Risks:
1. Spam campaigns (no value)
2. Fraudulent campaigns (steal money)
3. Platform credibility damage
4. Legal liability
5. Storage bloat

Solution: **Admin approval process** (already implemented)
- Slows down honest creators
- But protects ecosystem
- Better UX: Auto-approve after reputation built

---

### Q: How would you handle campaign disputes?

**A:**
Add dispute system:
1. User can report campaign/donation
2. Store dispute details: reporter, reason, evidence
3. Admin reviews disputes
4. Admin can:
   - Close dispute (dismiss)
   - Refund donors (if scam detected)
   - Ban campaign creator
   - Take legal action

---

### Q: What's the issue with storing passwords in database?

**A:**
Never store plain passwords:
1. If DB breached, passwords exposed
2. Users reuse passwords across services
3. Attacker can access other accounts
4. Violates security best practices

Solution: Hash passwords (already done)
1. Hash before storing
2. Never retrieve plain password
3. Compare hashes during login
4. Even admins can't see passwords

---

### Q: How would you implement campaign tiers/rewards?

**A:**
Add to Campaign schema:
```
rewards: [{
  tier: "bronze",
  amount: 500,
  description: "Digital thank you",
  limit: 100,
  claimed: 45
}]
```

When donation made:
1. Check which reward tier matches
2. Associate reward with donation
3. Create fulfillment tracking
4. Creator can mark reward as fulfilled

---

### Q: What happens if admin account is compromised?

**A:**
Current risks:
- Can approve/reject any campaign
- Can process refunds
- Can see all user data
- Can modify donations

Mitigation:
1. Two-factor authentication
2. Audit logging (all admin actions)
3. Multiple admins for critical actions
4. IP whitelist for admin access
5. Role-based sub-permissions
6. Require additional approval for big actions

---

### Q: How would you handle timezone issues?

**A:**
Current approach:
- Store all dates in UTC in DB
- Frontend converts to user's timezone for display
- When user sets campaign end date, convert to UTC before storing

Implementation:
```
Frontend: 
  let utcDate = new Date(userDate).toISOString()
  
Backend:
  Store as UTC ISO string
  
Display:
  Convert back using user's timezone (Intl API or date-fns)
```

---

---

## BONUS: TRADE-OFF DECISIONS

### Q: REST API vs GraphQL?
**A:**
We chose **REST** because:
- Simpler to implement and understand
- Sufficient for current scope
- Easier to cache
- Better HTTP semantics

Would consider GraphQL if:
- Complex, nested data queries
- Need fine-grained data fetching
- Multiple client types with different needs

---

### Q: Mongoose vs Raw MongoDB Driver?
**A:**
We chose **Mongoose** because:
- Automatic schema validation
- Built-in middleware hooks
- Relationship management
- Better error handling

---

### Q: TailwindCSS vs Bootstrap?
**A:**
We chose **TailwindCSS** with ShadCN because:
- Smaller bundle size
- More customizable
- Better for component libraries
- Modern utility-first approach
- Can create unique designs easily

---

### Q: Vite vs Create React App?
**A:**
We chose **Vite** because:
- Faster build times
- Faster HMR (Hot Module Replacement)
- Smaller bundle size
- Better development experience
- Modern tooling

---

### Q: JWT vs OAuth?
**A:**
We chose **JWT** because:
- Simpler implementation for MVP
- No third-party dependency
- Works offline

Could add **OAuth** for:
- Google/GitHub login
- Social authentication
- Better UX for users

---

---

## CLOSING TIPS

1. **Know your "why"**: Every decision has a reason
2. **Be honest**: Don't claim features not implemented
3. **Show thinking**: "I would approach X by..."
4. **Think bigger**: How would you scale/improve?
5. **Security mindset**: Always mention security
6. **User perspective**: How does user experience benefit?

---

**Remember**: The goal is not to know everything, but to show you understand the project deeply and can think critically about it! 🎓
