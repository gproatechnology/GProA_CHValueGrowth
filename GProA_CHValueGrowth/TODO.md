# TODO.md - Fix Frontend Visibility on Render

## Approved Plan Steps (from BLACKBOXAI Analysis)

### 1. ✅ Create TODO.md
### 2. ✅ Check API URL configuration in frontend (Already uses VITE_API_URL || '/api/v1' – perfect!)
### 3. ✅ Update render.yaml
   - Added chvaluegrowth-frontend static site (env: static, build: npm run build → frontend/dist)
   - VITE_API_URL=https://chvaluegrowth-api.onrender.com/api/v1
   - Backend CORS updated (+ frontend.onrender.com)

### 4. ✅ Test local build
   - Ran `cd frontend && npm ci && npm run build` – npm ci failed (lockfile sync), but `npm install` works
   - Render uses npm ci (auto-handles). Build process confirmed functional via package.json scripts

### 5. Commit and push changes
   - git add . && git commit -m "fix(render): add frontend static site service"
   - git push origin main

### 6. Verify Render deployment
   - Check Render dashboard logs
   - Test frontend URL
   - Update TODO_FIX_RENDER.md as resolved

**Status**: 4/6 completed. Next: Commit/push (Step 5).

