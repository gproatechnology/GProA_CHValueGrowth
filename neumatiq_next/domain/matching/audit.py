"""Product catalog audit report generator."""
from neumatiq_next.domain.matching.canonicalization import CanonicalizationService


async def run_audit() -> dict:
    """Run catalog audit (standalone for report generation)."""
    service = CanonicalizationService()
    return await service.audit()


def generate_fixtures_report() -> dict:
    """Generate fixture validation report."""
    from neumatiq_next.domain.matching.service import MatchingService
    from neumatiq_next.infrastructure.scraping.base.normalization import normalize_title
    
    service = MatchingService()
    
    # Test consolidatable titles
    consolidatable = [
        "MICHELIN PRIMACY 4 205/55 R16",
        "Michelin Primacy4 205-55R16",
        "MICHELIN PRIMACY-4 205/55R16",
    ]
    
    # Test non-consolidatable
    distinct = [
        "MICHELIN PILOT SPORT 4 205/55 R16",
    ]
    
    fingerprints = []
    for title in consolidatable:
        fp = service.parse_from_title(title)
        if fp:
            fingerprints.append(fp.generate())
    
    for title in distinct:
        fp = service.parse_from_title(title)
        if fp:
            fingerprints.append(fp.generate())
    
    # Check consolidation
    unique_fps = set(fingerprints[:3])  # First 3 should be same
    distinct_fp = set([fingerprints[3]]) if len(fingerprints) > 3 else set()
    
    return {
        "consolidatable_count": 3,
        "consolidatable_unique_fingerprints": len(unique_fps),
        "distinct_count": 1,
        "distinct_fingerprints": len(distinct_fp),
        "should_consolidate": len(unique_fps) == 1,
        "should_not_collide": unique_fps.isdisjoint(distinct_fp),
    }


if __name__ == "__main__":
    import asyncio
    
    report = generate_fixtures_report()
    print("Fixture Validation Report:")
    for key, value in report.items():
        print(f"  {key}: {value}")
    
    # Run audit when DB available
    try:
        stats = asyncio.run(run_audit())
        print("\nCatalog Audit Report:")
        for key, value in stats.items():
            print(f"  {key}: {value}")
    except Exception as e:
        print(f"\nAudit requires database: {e}")