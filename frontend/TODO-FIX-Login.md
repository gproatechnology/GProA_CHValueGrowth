# TODO.md: Fixes Login.jsx (Post-Audit BLACKBOXAI)
**Progreso:** 0/8 | **ETA:** 30min | **Prioridad:** Alta (Black screen + Security)

## Information Gathered
- Canvas resize fail (0x0 → black).
- Hardcoded creds, localStorage XSS, mock auth.

## Plan File-Level
**Login.jsx:**
1. Canvas guards (w/h > 1).
2. Remover demo creds.
3. mockLogin → axios real `/api/v1/auth/login`.
4. localStorage → fetch cookies.
5. FPS throttle + pause.

**vite.config.js:** Proxy backend.

## Dependent Files
- Backend auth.py (OK).

## Followup Steps
1. Editar → `npm run dev` test.
2. Backend up: `uvicorn services.api.main:app --port 8000`.

**Confirmar para proceder con edits.**

