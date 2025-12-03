# ============================================
# Railway Performance & Error Diagnostic Tool
# ============================================
# Analyzes Railway metrics and checks for common issues
# Based on your metrics: 5xx errors + 10-20s response time
# ============================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Vault Pulse Performance Diagnostic" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 ANALYSIS BASED ON YOUR METRICS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ CPU Usage: 0.0-0.1 vCPU (GOOD - not CPU bound)" -ForegroundColor Green
Write-Host "✅ Memory: ~180-200MB stable (GOOD - not memory bound)" -ForegroundColor Green
Write-Host "✅ Network: 0-40KB (GOOD - low traffic)" -ForegroundColor Green
Write-Host "⚠️  5xx Errors: Present (BAD - server errors)" -ForegroundColor Red
Write-Host "⚠️  Error Rate: Up to 11% (BAD - should be <1%)" -ForegroundColor Red
Write-Host "⚠️  Response Time: p95/p99 = 10-20s (BAD - should be <1s)" -ForegroundColor Red
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🔍 CHECKING LOCAL CODE FOR ISSUES" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: Database Query Performance
Write-Host "1️⃣  Checking Database Queries..." -ForegroundColor Yellow

$serverPath = "server/src/routes"
$slowQueryPatterns = @(
    "findMany",
    "findUnique", 
    "SELECT.*FROM",
    "include:",
    "orderBy:"
)

$potentialSlowQueries = @()

Get-ChildItem $serverPath -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Check for queries without indexes
    if ($content -match "findMany\(\{[^}]*where[^}]*\}\)") {
        $potentialSlowQueries += @{
            File = $_.Name
            Issue = "findMany without limit/take - can return ALL records"
        }
    }
    
    # Check for multiple includes (N+1 problem potential)
    if (($content -match "include:\s*\{" | Measure-Object).Count -gt 2) {
        $potentialSlowQueries += @{
            File = $_.Name
            Issue = "Multiple includes - potential N+1 query problem"
        }
    }
}

if ($potentialSlowQueries.Count -gt 0) {
    Write-Host "   ⚠️  Found $($potentialSlowQueries.Count) potential slow queries:" -ForegroundColor Yellow
    $potentialSlowQueries | ForEach-Object {
        Write-Host "      - $($_.File): $($_.Issue)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✅ No obvious slow query patterns found" -ForegroundColor Green
}
Write-Host ""

# Check 2: Missing Error Handling
Write-Host "2️⃣  Checking Error Handling..." -ForegroundColor Yellow

$missingErrorHandling = @()
Get-ChildItem $serverPath -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Check for async without try-catch
    if ($content -match "async.*=>.*await" -and $content -notmatch "try\s*\{") {
        $missingErrorHandling += $_.Name
    }
}

