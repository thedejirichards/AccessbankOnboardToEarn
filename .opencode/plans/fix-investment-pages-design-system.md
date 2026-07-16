# Fix Investment Pages — Design System Compliance

## Issue 1: Header Pattern (All 3 pages)

### Current (wrong)
```html
<div className="absolute h-[160px] left-0 right-0 top-0 bg-gradient-to-r from-[#003883] to-[#0055b8]">
  <div className="absolute left-[21px] right-[21px] top-[51px] flex items-center gap-[12px]">
```

### Required (from AccessTransferPage)
```html
<div className="absolute left-0 right-0 top-0 h-[80px] bg-gradient-to-r from-[#003883] to-[#0055b8] flex items-center px-[24px]">
  <button onClick={...} className="w-[32px] h-[32px] flex items-center justify-center">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
  <div className="flex-1 text-center mr-[32px]">
    <div className="font-['Effra',sans-serif] font-bold text-[18px] text-white">Title</div>
  </div>
</div>
```

### Files to update
- `src/app/pages/InvestmentLandingPage.tsx` — title: "Fixed Income" + subtitle "Money Market Investments"
- `src/app/pages/ReturnsOnPrincipalPage.tsx` — title: "Returns on Principal"
- `src/app/pages/RequiredInvestmentPage.tsx` — title: "Target Return Calculator"

---

## Issue 2: Page Content Layout (All 3 pages)

### Current (wrong)
Multiple absolute-positioned divs with hardcoded top values:
```html
<div className="absolute left-[21px] right-[21px] top-[210px]">...</div>
<div className="absolute left-[21px] right-[21px] top-[100px]">...</div>
<div className="absolute left-[21px] right-[21px] top-[270px]">...</div>
<div className="absolute left-[21px] right-[21px] bottom-[32px]">...</div>
```

### Required
Single scrollable container below the 80px header:
```html
<div className="absolute left-0 right-0 top-[80px] bottom-0 overflow-y-auto pb-[120px]">
  <div className="px-[24px] pt-[24px]">
    <!-- all content here -->
  </div>
</div>
```

---

## Issue 3: Input Fields (ReturnsOnPrincipalPage, RequiredInvestmentPage)

### Current (wrong)
```html
<div className="relative">
  <span className="absolute left-[14px] top-1/2 -translate-y-1/2">₦</span>
  <input className="w-full h-[52px] pl-[32px] pr-[14px] rounded-[8px] border border-[#e0e0e0] text-[#2a3338] focus:border-[#003883]" />
</div>
```

### Required — floating label pattern per AccessTransferPage
```html
<div className="relative">
  <input type="text" placeholder=" "
    className="w-full bg-white border border-[#E2E8F0] rounded-[12px] px-[16px] pt-[24px] pb-[8px] font-['Effra',sans-serif] text-[14px] text-[#1E293B] focus:border-[#003883] peer" />
  <label className="absolute left-[16px] top-1/2 -translate-y-1/2 font-['Effra',sans-serif] text-[14px] text-[#64748B] pointer-events-none transition-all peer-focus:top-[12px] peer-focus:text-[12px] peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:text-[12px]">
    Label
  </label>
</div>
```
- Investment Amount (₦) — for ReturnsOnPrincipalPage
- Desired Net Return (₦) — for RequiredInvestmentPage

---

## Issue 4: Primary CTA Button Color (ReturnsOnPrincipalPage, RequiredInvestmentPage)

### Current (wrong)
`bg-[#003883]` for primary "Get Rates" / "Calculate"

### Required
`bg-[#FF8200]` (brand orange)

Disabled state: `disabled:opacity-50 cursor-not-allowed` (NOT `bg-[#c0c0c0]`)

---

## Issue 5: Summary Card Containers (All 3 pages)

### Current (wrong)
`bg-[#f9fbff] rounded-[10px] p-[16px] border border-[#e0e0e0]`

### Required
`bg-white rounded-[12px] p-[16px] border border-[#E2E8F0]`

---

## Issue 6: Data Row Display (ReturnsOnPrincipalPage, RequiredInvestmentPage)

### Current (wrong)
```html
<div className="flex justify-between items-center">
  <span className="font-['Effra',sans-serif] text-[12px] text-[#707070]">Label</span>
  <span className="font-['Effra',sans-serif] font-medium text-[12px] text-[#2a3338]">Value</span>
</div>
```

### Required (per TransferReviewPage)
```html
<div className="flex justify-between py-[12px] border-b border-[#E2E8F0]">
  <span className="font-['Effra',sans-serif] text-[14px] text-[#334155]">Label</span>
  <span className="font-['Effra',sans-serif] font-medium text-[14px] text-[#1E293B]">Value</span>
</div>
```
Remove the last item's `border-b`.

---

## Issue 7: "Proceed to Invest" / "Invest This Amount" buttons (orange secondary)

### Required
`bg-[#FF8200]` (match the primary CTA orange, not `#ef7d00`)

---

## Issue 8: InvestmentLandingPage card chevron color

### Current
`stroke="#a0a0a0"`
### Required
`stroke="#94A3B8"`

---

## Issue 9: InvestmentLandingPage card text color

### Current
`text-[#2a3338]` and `text-[#707070]`
### Required
`text-[#1E293B]` and `text-[#64748B]`

---

## Summary of files to modify:

### 1. `src/app/pages/InvestmentLandingPage.tsx`
- [x] Header: `h-[80px]` flex layout with correct back button SVG
- [x] Content: scrollable `top-[80px]` with `px-[24px] pt-[24px]`
- [x] Card styling: `rounded-[12px] border-[#E2E8F0]`
- [x] Text colors: `#1E293B` / `#64748B`
- [x] Chevron color: `#94A3B8`
- [x] Info banner: `rounded-[12px]`
- [x] Bottom button inside scrollable area (not absolute)

### 2. `src/app/pages/ReturnsOnPrincipalPage.tsx`
- [x] Header: `h-[80px]` flex layout with correct back button
- [x] Content: scrollable `top-[80px]` with `px-[24px] pt-[24px]`
- [x] Input: floating-label peer pattern with `rounded-[12px] border-[#E2E8F0] text-[#1E293B]`
- [x] Primary button: `bg-[#FF8200]` with `disabled:opacity-50`
- [x] Card: `bg-white rounded-[12px] border-[#E2E8F0]`
- [x] Data rows: `py-[12px] border-b border-[#E2E8F0]` with `text-[14px] text-[#334155]/[#1E293B]`
- [x] "Proceed to Invest": `bg-[#FF8200]`

### 3. `src/app/pages/RequiredInvestmentPage.tsx`
- [x] Header: `h-[80px]` flex layout with correct back button
- [x] Content: scrollable `top-[80px]` with `px-[24px] pt-[24px]`
- [x] Input: floating-label peer pattern
- [x] Tenor pills: match existing pill patterns
- [x] Primary button: `bg-[#FF8200]` with `disabled:opacity-50`
- [x] Card: `bg-white rounded-[12px] border-[#E2E8F0]`
- [x] Data rows: `py-[12px] border-b border-[#E2E8F0]`
- [x] "Invest This Amount": `bg-[#FF8200]`
