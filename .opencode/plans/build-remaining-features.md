# Build Remaining Investment Features

## Overview
Complete the BRD spec by building:
1. **Wire all CTAs** with onClick handlers + state passing
2. **Screen C — Get Advice** (advisory request form)
3. **Screen D — Booking Flow** (4 steps: D1-D4, failure via existing `/failed` page)
4. **Add investment failure screens** to `FailedStatesPage.tsx`

---

## Files to Create

### 1. `src/app/pages/InvestmentAdvicePage.tsx` (Screen C)
Advisory request form with all fields per spec.

**Header:** `h-[80px]` gradient, back → landing page
**Content:** scrollable `top-[80px]` area with `px-[24px] pt-[24px]`

**Form fields** (all use floating-label peer pattern):
- Full Name (text, required) — `rounded-[12px] border-[#E2E8F0] peer`
- Phone Number (tel, required, Nigerian format validation)
- Email Address (email, optional)
- Investment Range — Radix `<Select>` dropdown from `ui/select.tsx`
- Best Time to Call — Radix `<Select>` dropdown
- Message / Notes (textarea, max 300 chars, optional)

**Select dropdown options:**
- Investment Range: `<₦500K | ₦500K–₦1M | ₦1M–₦5M | ₦5M–₦50M | >₦50M`
- Call Time: `Morning 9–12 | Afternoon 12–5 | Evening 5–8`

**Submit button:** `bg-[#FF8200]` orange, full width, `rounded-[12px]`

**States:**
- Loading: spinner on button text → "Submitting…"
- Success: confirmation screen with ✅ icon, ref number, "We'll contact you by [date]", "Back to Home" button
- Error: "Could not submit. Please try again or call 0700ACCESSBANK." + retry button

---

### 2. `src/app/pages/InvestmentBookingPage.tsx` (Screen D — 4 steps)
Booking flow controlled by `step` state (1-4). Step D5 (failure) handled by navigating to `/failed` route.

**State received via `useLocation().state`:**
```ts
{
  calculatorType: "returns" | "required",
  amount: number,
  tenor: number,
  rate: number,
  grossInterest: number,
  wht: number,
  netReturn: number,
  netAtMaturity: number,
  maturityDate: string
}
```

#### Step D1 — Booking Details
- **Header:** `h-[80px]` gradient, "Complete Booking", back → calculator page
- **Debit Account:** tappable card showing selected account (name, masked number, balance). Tapping opens `BottomSheet` with mock accounts list. Validation: balance ≥ investment amount.
- **Referral Code:** optional text input, floating-label pattern
- **Maturity Notification:** Yes/No toggle buttons
- **"Review Summary"** button — disabled until valid account selected

#### Step D2 — Review Summary
- **Header:** "Review Investment", back → D1
- Read-only summary card with data rows per spec:
  - Investment Amount, Debit Account, Tenor, Interest Rate, Value Date, Maturity Date, Gross Interest, WHT, Net Interest, **Net at Maturity** (highlighted)
- Expandable T&C section (collapsible toggle)
- Checkbox: "I have read and agree to the Terms and Conditions"
- **"Confirm & Enter PIN"** button — disabled until checkbox ticked

#### Step D3 — PIN Authorization
- **Header:** "Authorize Investment"
- Subtitle: "Confirm your investment of ₦[amount]"
- `PinInput` component inline (4-digit)
- Processing state: "Processing your investment…" with spinner
- On success → Step D4
- On PIN invalid → show error text, attempt count. After 3 → `navigate("/failed")`
- On API failure → `navigate("/failed")`

#### Step D4 — Success
- Animated checkmark (use `animate-scale-in` from theme.css)
- "Investment Booked" tag
- Summary: Ref Number, Amount, Tenor, Maturity Date, Net at Maturity
- Actions:
  - **"Download Receipt"** (orange `bg-[#FF8200]`) — mock action
  - **"Reinvest"** (outline button) → navigate to Returns calculator
  - **"Back to Home"** (text link)

---

## Files to Modify

### 3. `src/app/pages/InvestmentLandingPage.tsx`
Line 77: Add `onClick={() => navigate("/investments/advice")}` to "Get Advice" button

### 4. `src/app/pages/ReturnsOnPrincipalPage.tsx`
Line 165: Add `onClick` to "Proceed to Invest" button — navigate to booking with state
Line 169: Add `onClick={() => navigate("/investments/advice")}` to "Learn More" button

### 5. `src/app/pages/RequiredInvestmentPage.tsx`
Line 168: Add `onClick` to "Invest This Amount" button — navigate to booking with state

### 6. `src/app/pages/FailedStatesPage.tsx`
Add two new failure scenarios for investment:

**New Scenario type entries:**
```ts
| "investment-booking-failed"
| "investment-pin-failed"
```

**Scenario list items:**
```ts
{ id: "investment-booking-failed", label: "Investment Booking Failed", subtitle: "Investment could not be processed" },
{ id: "investment-pin-failed", label: "Investment PIN Failed", subtitle: "Transaction PIN was incorrect" },
```

**Switch case in `FailedScreen`** — add two new cases calling `InvestmentBookingFailed` and `InvestmentPinFailed` components.

**`InvestmentBookingFailed` component:**
- Uses `FailIcon` + `FailedHeader` pattern
- Error code selector (for testing INSUFFICIENT_FUNDS / ACCOUNT_INACTIVE / SYSTEM_ERROR / DUPLICATE_TXN)
- Dynamic error message per code
- "TRY AGAIN" + "GO BACK" buttons

**`InvestmentPinFailed` component:**
- `FailIcon` + "Transaction PIN Failed" title
- Shows attempt count
- "TRY AGAIN" + "GO BACK" buttons

### 7. `src/app/routes.tsx`
Add imports:
```ts
import InvestmentAdvicePage from "./pages/InvestmentAdvicePage";
import InvestmentBookingPage from "./pages/InvestmentBookingPage";
```

Add routes:
```ts
{ path: "/investments/advice", element: <InvestmentAdvicePage /> },
{ path: "/investments/booking", element: <InvestmentBookingPage /> },
```

### 8. `src/app/App.tsx`
Same imports + routes as routes.tsx

---

## Design System Compliance

| Element | Pattern |
|---------|---------|
| Header | `h-[80px]` gradient, flex, back button SVG `M15 18L9 12L15 6` |
| Inputs | `peer`-based floating label: `rounded-[12px] border-[#E2E8F0] text-[#1E293B] focus:border-[#003883]` |
| Primary buttons | `bg-[#FF8200] text-white font-bold text-[16px] py-[16px] rounded-[12px] disabled:opacity-50` |
| Secondary buttons | `border border-[#003883] text-[#003883] rounded-[12px]` |
| Cards | `bg-white rounded-[12px] p-[16px] border border-[#E2E8F0]` |
| Data rows | `flex justify-between py-[12px] border-b border-[#E2E8F0]` with `text-[14px] text-[#334155]` |
| Font | `font-['Effra',sans-serif]` everywhere |
| Bottom sheet | `isOpen`/`onClose` pattern with `AnimatePresence` + motion |

---

## End-to-End Flow

```
HomePage → "Fixed Income" quick action
  → Landing Page (Screen 0)
    → Returns Calculator (Screen A) → Booking (D1→D2→D3→D4) → Success
    → Required Calculator (Screen B) → Booking (D1→D2→D3→D4) → Success
    → Get Advice (Screen C) → Confirmation
    └── On failure at any booking step → navigate("/failed") → view investment error
```
