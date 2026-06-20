# Data Quality Framework

## Quality Dimensions
1. **Completeness** - All required fields present
2. **Accuracy** - Data matches source reality
3. **Consistency** - Uniform format across records
4. **Timeliness** - Data freshness acceptable

## Validation Rules
- Product fingerprint: `{BRAND}|{WIDTH}|{ASPECT_RATIO}|{RIM_DIAMETER}` format
- Price: Positive number, <50,000 MXN
- URL: Valid HTTP/HTTPS format
- Brand: From known brands list

## Quality Gates
| Stage | Threshold | Action |
|-------|-----------|--------|
| Ingest | 99% valid | Log warnings |
| Storage | 100% valid | Reject records |
| Query | 95% complete | Alert team |

## Monitoring
- Track validation errors in logs
- Alert on quality threshold drops
- Daily quality reports