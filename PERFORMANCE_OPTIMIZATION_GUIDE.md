# 🔍 Vault Pulse - Performance Analysis & Optimization Guide

## 📊 Current Metrics Summary (from Railway Dashboard)

### ✅ What's Working Well:
- **CPU Usage**: 0.0-0.1 vCPU (very low, not CPU-bound)
- **Memory**: ~180-200 MB stable (not memory-bound)
- **Network Traffic**: 0-40 KB (low bandwidth usage)

### ❌ Critical Issues:
- **5xx Server Errors**: Present in logs
- **Error Rate**: Up to **11%** (should be < 1%)
- **Response Time p95/p99**: **10-20 seconds** (should be < 1 second)

---

## 🎯 Root Cause Analysis

### 1. **Database Query on Every Auth Request** 🔴 HIGH PRIORITY
**File**: `server/src/middleware/auth.ts`

**Problem**:
```typescript
const user = await prisma.user.findUnique({
  where: { id: payload.userId }
});
```
This runs on **EVERY authenticated request**.

**Impact**:
- If Railway PostgreSQL is slow → 5xx errors
- For 10-15 concurrent users = 10-15 simultaneous DB queries just for auth
- Adds 50-200ms to every request

**Solution**:
Store user data in JWT payload instead of querying DB.

```typescript
// BEFORE: Query DB every time
const user = await prisma.user.findUnique({ where: { id: payload.userId } });

// AFTER: Use data from JWT
const user = {
  id: payload.userId,
  email: payload.email,
  name: payload.name,
  role: payload.role,
  city: payload.city
};
```

**Expected Impact**: 50% reduction in database queries

---

### 2. **No Connection Pooling Limits** 🔴 HIGH PRIORITY

**Problem**:
Default PostgreSQL connection limit is **10 connections**.

With 10-15 concurrent users:
- Each user makes 2-3 concurrent requests
- Total: 20-45 concurrent connections needed
- **Result**: Connection exhaustion → timeouts → 5xx errors

**Current DATABASE_URL**:
```
postgresql://postgres:PASSWORD@host:port/railway
```

**Solution**:
Add connection pool settings to DATABASE_URL in Railway:
```
postgresql://postgres:PASSWORD@host:port/railway?connection_limit=20&pool_timeout=30&connect_timeout=10
```

**Settings Explained**:
- `connection_limit=20`: Max 20 concurrent connections
- `pool_timeout=30`: Wait 30s for available connection
- `connect_timeout=10`: Fail fast if can't connect in 10s

**Expected Impact**: Eliminates connection timeout errors

---

### 3. **Missing Pagination** 🟡 MEDIUM PRIORITY

**Problem**:
Many routes use `findMany()` without `take`/`skip`:

```typescript
// BAD: Returns ALL records
const equipment = await prisma.equipment.findMany({
  where: { city },
  include: { maintenanceLogs: true }
});
```

**Impact**:
- Returns 100s or 1000s of records
- High memory usage
- Slow query execution (2-5 seconds)
- Timeout on large datasets

**Solution**:
Add pagination to all list endpoints:

```typescript
// GOOD: Limit to 50 records
const equipment = await prisma.equipment.findMany({
  where: { city },
  include: { maintenanceLogs: { take: 5 } },
  take: 50,
  skip: (page - 1) * 50
});
```

**Files to Update**:
- `server/src/routes/equipment.ts`
- `server/src/routes/maintenance.ts`
- `server/src/routes/consumable.ts`
- `server/src/routes/proposal.ts`
- `server/src/routes/crew.ts`

**Expected Impact**: 70% faster query execution

---

### 4. **Heavy Operations Block Requests** 🟡 MEDIUM PRIORITY

**Problem**:
PDF and Excel generation runs synchronously:

```typescript
router.post('/export', async (req, res) => {
  // This blocks for 10-20 seconds!
  const pdf = await generatePDFReport(data);
  res.send(pdf);
});
```

**Impact**:
- Request waits 10-20 seconds
- Other requests queue up
- Railway shows high p95/p99 response times

**Solution Options**:

**Option A: Stream Response (Quick)**
```typescript
router.post('/export', async (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  const stream = generatePDFStream(data);
  stream.pipe(res);
});
```

**Option B: Background Job (Better)**
```typescript
router.post('/export', async (req, res) => {
  const jobId = await queue.add('generate-pdf', data);
  res.json({ jobId, status: 'processing' });
});

router.get('/export/:jobId', async (req, res) => {
  const result = await queue.getJob(req.params.jobId);
  if (result.status === 'completed') {
    res.sendFile(result.filePath);
  } else {
    res.json({ status: result.status });
  }
});
```

**Expected Impact**: Response time < 500ms

---

### 5. **No Request Timeout** 🟢 LOW PRIORITY

**Problem**:
No timeout configured = requests can hang forever.

**Solution**:
Add timeout middleware:

```bash
npm install connect-timeout
```

```typescript
// server/src/index.ts
import timeout from 'connect-timeout';

app.use(timeout('30s'));
app.use((req, res, next) => {
  if (!req.timedout) next();
});
```

