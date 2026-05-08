# CrowdFunding App - Quick Reference Guide

## 🔑 KEY ENDPOINTS QUICK REFERENCE

### Auth
```
POST   /auth/register         → Register new user
POST   /auth/login            → Login (returns JWT + user)
GET    /auth/users            → Get all users [ADMIN]
```

### Campaign
```
GET    /campaign              → List all campaigns
POST   /campaign              → Create campaign [CREATOR]
GET    /campaign/:id          → Get single campaign
PUT    /campaign/:id          → Update campaign [CREATOR]
DELETE /campaign/:id          → Delete campaign [CREATOR]
PUT    /campaign/:id/approve  → Approve [ADMIN]
PUT    /campaign/:id/reject   → Reject [ADMIN]
POST   /campaign/:id/rate     → Rate campaign [AUTH]
GET    /campaign/creator/my-campaigns → My campaigns [CREATOR]
GET    /campaign/creator/analytics    → Analytics [CREATOR]
```

### Donation
```
POST   /donation                    → Create donation [AUTH]
GET    /donation/my-donations       → My donations [AUTH]
GET    /donation/suspicious         → Suspicious donations [ADMIN]
POST   /donation/request-refund     → Request refund [AUTH]
POST   /donation/process-refund     → Process refund [ADMIN]
GET    /donation/analytics          → Analytics [ADMIN]
```

---

## 🗝️ AUTHENTICATION DETAILS

**Token**: JWT containing `{id, email, role}`  
**Expiry**: 1 hour  
**Header**: `Authorization: Bearer <token>`  
**Storage**: localStorage (`cf_token`, `cf_user`)  

**Roles**:
- `user` - Regular donor
- `creator` - Can create campaigns
- `admin` - Full platform access

---

## 📊 CAMPAIGN STATUSES

| Status | Meaning | Can Receive Donations? |
|--------|---------|------------------------|
| `pending` | Waiting admin approval | ❌ No |
| `approved` | Ready for donations | ✅ Yes |
| `rejected` | Admin rejected | ❌ No |
| `closed` | Expired or target reached | ❌ No |

---

## 💰 DONATION STATUSES & REFUND STATUSES

### Payment Status
- `pending` - Waiting payment
- `processing` - Payment in progress
- `completed` - Donation successful
- `failed` - Payment failed
- `refunded` - Refund processed

### Refund Status
- `none` - No refund request
- `requested` - Refund requested by user
- `processing` - Admin reviewing
- `completed` - Refund processed
- `rejected` - Admin rejected refund

---

## 🚨 FRAUD DETECTION RULES

| Flag | Condition |
|------|-----------|
| Duplicate | Same donor → Same campaign → Within 1 minute |
| High Amount | Donation > ₹1,000,000 |
| Rapid Donations | 5+ donations by user within 1 hour |

**Impact**: Flagged donations are NOT added to campaign until admin approves

---

## 🔐 MIDDLEWARE FUNCTIONS

| Middleware | Purpose | Checks |
|-----------|---------|--------|
| `verifyToken` | Basic auth | Token exists & valid |
| `verifyTokenAndAdmin` | Admin only | Token + role === admin |
| `verifyTokenAndCreator` | Creator only | Token + role === creator |
| `verifyTokenAndAuthorization` | Own data or admin | User owns resource or admin |
| `verifyRole(...roles)` | Custom roles | Token + role in allowed list |

---

## 📦 TECH STACK

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| UI Components | ShadCN UI (Radix + TailwindCSS) |
| State Management | React Context + React Query |
| Backend | Node.js, Express 5.x |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| File Upload | Multer |
| Testing | Vitest, Playwright |

---

## 💾 SCHEMA FIELDS

### User
- `name`, `email`, `password` (hashed), `role`, `timestamps`

### Campaign
- `title`, `description`, `targetAmount`, `currentAmount`, `endDate`
- `creator` (ObjectId), `creatorName`, `status`, `image`
- `averageRating`, `totalRatings`, `ratings[]` (array with user + rating)

### Donation
- `donor`, `donorName`, `campaign`, `amount`
- `paymentStatus`, `paymentMethod`, `transactionId`
- `refundStatus`, `refundReason`, `refundedAt`
- `isSuspicious`, `suspiciousReason`, `createdAt`

---

## 🎯 ROLE PERMISSIONS MATRIX

| Action | User | Creator | Admin |
|--------|------|---------|-------|
| View campaigns | ✅ | ✅ | ✅ |
| Create campaign | ❌ | ✅ | ✅ |
| Edit own campaign | ❌ | ✅ | ❌ |
| Approve campaign | ❌ | ❌ | ✅ |
| Donate | ✅ | ✅ | ✅ |
| View own donations | ✅ | ✅ | ✅ |
| Request refund | ✅ | ✅ | ✅ |
| Process refund | ❌ | ❌ | ✅ |
| Rate campaign | ✅ | ✅ | ✅ |
| View suspicious donations | ❌ | ❌ | ✅ |

