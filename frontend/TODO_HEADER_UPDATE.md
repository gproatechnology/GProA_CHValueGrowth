# Frontend Header Update Plan

1. [x] Created components/NewHeader.jsx from provided HTML
2. [] Edit App.jsx: Replace old title bar + UserProfile with NewHeader
3. [] cd frontend && npm run dev - test render
4. [] Commit changes

Details:
- Replace `div className="flex-shrink-0 bg-[#050c1a]/95 backdrop-blur-md border-b border-[#1E90FF]/10 shadow-xl"` block with `<NewHeader onLogout={handleLogout} />`
- Remove UserProfile component and fixed div bottom right.

