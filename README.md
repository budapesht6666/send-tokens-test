## dApp UI – Send Native Tokens

This project is a mobile‑first dApp UI built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS 4**.

The main purpose of this app is to **send native tokens on test networks**:

- `polygonAmoy` testnet
- `arbitrumSepolia` testnet

Wallet connection and transactions are handled via a RainbowKit / wagmi configuration using these chains (see `src/lib/wagmi.ts`).

### Features

- Mobile‑first layout with header, "Lending" hero block, KPI badges, Rewards banner, and an asset cards grid.
- Native token send form for supported testnets.
- Wallet connect button (RainbowKit / wagmi).
- Dark theme enabled by default with persistent preference in `localStorage` (`ui-theme` key).

### Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Theme Switching

- Theme toggle is located on the right side of the header.
- The theme provider manages the `dark` class on the `<html>` element.
- The last selected theme is stored in `localStorage` under the `ui-theme` key; dark theme is active on the first visit.

### Key Components & Structure

- `src/components/theme/theme-provider.tsx` – Theme provider that manages the `dark` class on `<html>`.
- `src/components/theme/theme-toggle.tsx` – Theme toggle button with Sun/Moon icons (`lucide-react`).
- `src/components/header/mobile-header.tsx` – Mobile header with navigation inside a `Sheet`.
- `src/components/wallet/custom-connect-button.tsx` – Custom wallet connect button.
- `src/components/wallet/send-native-token-form.tsx` – Form for sending native tokens on `polygonAmoy` and `arbitrumSepolia`.
- `src/components/ui/*` – UI primitives (button, card, switch, sheet, etc.) in a simplified shadcn-like style.
- `src/lib/wagmi.ts` – wagmi / RainbowKit config with `polygonAmoy` and `arbitrumSepolia` chains.

### Code Style

Follow the rules from `codestyle.docs.md`:

- Strict TypeScript typing, no `any`.
- Use the `cn` helper from `@/lib/utils`.
- Use the `@/*` path alias configured in `tsconfig.json`.

### Possible Next Steps

- Plug in real asset data and number formatting.
- Improve validations and UX for the send‑token flow.
- Extend the desktop layout and navigation.
- Add unit tests for the theme provider and wallet / send form logic.
