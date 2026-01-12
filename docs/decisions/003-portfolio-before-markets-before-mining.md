# 003-portfolio-before-markets-before-mining
- Date: 2026-01
- Decision: Sequence delivery as Portfolio (read-first) → Markets via adapter → miner → capital bridge surfaces.
- Context: Roadmap sequencing: Portfolio read-only (v0) → Markets via ETCswap V2 adapter → Miner reward bridge (ASIC-primary with GPU support for ETChash).
- Consequences: Portfolio read-only must ship before Markets adapter; Markets only through ETCswap; capital bridge (Produce miner) waits until after Markets and must respect ASIC/GPU hardware realities.