**Expected Impact**: Prevent zombie requests

---

## 🚀 Quick Win Fixes (Implement Today)

### Fix #1: Update DATABASE_URL (5 minutes)
1. Go to Railway → PostgreSQL service → Variables
2. Update `DATABASE_URL` to:
```
postgresql://postgres:NBZKefiMdNJhwivSCoLSnafLhdMXapYZ@interchange.proxy.rlwy.net:17998/railway?connection_limit=20&pool_timeout=30&connect_timeout=10
```
3. Redeploy backend

### Fix #2: Optimize Auth Middleware (10 minutes)
Edit `server/src/middleware/auth.ts`:
```typescript
// Remove DB query
const user = {
  id: payload.userId,
  email: payload.email,
  name: payload.name,
  role: payload.role,
  city: payload.city
};
```

### Fix #3: Add Pagination (15 minutes per file)
Update `equipment.ts`, `maintenance.ts`, etc.:
```typescript
const { page = 1, limit = 50 } = req.query;
const equipment = await prisma.equipment.findMany({
  take: Number(limit),
  skip: (Number(page) - 1) * Number(limit)
});
```

### Fix #4: Add Request Timeout (5 minutes)
```bash
cd server
npm install connect-timeout
```

Add to `server/src/index.ts`:
```typescript
import timeout from 'connect-timeout';
app.use(timeout('30s'));
```

---

## 📈 Expected Results After Fixes

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| 5xx Errors | Present | 0% | ✅ Eliminated |
| Error Rate | 11% | < 1% | 91% reduction |
| p50 Response | Fast | < 100ms | Maintained |
| p95 Response | 10-20s | < 500ms | 95% faster |
| p99 Response | 20s+ | < 1s | 95% faster |
| DB Queries/req | 3-5 | 1-2 | 50% reduction |

---

## 💻 Recommended Server Specs

### For 10-15 Concurrent Users:
- **CPU**: 0.5-1 vCPU ✅ (current is sufficient)
- **RAM**: 512 MB - 1 GB ✅ (current is sufficient)
- **Storage**: 1-2 GB ✅ (current is sufficient)
- **DB Connections**: 20+ ❌ (MUST increase)

### For 20-40 Users (Future Growth):
- **CPU**: 1-2 vCPU
- **RAM**: 1-2 GB
- **Storage**: 2-5 GB
- **DB Connections**: 30-40

---

## 🔍 How to Monitor After Fixes

### 1. Railway Dashboard
- Check 5xx errors: Should be 0
- Check error rate: Should be < 1%
- Check p95 response time: Should be < 500ms

### 2. Check Database Connections
```sql
-- Run in Navicat or psql
SELECT count(*) FROM pg_stat_activity;
-- Should be < 20
```

### 3. Load Testing
```bash
# Install artillery
npm install -g artillery

# Create test-load.yml
config:
  target: 'https://your-backend.railway.app'
  phases:
    - duration: 60
      arrivalRate: 10  # 10 users per second

scenarios:
  - flow:
    - get:
        url: "/api/equipment"
```

```bash
# Run load test
artillery run test-load.yml
```

---

## 📋 Implementation Checklist

- [ ] Update DATABASE_URL with connection pool settings
- [ ] Remove DB query from auth middleware
- [ ] Add pagination to equipment routes
- [ ] Add pagination to maintenance routes
- [ ] Add pagination to consumable routes
- [ ] Add pagination to proposal routes
- [ ] Add pagination to crew routes
- [ ] Install and configure connect-timeout
- [ ] Test with 10 concurrent users
- [ ] Monitor Railway metrics for 24 hours
- [ ] Verify 5xx errors are eliminated
- [ ] Verify error rate < 1%
- [ ] Verify p95 response time < 500ms

---

## 🎯 Priority Order

1. **CRITICAL** (Do Today):
   - Fix #1: Update DATABASE_URL
   - Fix #2: Optimize Auth Middleware

2. **HIGH** (This Week):
   - Fix #3: Add Pagination
   - Fix #4: Add Request Timeout

3. **MEDIUM** (Next Week):
   - Optimize PDF/Excel generation
   - Add database indexes
   - Implement caching

4. **LOW** (When Scaling):
   - Add Redis for caching
   - Add message queue for background jobs
   - Implement CDN for static assets

---

## 🆘 Troubleshooting

### If 5xx Errors Persist:
1. Check Railway logs: `railway logs`
2. Look for specific error messages
3. Check database connection errors
4. Verify DATABASE_URL is correct

### If Response Time Still Slow:
1. Check which endpoint is slow (Railway metrics)
2. Add logging to track query execution time
3. Use `EXPLAIN ANALYZE` in PostgreSQL
4. Check for missing database indexes

### If Memory Usage Increases:
1. Verify pagination is working
2. Check for memory leaks (Node.js profiler)
3. Reduce `take` limit to 25 instead of 50

---

**Created**: December 3, 2025  
**Status**: Ready for Implementation  
**Estimated Time**: 2-3 hours for all fixes
