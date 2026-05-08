# Viva Preparation Checklist & Timeline

## 📅 PREPARATION TIMELINE

### Week 1: Foundation (Days 1-7)
- [ ] Read VIVA_PREPARATION_GUIDE.md completely
- [ ] Review database schemas (User, Campaign, Donation)
- [ ] Understand authentication flow (Registration → Login → JWT)
- [ ] List all API endpoints and what they do
- [ ] Understand role-based access control
- [ ] Draw architecture diagram on paper
- [ ] Familiarize with project file structure

**Daily Goal**: 1-2 hours

---

### Week 2: Deep Dive (Days 8-14)
- [ ] Study each backend route implementation
- [ ] Review controller logic for each endpoint
- [ ] Understand fraud detection algorithm
- [ ] Study middleware implementation
- [ ] Review frontend components and pages
- [ ] Understand state management (GlobalContext, React Query)
- [ ] Practice explaining campaign lifecycle
- [ ] Practice explaining donation flow

**Daily Goal**: 1-2 hours

---

### Week 3: Advanced Concepts (Days 15-21)
- [ ] Study database optimization techniques
- [ ] Understand security considerations
- [ ] Review error handling strategy
- [ ] Learn scalability considerations
- [ ] Study concurrent operations handling
- [ ] Review frontend routing and protected routes
- [ ] Understand file upload process
- [ ] Practice explaining to someone else

**Daily Goal**: 1.5-2 hours

---

### Days Before Viva: Polish (Days 22-28)
- [ ] Review QUICK_REFERENCE.md daily
- [ ] Answer all questions in VIVA_QNA.md
- [ ] Record yourself explaining project
- [ ] Practice demo walkthrough multiple times
- [ ] Review common follow-up questions
- [ ] Ensure all features work correctly
- [ ] Test all role-based scenarios
- [ ] Get good sleep the night before!

**Daily Goal**: 2-3 hours

---

## ✅ KNOWLEDGE CHECKLIST

### Understanding Your Code

#### Backend - Routes & Controllers
- [ ] Auth Routes (register, login, getUsers)
- [ ] Campaign Routes (CRUD, approve, reject, rate)
- [ ] Donation Routes (create, getMyDonations, refund logic)
- [ ] Can explain what each endpoint does
- [ ] Know the purpose of each route parameter

#### Backend - Middleware
- [ ] How verifyToken works
- [ ] Difference between verifyTokenAndAdmin vs verifyTokenAndCreator
- [ ] How role-based access is enforced
- [ ] Why middleware is important
- [ ] Order of middleware matters

#### Backend - Models
- [ ] User schema fields and types
- [ ] Campaign schema with relationships
- [ ] Donation schema with all fields
- [ ] Why certain fields are required
- [ ] Purpose of timestamps and status fields

#### Backend - Business Logic
- [ ] Donation validation rules
- [ ] Fraud detection conditions
- [ ] Campaign expiry check
- [ ] Refund window (7 days)
- [ ] Rating calculation logic

#### Frontend - Pages
- [ ] What each page does
- [ ] Which pages require authentication
- [ ] Role-based page access
- [ ] Main components on each page

#### Frontend - Components
- [ ] ProtectedRoute implementation
- [ ] Form components
- [ ] Display components
- [ ] UI component hierarchy

#### Frontend - Context & State
- [ ] How GlobalContext manages auth
- [ ] localStorage persistence strategy
- [ ] How token is used in API calls
- [ ] React Query usage

#### Frontend - API
- [ ] How API utility constructs requests
- [ ] How token is included in headers
- [ ] How errors are handled
- [ ] Type definitions for API responses

---

### Technical Concepts

#### Authentication & Security
- [ ] JWT structure and claims
- [ ] Token expiry mechanism
- [ ] Password hashing with bcryptjs
- [ ] Why tokens are stored in localStorage
- [ ] Authorization vs Authentication
- [ ] Why HTTPS is needed

#### Database Design
- [ ] Relationship types (1-1, 1-many, many-many)
- [ ] Why references are used instead of embedding
- [ ] Document size considerations
- [ ] Indexing for performance
- [ ] Query optimization

