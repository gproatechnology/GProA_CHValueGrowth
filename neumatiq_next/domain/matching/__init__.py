"""Matching domain module."""
from neumatiq_next.domain.matching.models import ProductFingerprint, MatchingCandidate, MatchResult
from neumatiq_next.domain.matching.service import MatchingService
from neumatiq_next.domain.matching.normalization import extract_model, normalize_model
from neumatiq_next.domain.matching.canonicalization import CanonicalizationService, ConsolidationService

__all__ = [
    "ProductFingerprint",
    "MatchingCandidate",
    "MatchResult",
    "MatchingService",
    "extract_model",
    "normalize_model",
    "CanonicalizationService",
    "ConsolidationService",
]