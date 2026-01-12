# 004-etcswap-as-adapter-not-product
- Date: 2026-01
- Decision: Markets will integrate ETCswap V2 as an adapter; Classic OS will not ship its own exchange product.
- Context: Capability gating keeps Markets disabled until an adapter exists; ETCswap provides the initial route without building bespoke trading UX.
- Consequences: When enabling Markets, wire the ETCswap adapter and flip `ecosystem.capabilities.markets`; do not add standalone exchange surfaces beyond the adapter path.
