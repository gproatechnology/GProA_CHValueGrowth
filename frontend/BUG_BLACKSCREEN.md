# BUG REPORTE: Pantalla Negra Post-SplashScreen → Login.jsx
**Síntoma:** Black screen tras 2.5s splash (App.jsx timer).

## 🔍 Diagnóstico (Análisis Código)
**App.jsx:** SplashScreen (2500ms) → Router/Login. Lógica correcta.
**SplashScreen.jsx:** Perfecto (desktop UI, progress anim).
**Login.jsx:** Canvas + containerRef/resizeObserver → **Suspecha init fail** (dimensions 0px durante mount).

**Causas probables:**
1. Canvas resizeObserver dispara con rect.width=0 (race condition post-splash).
2. `canvas.width=0` → `clearRect` infinito → black.
3. No fallback si container rect vacío.

## 🛠️ FIX INMEDIATO (Edit Login.jsx)
```
1. Agregar check `if (rect.width === 0 || rect.height === 0) return;`
2. useLayoutEffect para canvas vs useEffect.
3. Fallback div colored si canvas fail.
4. requestAnimationFrame con throttle 30fps.
```

## 📋 PASOS VERIFICACIÓN
```
1. Ctrl+Shift+R navegador (hard refresh)
2. DevTools Network → Throttle → Slow 3G (simula load)
3. Resize window durante transition.
```

**Prioridad:** Alta - UX blocker. ETA fix: 15min.

**BLACKBOXAI - Análisis completado.**