#### API Design
- [ ] RESTful principles
- [ ] HTTP methods (GET, POST, PUT, DELETE)
- [ ] Status codes (200, 201, 400, 401, 403, 404, 500)
- [ ] Request/Response format
- [ ] Error handling

#### Frontend Architecture
- [ ] Component composition
- [ ] State management patterns
- [ ] Routing strategies
- [ ] Protected route implementation
- [ ] Form handling

---

### Important Flows

#### User Registration & Login
- [ ] Step-by-step process
- [ ] How password is hashed
- [ ] How token is generated
- [ ] How frontend stores credentials
- [ ] How subsequent requests include token

#### Campaign Creation
- [ ] Creator initiates campaign
- [ ] How data flows to backend
- [ ] Where it's stored
- [ ] Initial status ("pending")
- [ ] How admin approves

#### Donation Process
- [ ] User selects campaign
- [ ] Enters amount
- [ ] Validation checks
- [ ] Fraud detection
- [ ] Amount update to campaign
- [ ] Response to user

#### Refund Request
- [ ] User initiates refund
- [ ] 7-day window check
- [ ] Admin review process
- [ ] Amount deduction
- [ ] Notification to user

---

### Problem-Solving

#### Performance
- [ ] Database indexing opportunities
- [ ] Query optimization
- [ ] Caching strategies
- [ ] Frontend performance
- [ ] Bundle size optimization

#### Security
- [ ] Common vulnerabilities (XSS, CSRF, SQL Injection)
- [ ] Password security
- [ ] Token security
- [ ] CORS configuration
- [ ] Input validation

#### Scalability
- [ ] Database scaling (replication, sharding)
- [ ] Backend scaling (load balancing)
- [ ] Caching layers
- [ ] CDN usage
- [ ] Microservices consideration

#### Debugging
- [ ] How to trace issues
- [ ] Where to check logs
- [ ] Common error patterns
- [ ] Testing approaches

---

## 🎯 PRACTICE SCENARIOS

### Scenario 1: Campaign Approval Flow
**Setup**: You're an admin reviewing pending campaigns
- [ ] Understand what you're looking at
- [ ] Explain approval decision criteria
- [ ] Walk through backend process
- [ ] Explain frontend update
- [ ] Discuss notification strategy

### Scenario 2: Fraud Detection Triggers
**Setup**: High donation from new user
- [ ] Identify which rules trigger
- [ ] Explain why flagged
- [ ] Walk through flagging process
- [ ] Discuss admin review process
- [ ] Explain user communication

### Scenario 3: Refund Request
**Setup**: User wants refund after 8 days
- [ ] Explain why request rejected
- [ ] Show validation logic
- [ ] Discuss alternative solutions
- [ ] Walk through code path
- [ ] Explain error message

### Scenario 4: Multiple Donations to Same Campaign
**Setup**: Campaign target almost reached, 2 donations come simultaneously
- [ ] Identify potential race condition
- [ ] Explain current behavior
- [ ] Discuss issues
- [ ] Propose solutions
- [ ] Implement safeguards

### Scenario 5: Admin Account Compromised
**Setup**: Admin account credentials leaked
- [ ] List potential damage
- [ ] Explain current lack of protections
- [ ] Propose security measures
- [ ] Discuss audit logging
- [ ] Plan incident response

---

## 💪 CONFIDENCE BUILDERS

### Must Know Cold (No Hesitation)
- [ ] Project name and purpose
- [ ] Three roles (User, Creator, Admin)
- [ ] Tech stack
- [ ] Main features (5-7 key ones)
- [ ] Database models (3 collections)
- [ ] Authentication method (JWT)
- [ ] Key endpoints (3-5 most important)
- [ ] How donations work
- [ ] How campaigns are approved
- [ ] What fraud detection does

### Should Know Well (Minor Hesitation OK)
- [ ] All API endpoints
- [ ] Database schema details
- [ ] Middleware implementations
- [ ] Frontend component structure
- [ ] State management approach
- [ ] File upload process
- [ ] Error handling strategy
- [ ] Refund logic
- [ ] Rating system

