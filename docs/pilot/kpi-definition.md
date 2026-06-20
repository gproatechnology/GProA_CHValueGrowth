# KPI Definition

## Scraping Reliability
- **Uptime**: Percentage of successful scrapes
- **Error Rate**: Failed requests / total requests
- **Latency**: Average response time

## Matching Accuracy
- **True Positives**: Correct matches
- **False Positives**: Incorrect matches
- **Unknown Matches**: No match found
- **Accuracy**: (TP) / (TP + FP)

## Operational KPIs
- **API Response Time**: <200ms p95
- **Database Queries**: <50ms average
- **Error Rate**: <1%

## Product KPIs
- **Unique Products**: Count in catalog
- **Observations per Product**: Average
- **Price Volatility**: Standard deviation
- **Brand Coverage**: Percentage of known brands

## Exit Criteria for v1.0
| Metric | Target |
|--------|--------|
| Scraping Uptime | ≥95% |
| Matching Accuracy | ≥85% |
| API Error Rate | ≤1% |
| Product Count | ≥500 |
| Observations | ≥1000 |