# 003-portfolio-before-markets-before-mining
- Date: 2026-01
- Decision: Sequence delivery as Portfolio (read-first) → Markets via adapter → miner → capital bridge surfaces.
- Context: Roadmap phases lock Phase 6 (Portfolio read-only), Phase 7 (Markets through ETCswap V2 adapter), Phase 8 (miner reward to capital bridge, ASIC-primary with GPU support for ETChash).
- Consequences: Portfolio capability should be enabled before Markets; Markets only through the ETCswap adapter; miner bridge work waits until after Markets and must respect ASIC/GPU realities.