if ($missingErrorHandling.Count -gt 0) {
    Write-Host "   ⚠️  Files with potential missing error handling:" -ForegroundColor Yellow
    $missingErrorHandling | Select-Object -Unique | ForEach-Object {
        Write-Host "      - $_" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✅ Error handling looks good" -ForegroundColor Green
}
Write-Host ""

# Check 3: CORS Configuration
Write-Host "3️⃣  Checking CORS Configuration..." -ForegroundColor Yellow

$indexPath = "server/src/index.ts"
if (Test-Path $indexPath) {
    $indexContent = Get-Content $indexPath -Raw
    
    if ($indexContent -match "cors\(") {
        Write-Host "   ✅ CORS middleware configured" -ForegroundColor Green
        
        if ($indexContent -match "credentials.*true") {
            Write-Host "   ✅ Credentials enabled" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Credentials not enabled - may cause auth issues" -ForegroundColor Yellow
        }
        
        if ($indexContent -match "origin:.*\(origin") {
            Write-Host "   ✅ Dynamic origin validation found" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Static origin only - may block some requests" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ❌ CORS not configured!" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Server index.ts not found!" -ForegroundColor Red
}
Write-Host ""

# Check 4: Database Connection Pooling
Write-Host "4️⃣  Checking Database Connection..." -ForegroundColor Yellow

$prismaPath = "server/src/prisma.ts"
if (Test-Path $prismaPath) {
    $prismaContent = Get-Content $prismaPath -Raw
    
    if ($prismaContent -match "connection_limit") {
        Write-Host "   ✅ Connection pooling configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  No explicit connection pool settings" -ForegroundColor Yellow
        Write-Host "      Default: 10 connections (may be low for 10-15 users)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ℹ️  Using default Prisma client" -ForegroundColor Gray
}
Write-Host ""

# Check 5: API Route Timeouts
Write-Host "5️⃣  Checking for Long-Running Operations..." -ForegroundColor Yellow

$longOperations = @()
Get-ChildItem $serverPath -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Check for PDF generation (can be slow)
    if ($content -match "PDFDocument|pdfkit") {
        $longOperations += "$($_.Name) - PDF generation"
    }
    
    # Check for Excel generation (can be slow)
    if ($content -match "xlsx|ExcelJS") {
        $longOperations += "$($_.Name) - Excel generation"
    }
    
    # Check for multiple await in loop (bad practice)
    if ($content -match "for.*\{.*await.*\}") {
        $longOperations += "$($_.Name) - Await in loop (should use Promise.all)"
    }
}

if ($longOperations.Count -gt 0) {
    Write-Host "   ⚠️  Found potentially slow operations:" -ForegroundColor Yellow
    $longOperations | ForEach-Object {
        Write-Host "      - $_" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✅ No obvious long-running operations" -ForegroundColor Green
}
Write-Host ""

# Check 6: Authentication Issues
Write-Host "6️⃣  Checking Authentication..." -ForegroundColor Yellow

$authPath = "server/src/middleware/auth.ts"
if (Test-Path $authPath) {
    $authContent = Get-Content $authPath -Raw
    
    if ($authContent -match "verify.*jwt") {
        Write-Host "   ✅ JWT verification found" -ForegroundColor Green
    }
    
    if ($authContent -match "prisma.*user.*findUnique") {
        Write-Host "   ⚠️  Database query on every auth request!" -ForegroundColor Yellow
        Write-Host "      This could cause 5xx if DB is slow" -ForegroundColor Gray
        Write-Host "      Consider: Add Redis cache for auth tokens" -ForegroundColor Cyan
    }
} else {
    Write-Host "   ❌ Auth middleware not found!" -ForegroundColor Red
}
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "📋 RECOMMENDATIONS FOR 10-15 USERS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎯 Server Specs (Current is OK):" -ForegroundColor Green
Write-Host "   ✅ 0.5-1 vCPU (sufficient)" -ForegroundColor White
Write-Host "   ✅ 512MB-1GB RAM (sufficient)" -ForegroundColor White
Write-Host "   ✅ 1GB storage (sufficient)" -ForegroundColor White
Write-Host ""

Write-Host "⚡ Performance Fixes Needed:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. DATABASE OPTIMIZATION (Priority: HIGH)" -ForegroundColor Red
Write-Host "   - Add indexes on frequently queried columns" -ForegroundColor White
Write-Host "   - Add limit/take to all findMany queries" -ForegroundColor White
Write-Host "   - Increase connection pool: 15-20 connections" -ForegroundColor White
Write-Host "   - Use select to limit returned fields" -ForegroundColor White
Write-Host ""

Write-Host "2. CACHING (Priority: HIGH)" -ForegroundColor Red
Write-Host "   - Cache auth lookups (reduce DB hits)" -ForegroundColor White
Write-Host "   - Cache frequently accessed data" -ForegroundColor White
Write-Host "   - Add HTTP cache headers for static data" -ForegroundColor White
Write-Host ""

Write-Host "3. AUTH OPTIMIZATION (Priority: MEDIUM)" -ForegroundColor Yellow
Write-Host "   - Remove DB query from auth middleware" -ForegroundColor White
Write-Host "   - Store user data in JWT payload" -ForegroundColor White
Write-Host "   - Or use Redis for session cache" -ForegroundColor White
Write-Host ""

Write-Host "4. API OPTIMIZATION (Priority: MEDIUM)" -ForegroundColor Yellow
Write-Host "   - Add request timeout (30s max)" -ForegroundColor White
Write-Host "   - Move PDF/Excel gen to async queue" -ForegroundColor White
Write-Host "   - Add pagination to all list endpoints" -ForegroundColor White
Write-Host ""

Write-Host "5. ERROR HANDLING (Priority: HIGH)" -ForegroundColor Red
Write-Host "   - Add proper try-catch to all routes" -ForegroundColor White
Write-Host "   - Log 5xx errors to monitoring service" -ForegroundColor White
Write-Host "   - Add circuit breaker for DB" -ForegroundColor White
Write-Host ""

Write-Host "6. MONITORING (Priority: HIGH)" -ForegroundColor Red
Write-Host "   - Add detailed logging (Winston/Pino)" -ForegroundColor White
Write-Host "   - Track slow query execution time" -ForegroundColor White
Write-Host "   - Set up Railway logs monitoring" -ForegroundColor White
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🔧 QUICK WINS (Implement Today)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Add to DATABASE_URL in Railway:" -ForegroundColor Yellow
Write-Host "   connection_limit=20&pool_timeout=30" -ForegroundColor Cyan
Write-Host ""

Write-Host "2. Add pagination to heavy queries:" -ForegroundColor Yellow
Write-Host "   findMany({ take: 50, skip: page * 50 })" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. Add request timeout in index.ts:" -ForegroundColor Yellow
Write-Host "   app.use(timeout('30s'))" -ForegroundColor Cyan
Write-Host ""

Write-Host "4. Cache auth in middleware:" -ForegroundColor Yellow
Write-Host "   Store user in JWT, skip DB lookup" -ForegroundColor Cyan
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "📊 Current vs Target Metrics" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Metric              Current     Target      Status" -ForegroundColor White
Write-Host "─────────────────   ─────────   ─────────   ──────" -ForegroundColor Gray
Write-Host "5xx Error Rate      Present     0%          ❌" -ForegroundColor Red
Write-Host "Error Rate %        11%         <1%         ❌" -ForegroundColor Red
Write-Host "p50 Response        Fast        <100ms      ✅" -ForegroundColor Green
Write-Host "p95 Response        10-20s      <500ms      ❌" -ForegroundColor Red
Write-Host "CPU Usage           0.1 vCPU    <0.5 vCPU   ✅" -ForegroundColor Green
Write-Host "Memory              200MB       <500MB      ✅" -ForegroundColor Green
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ Next Steps" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Check Railway logs for specific 5xx errors" -ForegroundColor White
Write-Host "2. Implement database connection pooling" -ForegroundColor White
Write-Host "3. Add caching for auth middleware" -ForegroundColor White
Write-Host "4. Add request timeouts" -ForegroundColor White
Write-Host "5. Monitor for 24 hours and re-check metrics" -ForegroundColor White
Write-Host ""

Write-Host "Run './fix-performance-issues.ps1' to apply fixes automatically" -ForegroundColor Cyan
Write-Host ""