### Good to Know (Research if Asked)
- [ ] Deployment strategy
- [ ] Advanced optimization
- [ ] Scaling architecture
- [ ] Security vulnerabilities
- [ ] Performance tuning
- [ ] Load testing approach
- [ ] Monitoring strategy

### Don't Need to Know (Out of Scope)
- [ ] Deployment platforms details
- [ ] Specific DevOps tools
- [ ] Advanced ML algorithms
- [ ] Unrelated frameworks

---

## 🧪 DEMO PREPARATION

### Pre-Demo Checklist
- [ ] Backend server is running on port 3000
- [ ] MongoDB is connected and has test data
- [ ] Frontend is running on port 5173
- [ ] Accounts exist for each role (user, creator, admin)
- [ ] Campaigns exist (pending, approved, rejected)
- [ ] Donations exist
- [ ] Network is stable
- [ ] Screen sharing works (if online)
- [ ] Browser zoom is readable (100%)
- [ ] No sensitive data visible

### Demo Script (Timed)

**Part 1: Home Page (1 min)**
- Show landing page
- Explain navigation
- Show login/register option

**Part 2: Registration & Login (2 min)**
- Register as creator
- Show form validation
- Login successfully
- Explain token storage

**Part 3: Creator Dashboard (2 min)**
- Show creator options
- Explain features available
- Navigate to create campaign

**Part 4: Create Campaign (2 min)**
- Fill campaign form
- Upload image
- Show validation
- Submit → Campaign created with "pending" status

**Part 5: Admin Approval (1 min)**
- Switch to admin account
- Navigate to approval dashboard
- Show pending campaign
- Approve it → Status changes

**Part 6: Donation (2 min)**
- Switch to regular user account
- Browse campaigns
- See approved campaign
- Click donate
- Enter amount
- Submit → Successful

**Part 7: Rating (1 min)**
- Rate the campaign
- Show rating reflected

**Part 8: Refund (1 min)**
- Go to "My Donations"
- Request refund
- Show confirmation

**Total Time**: ~12 minutes (leaves buffer)

### Practice Questions During Demo
- Be prepared for interruptions
- Explain what you're doing as you do it
- Connect features to business logic
- Show understanding, not just clicking

---

## 📊 ASSESSMENT RUBRIC (What Examiners Look For)

### Technical Knowledge (40%)
- [ ] Understand architecture clearly
- [ ] Know database design rationale
- [ ] Explain API design choices
- [ ] Discuss security measures
- [ ] Can debug issues

### Code Understanding (30%)
- [ ] Can walk through code easily
- [ ] Explain why code written this way
- [ ] Know all major functions
- [ ] Understand edge cases
- [ ] Can suggest improvements

### Problem-Solving (20%)
- [ ] Think through scenarios
- [ ] Propose solutions
- [ ] Consider trade-offs
- [ ] Scale thinking
- [ ] Learn from feedback

### Communication (10%)
- [ ] Explain clearly
- [ ] Answer directly
- [ ] Ask for clarification if needed
- [ ] Stay confident
- [ ] Listen to hints

---

## 🎤 VIVA DAY TIPS

### Morning Of
- [ ] Get 8+ hours sleep
- [ ] Eat good breakfast
- [ ] Dress professionally
- [ ] Arrive early
- [ ] Take water bottle
- [ ] Bring notebook and pen

### During Viva
- [ ] Sit up straight, confident posture
- [ ] Make eye contact with examiners
- [ ] Take 2 seconds to think before answering
- [ ] Answer questions fully, not yes/no
- [ ] Admit if you don't know, then explain how you'd find out
- [ ] Use examples to support answers
- [ ] Ask "Can I clarify your question?" if unsure
- [ ] Talk about challenges and how you overcame them
- [ ] Show enthusiasm for your project
- [ ] Don't rush the demo
- [ ] Explain what you're doing during demo

