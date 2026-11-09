---
name: ecommerce-design-md
description: >-
  E-commerce design system references and guidelines derived from awesome-design-md-ecommerce.
  Use when styling, architecting, or creating UI components, design tokens, typography scales,
  palettes, and responsive storefront layouts for fashion and lifestyle e-commerce stores.
---

# E-Commerce Design System Skill (`awesome-design-md-ecommerce`)

This skill integrates design principles, token structures, and brand references from [`awesome-design-md-ecommerce`](https://github.com/xjli360/awesome-design-md-ecommerce) into your project.

It provides actionable guidelines for building on-brand, high-taste fashion and lifestyle e-commerce storefronts that avoid generic AI aesthetics.

---

## 1. Core Visual Principles for Fashion & Lifestyle E-Commerce

When building an e-commerce storefront (such as the Ecstasy BD-inspired platform), apply these proven design principles:

### A. Editorial Restraint & Canvas Contrast
- **Canvas / Ground**: Use warm off-whites, crisp alabasters, or muted cream canvases (e.g., `#fffef8`, `#fbf7f3`, `#fdfdfd`) rather than stark `#ffffff` or generic grey.
- **Surface Elevation**: Create depth through slight temperature shifts (cool white cards on warm cream, or subtle 1px borders) rather than heavy drop shadows.
- **Accents**: Rely on a **single signature accent color** for primary CTAs and active states (e.g., deep botanical teal `#108474`, warm amber `#f59e0b`, or rich contrast black `#0f0f0f`), accented with a reserved crimson/burgundy for sale tags (e.g., `#a91c2a`).

### B. Typography Hierarchy
- **Font Stack**: Clean, modern sans-serifs (Inter, Geist Sans, Raleway, or Apercu) with deliberate letter-spacing and weight separation.
- **Display Headings**: Light to medium weight (300 to 500) with wide letter spacing (`tracking-wide` or `tracking-tight` for editorial feel).
- **Metadata & Labels**: Uppercase, small size (`10px`–`12px`), medium weight (`500`), letter-spaced (`0.05em` to `0.1em`).
- **Prices**: Clear numeric hierarchy with current price prominent and original price struck-through in muted secondary tone.

### C. Geometry & Radii
- **Fashion / Luxury Apparel**: Often architecturally **rectilinear** (`rounded-none` or subtle `rounded-sm` for buttons and product cards).
- **Casual / Modern Lifestyle**: Subtle rounding (`rounded-md`, 4px–6px).
- Avoid excessive pill buttons (`rounded-full`) unless specifically used for filter chips or notification badges.

---

## 2. Token Architecture for Tailwind CSS

Map the extracted `DESIGN.md` tokens directly into your Tailwind configuration or CSS variables:

```css
:root {
  /* Canvas & Surfaces */
  --canvas: #fbf7f3;
  --surface-card: #ffffff;
  --surface-subtle: #f5efe9;
  
  /* Text */
  --text-primary: #121212;
  --text-secondary: #6e6e6e;
  --text-muted: #9e9e9e;
  
  /* Borders */
  --border-subtle: #e6dfd8;
  --border-strong: #121212;
  
  /* Brand Accents */
  --accent-primary: #108474;
  --accent-primary-hover: #0c695c;
  --accent-sale: #a91c2a;
  --accent-highlight: #f59e0b;
}
```

---

## 3. Key E-Commerce Components & Patterns

### 1. Product Cards
- **Aspect Ratio**: Vertical fashion image ratio (`3:4` or `4:5`).
- **Hover State**: Smooth image swap or subtle zoom (`scale-[1.03]` transition).
- **Badges**: Minimalist "SALE" or "NEW" pill in corner (`text-[10px] uppercase font-medium`).
- **Variants Preview**: Small color dots or size chips indicating in-stock availability.

### 2. Product Detail Page (PDP)
- **Gallery**: Multi-image thumbnail strip or 2-column sticky scroll gallery.
- **Variant Selectors**:
  - Size chips with clear out-of-stock strike-throughs or disabled state.
  - Color swatches with active selection ring.
- **Primary CTA**: Full-width or prominent "Add to Cart" with immediate tactile feedback, loading state, and quantity limit enforcement.
- **Accordion / Details**: Fabric composition, care instructions, and size guide modal.

### 3. Cart Drawer & Header Navigation
- **Cart Drawer**: Smooth slide-over drawer showing item thumbnail, size, color, quantity stepper, and live subtotal.
- **Free Shipping / Threshold Bar**: Dynamic progress bar incentivizing checkout.
- **Announcement Bar**: Top bar with dismissible shipping or promotion alert.

---

## 4. Searching & Fetching Brand References

This workspace includes a helper script to pull real design system references from the 2,700+ brands in `awesome-design-md-ecommerce`:

### Search for brands in a category:
```bash
node .agents/skills/ecommerce-design-md/scripts/fetch_brand_design.js search fashion
node .agents/skills/ecommerce-design-md/scripts/fetch_brand_design.js search apparel
```

### Fetch a specific brand's design spec:
```bash
node .agents/skills/ecommerce-design-md/scripts/fetch_brand_design.js get rouje
node .agents/skills/ecommerce-design-md/scripts/fetch_brand_design.js get staud
node .agents/skills/ecommerce-design-md/scripts/fetch_brand_design.js get glossier measured
```

---

## 5. Local References Included

The following fashion and apparel references are already downloaded in the skill directory:
- [rouje_design.md](file:///c:/Users/saminpc/Desktop/18%20octorber/.agents/skills/ecommerce-design-md/references/rouje_design.md) — French editorial fashion: warm cream canvas, deep botanical teal CTA, burgundy sale indicators.
- [staud_design.md](file:///c:/Users/saminpc/Desktop/18%20octorber/.agents/skills/ecommerce-design-md/references/staud_design.md) — High-fashion minimalism: rectilinear geometry, monochromatic type hierarchy, amber accents.
