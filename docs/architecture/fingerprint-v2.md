# Fingerprint v2 Architecture

## Overview

Fingerprint v2 añade el modelo del neumático para evitar falsos positivos.

## Format Change

### v1 (MVP)
```
BRAND|WIDTH|ASPECT_RATIO|RIM_DIAMETER
MICHELIN|205|55|16
```

### v2 (Advanced)
```
BRAND|MODEL|WIDTH|ASPECT_RATIO|RIM_DIAMETER
MICHELIN|PRIMACY4|205|55|16
```

## Model Extraction

```
"Michelin Primacy 4 205/55 R16"
    ↓
extract_model()
    ↓
"PRIMACY4"
```

## Examples

| Input | Fingerprint |
|-------|-------------|
| MICHELIN PRIMACY 4 205/55 R16 | MICHELIN\|PRIMACY4\|205\|55\|16 |
| MICHELIN PRIMACY-4 205/55 R16 | MICHELIN\|PRIMACY4\|205\|55\|16 |
| MICHELIN PILOT SPORT 4 205/55 R16 | MICHELIN\|PILOTSPORT4\|205\|55\|16 |

## Matching

Ahora "PRIMACY4" y "PILOTSPORT4" no colisionan aunque tengan mismas dimensiones.