---

## 🔄 DATA FLOW EXAMPLES

### Donation Flow
```
User clicks "Donate" → 
  Frontend shows form →
    User enters amount →
      Frontend POSTs to /donation →
        Backend validates campaign (status, amount, expiry) →
        Backend checks fraud detection →
        Backend creates Donation record →
        If NOT suspicious: Add amount to campaign.currentAmount →
        Return response with donation + flag status
```

### Campaign Approval Flow
```
Creator submits campaign →
  Campaign status = "pending" →
    Admin views in approval dashboard →
      Admin clicks approve/reject →
        Backend updates status to "approved"/"rejected" →
          If approved: Campaign appears on platforms →
          Creator notified → Campaign can receive donations
```

### Refund Flow
```
User requests refund (within 7 days) →
  Donation.refundStatus = "requested" →
    Admin reviews in dashboard →
      Admin approves/rejects →
        If approved: Refund amount from campaign →
                     Mark donation as "refunded"
```

---

## 🛡️ SECURITY MEASURES

1. **Password Hashing**: bcryptjs with 10 salt rounds
2. **Authentication**: JWT tokens (1h expiry)
3. **Authorization**: Role-based middleware checks
4. **Input Validation**: Backend validates all inputs
5. **CORS**: Configured for allowed origins
6. **Fraud Detection**: Duplicate, high amount, rapid donation checks
7. **Refund Window**: 7-day limit on refund requests

---

## 📝 IMPORTANT CONCEPTS

### Why JWT?
- Stateless (no server session storage needed)
- Scalable (works across multiple servers)
- Works with SPA and mobile apps
- Self-contained (carries user info)

### Why MongoDB?
- Flexible schema (easy for rapid development)
- JSON-like documents (matches JavaScript objects)
- Good for read-heavy operations
- Horizontal scalability with sharding

### Why Role-Based Access?
- Separates concerns (user, creator, admin)
- Easier to manage permissions
- Scales with new roles

### Why Fraud Detection?
- Prevents abuse and exploitation
- Protects creators from fake donations
- Flags for manual review (not auto-reject)

---

## ⚡ PERFORMANCE CONSIDERATIONS

### Could Improve:
- Add MongoDB indexes on frequently queried fields
- Implement Redis caching for popular campaigns
- Pagination on large result sets
- Rate limiting on API endpoints
- Compression middleware (gzip)
- Database query optimization

### Frontend Optimization:
- Code splitting with React.lazy()
- Image optimization
- React Query caching
- Virtual scrolling for large lists

---

## 🐛 COMMON BUGS & FIXES

| Bug | Cause | Fix |
|-----|-------|-----|
| 401 Unauthorized | Missing/invalid token | Include token in Authorization header |
| Donation amount not updating | Flagged as suspicious | Admin must approve from dashboard |
| Campaign not appearing | Status not "approved" | Admin must approve campaign first |
| Password hash not working | bcrypt not comparing correctly | Use bcrypt.compare(), not === |
| 403 Forbidden | Wrong role | Check user role matches endpoint requirement |
| CORS error | Frontend URL not in allowed origins | Add frontend URL to CORS config |

---

## 💡 COMMON FOLLOW-UPS

**Q: Why not embed user in campaign?**  
A: Updates would be scattered across documents. References keep single source of truth.

**Q: What if admin rejects campaign?**  
A: Status = "rejected", campaign doesn't appear on platform, creator sees rejection reason.

**Q: Can creator modify campaign after approval?**  
A: Yes, they can edit it. Changes are reflected immediately (no re-approval needed).

**Q: What happens if campaign creator deletes account?**  
A: Campaigns remain but show creator no longer exists (handle gracefully in frontend).

**Q: How to prevent same user from rating twice?**  
A: Check if user ID exists in ratings array before allowing new rating.

---

## 📚 FILES TO KNOW

**Backend**:
- `server.js` - Entry point
- `config/db.js` - MongoDB connection
- `src/models/` - Mongoose schemas
- `src/routes/` - API endpoints
- `src/controller/` - Business logic
- `src/middleware/` - Auth, validation, upload

**Frontend**:
- `src/App.tsx` - Routes definition
- `src/context/GlobalContext.tsx` - Auth state
- `src/lib/api.ts` - API client
- `src/pages/` - Route components
- `src/components/` - Reusable components
- `vite.config.ts` - Vite configuration

---

## ✨ PRO TIPS FOR VIVA

1. **Know the flow**: Be able to trace data from UI to database
2. **Explain why**: Every design choice has a reason
3. **Think scalability**: Consider 1M users, 1M campaigns
4. **Security first**: Always mention security considerations
5. **Performance**: Can you optimize? How?
6. **Error handling**: What happens when things go wrong?
7. **User experience**: How would user feel using this?
8. **Be confident**: You built this, you know it best!

---

**Last Updated**: May 8, 2026
