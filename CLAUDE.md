# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Matrix BNB Web is a Nuxt 3 web application for interacting with a Solidity smart contract (Core.sol) on the Binance Smart Chain (BSC). The app provides a UI for users to connect their MetaMask wallet and interact with on-chain functionality including reading contract state and executing write operations.

## Architecture

### Tech Stack
- **Frontend Framework**: Nuxt 3 (Vue 3)
- **Blockchain**: Web3.js v4, MetaMask integration
- **Styling**: SASS with Bootstrap 5
- **Templating**: Pug (PUG template language)
- **Environment**: Node.js with cross-env for platform compatibility

### Directory Structure

```
├── components/          # Reusable Vue components (panels, alerts, connect wallet)
├── composables/         # Vue composables (useDisabled for state management)
├── libs/
│   └── blockchain/      # Core blockchain interaction logic
│       ├── classes.ts   # Config, CoreContract, Common, Network, External classes
│       └── types.ts     # TypeScript interfaces and types
├── pages/               # Nuxt pages (router-driven)
│   ├── _index.vue       # Main layout with mobile QR support
│   ├── write.vue        # Write operations to contract
│   ├── read.vue         # Read operations from contract
│   └── admin.vue        # Admin panel
├── app/
│   └── router.options.ts # Custom Nuxt router configuration
├── plugins/
│   ├── blockchain.ts    # Plugin that initializes Blockchain singleton
│   └── event-bus.ts     # Event emitter setup
├── contracts/
│   └── Core.sol/
│       └── Core.json    # Contract ABI (generated from Solidity)
├── types/               # TypeScript type definitions
├── sass/                # Global SASS styles
└── public/              # Static assets (QR codes, etc)
```

### Core Architecture Patterns

#### 1. **Blockchain Service Layer** (`libs/blockchain/`)
The blockchain interaction is encapsulated in a service layer accessed via `$Blockchain` injected plugin:
- **Config**: Singleton that holds runtime configuration (chain ID, RPC URL, contract address, currency info)
- **CoreContract**: Singleton for Web3 contract instance with ABI loaded from `Core.json`
- **Common**: Base class providing:
  - Web3 instance initialization
  - Wallet detection and initialization
  - Event emission for UI updates (alerts, disabled state)
  - Error parsing/formatting
- **Network**: Extends Common, handles MetaMask network switching
- **External**: Main class extending Network, handles actual contract interactions

#### 2. **Environment Configuration**
Multiple environment files for different networks:
- `.env.hardhat` - Local HardHat node (chain ID 0x7A69)
- `.env.testnet.bsc` - BSC Testnet (chain ID 0x61)
- `.env.mainnet.bsc` - BSC Mainnet (chain ID 0x38)
- `.env.mainnet.eth` - Ethereum Mainnet (chain ID 0x1)
- `.env` - Default/current environment

Configuration is loaded in `nuxt.config.ts` under `runtimeConfig.public` and injected at runtime.

#### 3. **Component Architecture**
Components are organized by functionality:
- **Connect.vue / Metamask.vue**: Wallet connection UI
- **Panel* components**: Reusable input/action panels for specific contract methods
  - PanelWithdraw, PanelSendAmount, PanelGetMatrixUser, etc.
- **AdminPanel.vue**: Admin-only operations
- **Alerts.vue**: Global alert/notification system

#### 4. **State Management**
- Vue composables (`useDisabled`) handle reactive state
- Event emitter pattern for global events (alerts, disabled state)
- localStorage for persistent data (e.g., wallet parameter)

#### 5. **Custom Router Configuration**
Router in `app/router.options.ts` defines:
- Dynamic route `/:w` for passing wallet parameter via URL
- Nested route structure under main page with write/read sub-routes
- Admin route with separate component

## Development Commands

### Setup & Installation
```bash
npm install
```

### Development Server
Runs on port 3333 (configured in nuxt.config.ts):
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Production Start
Starts on 0.0.0.0:3062 (configured in package.json):
```bash
npm start
```

### Preview Built Project
```bash
npm run preview
```

### Generate Static Site
```bash
npm generate
```

## Key Files & Responsibilities

### `libs/blockchain/classes.ts`
Core business logic for blockchain interaction. Add new contract methods here by extending the External class. This is where Web3 calls happen and error handling occurs.

### `components/`
UI layer. Create new panels for new contract interactions. Each panel typically:
- Accepts user input via form fields
- Calls blockchain methods via `$Blockchain`
- Displays results or errors via alerts

### `pages/`
Router entry points. Currently organized as:
- `/` and `/:w` - Main page with write operations
- `/read` - Read operations view
- `/admin` - Admin panel

### `app/router.options.ts`
Custom router configuration. Update this to add new routes or modify route structure. Note the TODO about creating folded components instead of "chinese noodles" (nested inline templates).

### Contract Files
`contracts/Core.sol/Core.json` contains the smart contract ABI. This is generated from the Solidity source and loaded at runtime for Web3.js contract instantiation.

## Development Practices

### Environment Variables
- Use `.env.hardhat` for local development against HardHat
- Never commit sensitive keys to version control
- Always use environment-specific files for different networks

### Error Handling
The `Common.ThrowAlert()` method parses contract revert reasons and RPC errors. When adding new contract interactions, be aware that errors are formatted before being displayed:
- Contract revert messages are extracted from error strings
- RPC-level errors (nonce issues, etc) are parsed from JSON responses

### Adding New Contract Methods
1. Update Core.json if contract ABI changes
2. Add method handler in `libs/blockchain/classes.ts` (External class)
3. Create a new Panel component in `components/` for the UI
4. Update the appropriate page (write.vue or read.vue) to use the new panel
5. Handle loading/error states using the disabled event

### Wallet Integration
MetaMask integration via global ethereum object. The app:
- Detects MetaMask via `window.ethereum.isMetaMask`
- Prompts network switching via `wallet_switchEthereumChain`
- Handles mobile deep-linking via QR codes with APP_LINK config

### Mobile Support
The project uses `@nuxtjs/device` composable for device detection. Mobile users without MetaMask are shown a QR code to open the site in MetaMask.

## Important Notes

- **No Git operations**: Per project instructions, don't use git commands
- **Database operations**: Not applicable to this frontend project
- **Configuration**: All network/contract configuration is environment-based, not hardcoded
- **ABI Management**: Core.json is the single source of truth for contract interface - keep it in sync with deployed contracts
- **Runtime Config**: nuxt.config.ts loads environment variables for public use - these are injected into `$Blockchain.Config` at runtime
