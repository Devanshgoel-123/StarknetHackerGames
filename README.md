# StarknetHackerGames

### zkBob: an autonomous AI DeFi agent for Starknet

🏆 **1st place, Agentic track, Starknet Hacker Games**

[![Live demo](https://img.shields.io/badge/demo-starknet--hacker--games.vercel.app-000?logo=vercel)](https://starknet-hacker-games.vercel.app)
[![Backend](https://img.shields.io/badge/backend-HackerGames__backend-181717?logo=github)](https://github.com/Devanshgoel-123/HackerGames_backend)
![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Starknet](https://img.shields.io/badge/Starknet-EC796B?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyBmaWxsPSIjZmZmZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTIgMjFhOSA5IDAgMSAxIDAtMTggOSA5IDAgMSAxIDAgMThtNi45MzItMTEuNTJjLS4zMDYtLjc3LS44NzMtMS40Mi0xLjYzNi0xLjg5OGE0LjAyIDQuMDIgMCAwIDAtMi44NTItLjUxYy0uNTE1LjEtMS4wMTQuMjkyLTEuNDUyLjU0N2E2IDYgMCAwIDAtMS4xNjUuODkgOSA5IDAgMCAwLS40NzUuNTFsLS4zOTQuNTAyLS42MS44MS0uMTM3LjE4NWMtLjc0Ljk5Ny0xLjU1NyAyLjEtMi44NSAyLjQ0LTEuMDUuMjc3LTEuNjM3LjE0Ny0yLjIzNS4wMTVhOCA4IDAgMCAwLS41Mi0uMTA0IDYuNCA2LjQgMCAwIDAgMS4yMSAyLjAzNGMuNTMyLjYgMS4xOTcgMS4xNDYgMi4wNTIgMS41MDYuODQyLjM2NyAxLjkuNSAyLjg5LjMuOTkzLS4xOSAxLjg2NC0uNjUgMi41NjctMS4xODFhOS4yIDkuMiAwIDAgMCAxLjc1OC0xLjc4M2MuMTMzLS4xNzUuMjA0LS4yNzQuMy0uNDFsLjI2NS0uMzk1Yy4wOTMtLjEyMi4xODItLjI1My4yNy0uMzgzcS4xMy0uMTk3LjI2Ni0uMzc4bC4wNTUtLjA3OWMuMzQtLjQ3OS42NzgtLjk1NiAxLjA2Ny0xLjM5Ny4yMDctLjIzNS40MjUtLjQ2LjY4Mi0uNjc4LjEyOS0uMTA1LjI2Ny0uMjEuNDItLjMwMmEyIDIgMCAwIDEgLjUyNC0uMjRtLTEwLjY4LS4yODctLjIyMi42ODdhLjEwMi4xMDIgMCAwIDEtLjE5NS0uMDAybC0uMjExLS42OWEuNDUuNDUgMCAwIDAtLjI5Mi0uMjk1bC0uNjg2LS4yMjJhLjEwMi4xMDIgMCAwIDEgLjAwMS0uMTk1bC42OS0uMjEyYS40NS40NSAwIDAgMCAuMjk2LS4yOWwuMjIyLS42ODdjLjAzLS4wOTUuMTY1LS4wOTQuMTk0LjAwMWwuMjEyLjY5YS40NS40NSAwIDAgMCAuMjkxLjI5NmwuNjg3LjIyMmMuMDk1LjAzLjA5NC4xNjUtLjAwMi4xOTRsLS42OS4yMTJhLjQ1LjQ1IDAgMCAwLS4yOTUuMjkxbTguMzE0IDcuNzE3YTEuMDI1IDEuMDI1IDAgMSAxIDAtMi4wNTEgMS4wMjUgMS4wMjUgMCAwIDEgMCAyLjA1IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4K)
![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?logo=langchain&logoColor=white)

zkBob lets you run your Starknet DeFi portfolio by chatting. Ask it to analyse a token, find yield, swap, send funds to a saved contact by name, or rebalance your portfolio. You can also hand it a budget and let it trade on its own, within the stop-loss and profit targets you set.

This repo is the **Next.js frontend**. The agent, tools, and scheduled jobs live in [HackerGames_backend](https://github.com/Devanshgoel-123/HackerGames_backend).

![zkBob agent chat](docs/screenshot.png)

> The hosted demo's backend is offline right now, so the UI loads but the agent won't answer. Run both repos locally (below) to try it.

## What I built

This was a three-person hackathon team. I built the agent backend in [HackerGames_backend](https://github.com/Devanshgoel-123/HackerGames_backend): the LangGraph agent, the swap, portfolio and yield-farming functions, the Prisma schema, the API routes, and the deployment. My teammates built most of this frontend and the Twitter and market-analysis tools.

## Features

| Module | What it does |
|---|---|
| **Agent chat** | A natural-language agent that can read on-chain data and prepare transactions for your wallet to sign |
| **Market analysis** | Token selector, price history charts, and an analysis chat that blends market data with Twitter sentiment |
| **Yield farm** | Compares pools across Starknet protocols and deposits or withdraws in one step |
| **Portfolio rebalancer** | Set a target split of stablecoins, native tokens, and other assets; the backend rebalances to it every 6 hours |
| **Autonomous mode** | Delegate funds to an agent wallet with a stop-loss, profit target, and deadline, then watch its trades live |
| **Contacts** | Save addresses under names ("send 10 STRK to Rahul") |

## Architecture

```mermaid
flowchart LR
    subgraph Client["zkBob frontend (this repo)"]
        UI["Next.js + MUI<br/>Agent · Market · Yield · Portfolio · Autonomous"]
        Store["Zustand store"]
        Wallet["starknet-react<br/>Argent / Braavos"]
    end

    subgraph Server["HackerGames_backend (Express)"]
        API["REST API<br/>/agent · /userPortfolio · /rebalance<br/>/autonomous · /depositWithdraw · /userContact"]
        Agent["LangGraph ReAct agent<br/>Claude 3.5 Sonnet + memory"]
        Tools["Tools: swap · deposit/withdraw · token data<br/>yield finder · sentiment · memecoin launch"]
        Cron["Cron every 6h<br/>rebalancer · profit maximiser · volatility swaps"]
        DB[("PostgreSQL<br/>via Prisma")]
    end

    subgraph Chain["Starknet & data"]
        Proto["AVNU · Ekubo · Nostra<br/>STRKFarm · Endur · Vesu"]
        Data["DefiLlama · CoinGecko<br/>Twitter"]
    end

    UI <--> Store
    UI -- "prompt / actions" --> API
    API --> Agent --> Tools
    Tools --> Proto
    Tools --> Data
    Cron --> Tools
    API <--> DB
    Cron <--> DB
    API -- "unsigned calls" --> UI
    UI -- "sign & send" --> Wallet --> Proto
```

**How a request flows**

1. You type a prompt or click an action. The frontend calls the backend.
2. The LangGraph agent picks tools: it fetches prices and pool data, or builds swap and deposit calls through AVNU, Ekubo, STRKFarm, and Endur.
3. Calls that need your signature go back to the frontend, and your wallet signs them. Autonomous-mode trades are signed by the agent's own wallet and recorded in Postgres.
4. Cron jobs on the backend rebalance portfolios and run the profit and volatility strategies every 6 hours.

## Tech stack

**Frontend:** Next.js (App Router), React, TypeScript, MUI and MUI X Charts, Zustand, starknet-react, StarknetKit, SCSS

**Backend:** Express, LangChain / LangGraph, Anthropic Claude, Prisma, PostgreSQL, node-cron, starknet.js, AVNU SDK

## Getting started

```bash
git clone https://github.com/Devanshgoel-123/StarknetHackerGames.git
cd StarknetHackerGames/zkbob
npm install
npm run dev        # http://localhost:3000
```

The frontend expects the backend from [HackerGames_backend](https://github.com/Devanshgoel-123/HackerGames_backend) to be running. The deployed build points to `https://hackergames-backend.onrender.com`.

## Project structure

```
zkbob/src
├── app/                 Next.js routes, layout, wallet provider
├── store/               Zustand agent store
├── Components/
│   ├── Frontend/        Agent, MarketAnalysis, YieldFarm, Portfolio, AutonomousMode, Contacts
│   └── Backend/         Price history and top-pool fetchers, shared types and constants
└── Utils/
```
