# ETCswap Protocol Contracts Reference

Official contract addresses and configuration for ETCswap V2 and V3 protocols on Ethereum Classic.

**Source:** https://github.com/etcswap/.github-private/blob/main/profile/README.md

---

## Network Configuration

### Ethereum Classic Mainnet (Chain ID: 61)

- **RPC URL:** https://etc.rivet.link
- **Currency Symbol:** ETC
- **Block Explorer:** https://etc.blockscout.com

### Mordor Testnet (Chain ID: 63)

- **RPC URL:** https://rpc.mordor.etccooperative.org
- **Currency Symbol:** METC
- **Block Explorer:** https://etc-mordor.blockscout.com

---

## Common Contracts (Both Networks)

### Tokens

**WETC (Wrapped ETC)**
- **Mainnet:** [0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a](https://etc.blockscout.com/token/0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a)
- **Mordor:** [0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a](https://etc-mordor.blockscout.com/token/0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a)
- **Note:** Same address on both networks

**Classic USD Stablecoin (USC)**
- **Mainnet:** [0xDE093684c796204224BC081f937aa059D903c52a](https://etc.blockscout.com/token/0xDE093684c796204224BC081f937aa059D903c52a)
- **Mordor:** [0xDE093684c796204224BC081f937aa059D903c52a](https://etc-mordor.blockscout.com/token/0xDE093684c796204224BC081f937aa059D903c52a)
- **Note:** Same address on both networks

---

## ETCswap V2 (Uniswap V2 Fork)

### Ethereum Classic Mainnet

**Core Contracts:**
- **Factory:** [0x0307cd3D7DA98A29e6Ed0D2137be386Ec1e4Bc9C](https://etc.blockscout.com/address/0x0307cd3D7DA98A29e6Ed0D2137be386Ec1e4Bc9C)
- **Router:** [0x79Bf07555C34e68C4Ae93642d1007D7f908d60F5](https://etc.blockscout.com/address/0x79Bf07555C34e68C4Ae93642d1007D7f908d60F5)
- **Multicall:** [0xB945786D5dB40E79F1c25D937cCAC57ab3718BA1](https://etc.blockscout.com/address/0xB945786D5dB40E79F1c25D937cCAC57ab3718BA1)

**Example Pool:**
- **WETC/USC:** [0x8B48dE7cCE180ad32A51d8aB5ab28B27c4787aaf](https://etc.blockscout.com/address/0x8B48dE7cCE180ad32A51d8aB5ab28B27c4787aaf)

**UI & Analytics:**
- **App:** https://v2.etcswap.org
- **IPFS App:** https://v2-ipfs.etcswap.org
- **Subgraph:** https://v2-graph.etcswap.org/subgraphs/name/etcswap/graphql
- **Analytics:** https://v2-info.etcswap.org
- **GeckoTerminal:** https://www.geckoterminal.com/ethereum_classic/etcswap-v2/pools

### Mordor Testnet

**Core Contracts:**
- **Factory:** [0x212eE1B5c8C26ff5B2c4c14CD1C54486Fe23ce70](https://etc-mordor.blockscout.com/address/0x212eE1B5c8C26ff5B2c4c14CD1C54486Fe23ce70)
- **Router:** [0x582A87594c86b204920f9e337537b5Aa1fefC07C](https://etc-mordor.blockscout.com/address/0x582A87594c86b204920f9e337537b5Aa1fefC07C)
- **Multicall:** [0x41Fa0143ea4b4d91B41BF23d0A03ed3172725C4B](https://etc-mordor.blockscout.com/address/0x41Fa0143ea4b4d91B41BF23d0A03ed3172725C4B)

**Example Pool:**
- **WETC/USC:** [0x0a73dc518791Fa8436939C8a8a08003EC782A509](https://etc-mordor.blockscout.com/address/0x0a73dc518791Fa8436939C8a8a08003EC782A509)

**UI:**
- **App:** https://v2-mordor.etcswap.org

---

## ETCswap V3 (Uniswap V3 Fork)

### Both Networks (Same Addresses)

**Note:** ETCswap V3 uses the same contract addresses on both ETC Mainnet (61) and Mordor Testnet (63). The V3 UI includes testnet support built-in.

**Core Contracts:**
- **Factory:** [0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC](https://etc.blockscout.com/address/0x2624E907BcC04f93C8f29d7C7149a8700Ceb8cDC)
- **Universal Router:** [0x9b676E761040D60C6939dcf5f582c2A4B51025F1](https://etc.blockscout.com/address/0x9b676E761040D60C6939dcf5f582c2A4B51025F1)
- **Swap Router02:** [0xEd88EDD995b00956097bF90d39C9341BBde324d1](https://etc.blockscout.com/address/0xEd88EDD995b00956097bF90d39C9341BBde324d1)
- **Quoter V2:** [0x4d8c163400CB87Cbe1bae76dBf36A09FED85d39B](https://etc.blockscout.com/address/0x4d8c163400CB87Cbe1bae76dBf36A09FED85d39B)

**Position Management:**
- **Nonfungible Token Position Manager:** [0x3CEDe6562D6626A04d7502CC35720901999AB699](https://etc.blockscout.com/address/0x3CEDe6562D6626A04d7502CC35720901999AB699)
- **Nonfungible Token Position Descriptor:** [0xBCA1B20B81429cA4ca39AC38a5374A7F41Db2Ed6](https://etc.blockscout.com/address/0xBCA1B20B81429cA4ca39AC38a5374A7F41Db2Ed6)
- **Descriptor Proxy:** [0x224c3992F98f75314eE790DFd081017673bd0617](https://etc.blockscout.com/address/0x224c3992F98f75314eE790DFd081017673bd0617)
- **NFT Descriptor Library:** [0xa47E8033964FbDa1cEEE77191Fc6188898355c0D](https://etc.blockscout.com/address/0xa47E8033964FbDa1cEEE77191Fc6188898355c0D)

**Periphery Contracts:**
- **Permit2:** [0x000000000022D473030F116dDEE9F6B43aC78BA3](https://etc.blockscout.com/address/0x000000000022D473030F116dDEE9F6B43aC78BA3)
- **Multicall V3:** [0x1E4282069e4822D5E6Fb88B2DbDE014f3E0625a9](https://etc.blockscout.com/address/0x1E4282069e4822D5E6Fb88B2DbDE014f3E0625a9)
- **Tick Lens:** [0x23B7Bab45c84fA8f68f813D844E8afD44eE8C315](https://etc.blockscout.com/address/0x23B7Bab45c84fA8f68f813D844E8afD44eE8C315)
- **Proxy Admin:** [0x4823673F7cA96A42c4E69C8953de89f4857E193D](https://etc.blockscout.com/address/0x4823673F7cA96A42c4E69C8953de89f4857E193D)

**Migration & Staking:**
- **Migrator:** [0x19B067263c36FA09d06bec71B1E1236573D56C00](https://etc.blockscout.com/address/0x19B067263c36FA09d06bec71B1E1236573D56C00)
- **Staker:** [0x12775aAf6bD5Aca04F0cCD5969b391314868A7e9](https://etc.blockscout.com/address/0x12775aAf6bD5Aca04F0cCD5969b391314868A7e9)

**Constants:**
- **INIT_CODE_HASH:** `0x7ea2da342810af3c5a9b47258f990aaac829fe1385a1398feb77d0126a85dbef`

**UI & Analytics:**
- **App:** https://v3.etcswap.org
- **IPFS App:** https://v3-ipfs.etcswap.org
- **IPFS Hash:** bafybeifodxjubzrzsdfyy6k2s4mhna2czsbtgiivyqqsuqf7hy26r4llmu
- **Subgraph:** https://v3-graph.etcswap.org/subgraphs/name/etcswap/graphql
- **Analytics:** https://v3-info.etcswap.org
- **IPFS Analytics:** https://ipfs.io/ipfs/bafybeihjqxlv4t6cmu5po3jirm347z6mgibjteslkk2ywtwl64tbprek4e
- **GeckoTerminal:** https://www.geckoterminal.com/ethereum_classic/etcswap-v3/pools

---

## Additional ETC Ecosystem Contracts

**ECO Reward Token:**
- **Address:** [0xc0364FB5498c17088A5B1d98F6FB3dB2Df9866a9](https://etc.blockscout.com/token/0xc0364FB5498c17088A5B1d98F6FB3dB2Df9866a9)

---

## Implementation Notes

### For Portfolio Module

**ETCswap V2 Position Discovery:**
- Use Factory contract to query pairs: `getPair(tokenA, tokenB)`
- Or enumerate all pairs: `allPairs(index)` and `allPairsLength()`
- Check LP token balances using ERC20 `balanceOf`

**ETCswap V3 Position Discovery:**
- Query NonfungiblePositionManager for user's NFT positions
- Use `balanceOf(address)` to get position count
- Use `tokenOfOwnerByIndex(address, index)` to enumerate token IDs
- Call `positions(tokenId)` to get position details
- Works on both ETC Mainnet (61) and Mordor Testnet (63) with same contract addresses

**Multicall Optimization:**
- ETCswap V2 has custom Multicall contract (different from Multicall V3)
- ETCswap V3 uses standard Multicall V3
- Consider gas limits: ETC has 8M vs Ethereum's 30M

### Router Usage (For Future Deploy Phase)

**V2 Router Functions:**
- `swapExactTokensForTokens` - standard swap
- `addLiquidity` - add liquidity to pool
- `removeLiquidity` - remove liquidity from pool

**V3 Router Functions:**
- Use `Swap Router02` for swaps
- Use `Nonfungible Token Position Manager` for position management
- Universal Router combines multiple operations

---

## Quick Reference Table

| Contract Type | Mainnet Address | Mordor Address | Notes |
|--------------|----------------|----------------|-------|
| WETC | `0x1953...7a5a` | `0x1953...7a5a` | Same on both |
| USC Stablecoin | `0xDE09...c52a` | `0xDE09...c52a` | Same on both |
| V2 Factory (Mainnet) | `0x0307...Bc9C` | - | Mainnet only |
| V2 Factory (Mordor) | - | `0x212e...e70` | Testnet only |
| V2 Router (Mainnet) | `0x79Bf...60F5` | - | Mainnet only |
| V2 Router (Mordor) | - | `0x582A...07C` | Testnet only |
| V2 Multicall (Mainnet) | `0xB945...8BA1` | - | Custom implementation |
| V2 Multicall (Mordor) | - | `0x41Fa...5C4B` | Custom implementation |
| V3 Factory | `0x2624...cDC` | `0x2624...cDC` | Same on both networks |
| V3 Position Manager | `0x3CEd...699` | `0x3CEd...699` | Same on both networks |
| Multicall V3 | `0x1E42...5a9` | `0x1E42...5a9` | Standard Multicall3 |

---

## External Resources

- **ETCswap Website:** https://etcswap.org
- **ETCswap Twitter:** https://x.com/ETCswap_org
- **Classic USD:** https://classicusd.com
- **Wrapped Ether:** https://wrappedether.org
- **ETC Official:** https://ethereumclassic.com

---

**Last Updated:** 2026-01-14
**Maintained By:** Classic OS Team
**Source Repository:** https://github.com/classic-os/classicos-app
