# Living NFT Platform - Agent Guide

Three independent services (no root workspace). Each has its own `package.json`
with **only a `test` script** — there are no `dev`/`build`/`tsc` npm scripts, so
always invoke binaries via `npx`.

## Start order matters (separate terminals)
1. **Blockchain** (`contracts/`) — must be up before backend/contract calls.
2. **Backend** (`backend/`) — connects to RPC `http://localhost:8545`.
3. **Frontend** (`frontend/`) — static Next app calling backend at `:3001`.

### Terminal 1 — Blockchain
```bash
cd contracts
npx hardhat node                 # local chain on :8545 (wait ~10s)
# in another tab, after node is up:
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

### Terminal 2 — Backend
```bash
cd backend
rm -rf dist && npx tsc           # compile; rm -rf dist drops stale artifacts
node dist/index.js               # serves :3001
```
- `npx tsc` must run from `backend/`. `dist/` is the runtime output.
- Health check: `curl localhost:3001/health` → `{"status":"ok",...}`

### Terminal 3 — Frontend
```bash
cd frontend
rm -rf .next && npx next dev     # Next 16 App Router on :3000
```
- There is **no `npm run dev`** script — use `npx next dev`.
- On 404 / "page mismatch", run `rm -rf .next` and restart (stale route cache).

## Architecture facts (not obvious from filenames)
- **Backend entry is `backend/src/index.ts`** (Express 5 REST). The other
  `src/*.ts` files — `blockchain.ts`, `ollamaGenerator.ts`,
  `ollamaCoinGenerator.ts`, `router/` — and root `services_tmp.ts` are **dead
  legacy code, not imported by the server.** Editing them has no effect.
- Backend is **plain REST (Express)**, NOT tRPC, despite `@trpc/*` deps in
  `package.json`. Frontend calls REST endpoints directly (hardcoded
  `http://localhost:3001/nft/1`).
- **Contracts: source `.sol` files live in `contracts/contracts/`**
  (`hardhat.config.js` sets `sources: "./contracts"`). Do not add `.sol` at the
  `contracts/` root — Hardhat won't compile them and node_modules would trigger
  HH1006.
- Contract addresses are **deterministic Hardhat defaults** (first two deploys),
  so they stay valid across `hardhat node` restarts — only on-chain state
  (minted NFT #1, LCOIN balances) resets.

## Key addresses / accounts
- NFT Contract: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- Coin Contract: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Hardhat owner (contract owner, `ownerOf(1)`): `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

## ⚠️ CRITICAL: do NOT sign with `new ethers.Wallet(privateKey)`
In this environment the local `secp256k1` stack (`@noble/curves`) derives the
WRONG address from a private key. `new Wallet('0xac0974...')` → `0x27952a7f...`
(e.g. owner-of-1 is `0xf39Fd...`, but `onlyOwner` calls revert with
`OwnableUnauthorizedAccount 0x118cdaa7`). 
- **Fix that works**: sign state-changing txs via the node's unlocked account —
  `provider.getSigner(0)` (= `0xf39Fd...`, the owner). Both `nftService` and
  `coinService` already use `await this.provider.getSigner(0)` for writes.
- Do NOT reintroduce a `new ethers.Wallet(key, provider)` for write calls.

## Backend REST endpoints (verified)
`GET /health` · `GET /nft/:id` (also returns `environment`) ·
`POST /nft/:id/feed` · `POST /nft/:id/mutate` (body `{factor}`) ·
`POST /nft/:id/rebirth` (body `{genome}`) ·
`GET /coin/balance/:address` · `GET /coin/supply` ·
`POST /coin/mint/:to` (body `{amount,reason}`) ·
`POST /ai/analyze` (body `{text,context}` → Ollama `llama3.2` at `:11434`).
- **There is no `/environment/:city` route.** Weather is fetched internally by
  `environmentService.getWeatherEffect()`; real data needs `WEATHER_API_KEY`,
  otherwise it returns mock values.

## Pitfalls (verified, easy to miss)
- **`.env.example` has an INVALID private key** (`0xac0974...76677aP` contains
  non-hex chars `E`/`P`). Do not copy it as-is; backend falls back to the
  correct Hardhat key above when `PRIVATE_KEY` is unset.
- **Frontend component import paths**: `src/app/page.tsx` imports
  `../components/*` (i.e. `src/components/`). The `src/app/components/` dir is
  empty — do not add components there expecting them to load.
- **Tailwind is not wired up**: JSX uses Tailwind utility classes, but
  `tailwindcss` is not installed and `postcss.config.js` only loads
  `postcss-preset-env`. Output renders **unstyled** until tailwind is added.
- `next dev` (Next 16) may log cosmetic Turbopack "unhandledRejection" /
  "page mismatch" errors even while the page serves — clear `.next` if it 404s.
- Ollama analysis requires `ollama serve` + `ollama pull llama3.2`; endpoint
  returns 500 if Ollama is down (handled, not fatal to server).