### If You Get Stuck
- [ ] Stay calm
- [ ] Think out loud: "Let me think about this..."
- [ ] Ask to revisit the question later
- [ ] Try to break down the question
- [ ] Relate it to something you know
- [ ] Be honest: "I'm not sure, but I would..."

### Questions to Avoid Saying
- [ ] "I don't know" (Say "I'm not sure, but...")
- [ ] "Maybe" (Say "The reason is...")
- [ ] "Um..." "Uh..." (Take a pause instead)
- [ ] "That wasn't required" (Explain why you chose not to)

### Good Phrases to Use
- [ ] "The reason I chose... is because..."
- [ ] "An alternative approach would be..."
- [ ] "Looking at the code, you can see..."
- [ ] "If we scale to 1M users..."
- [ ] "To improve this, I would..."
- [ ] "That's a great question, let me explain..."

---

## 📋 FINAL DAY CHECKLIST

### Day Before Viva
- [ ] Review QUICK_REFERENCE.md one more time
- [ ] Do a full demo run-through
- [ ] Check all systems work (backend, frontend, DB)
- [ ] Prepare any demo accounts
- [ ] Print QUICK_REFERENCE.md if allowed
- [ ] Get good sleep
- [ ] Avoid cramming new concepts

### Morning Of Viva
- [ ] Eat well
- [ ] Hydrate
- [ ] Dress professionally
- [ ] Arrive early
- [ ] Take deep breaths
- [ ] Review key points (not intensive, just refresh)
- [ ] Positive mindset
- [ ] Remember: You built this, you know it!

### During Viva
- [ ] Stay calm
- [ ] Think before answering
- [ ] Be honest
- [ ] Show understanding
- [ ] Connect concepts
- [ ] Demonstrate enthusiasm
- [ ] Listen carefully

---

## 🎓 SUCCESS SIGNALS

You're doing well if examiners:
- [ ] Ask deeper, follow-up questions (they're engaged)
- [ ] Take notes while you explain
- [ ] Nod in agreement
- [ ] Ask about improvements/scaling
- [ ] Ask about design decisions
- [ ] Seem satisfied with demo
- [ ] Ask for code walkthroughs
- [ ] Explore edge cases with you

Red flags (if noticed, don't panic):
- [ ] Silence after your answer
- [ ] Examiners looking at each other
- [ ] Repeated same question differently

**Don't overthink!** This is normal. Just answer confidently.

---

## 🚀 BONUS: THINGS TO MENTION (Impress Them)

### Pro Tips in Answers
1. "I considered X but chose Y because..."
2. "For scalability, I would..."
3. "Security-wise, we should..."
4. "This could be optimized by..."
5. "If I had more time, I would add..."

### Smart Security Mentions
- Password hashing with bcryptjs
- JWT token security
- Role-based access control
- Input validation
- HTTPS importance
- Rate limiting

### Smart Scalability Mentions
- Database indexing
- MongoDB sharding
- Load balancing
- Redis caching
- CDN for static assets
- Microservices consideration

### Smart Performance Mentions
- Code splitting in React
- Lazy loading
- Query optimization
- Connection pooling
- Aggregation pipelines

---

## ⏰ STUDY TIME ESTIMATE

- **Weeks 1-3**: 10-14 hours total (foundation)
- **Final week**: 14-21 hours total (polish)
- **Total**: 24-35 hours recommended

Breakdown:
- Understanding code: 8-10 hours
- Learning concepts: 6-8 hours
- Practice explaining: 5-7 hours
- Demo preparation: 3-5 hours
- Q&A practice: 2-5 hours

---

## 📝 NOTES

**This preparation is comprehensive. You don't need to memorize everything.**

Focus on:
1. Understanding (not memorizing)
2. Being able to explain (not reciting)
3. Connecting concepts (not isolated facts)
4. Thinking about improvements (not defending current state)

Remember: Examiners want to see:
- You understand your project
- You can think critically
- You can explain clearly
- You can solve problems
- You can scale thinking

**You've got this!** 🎉

Good luck with your viva! 🎓

---

**Last Updated**: May 8, 2026
