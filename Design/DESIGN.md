```markdown
# Design System Documentation: The Architectural Plumber

## 1. Overview & Creative North Star
**Creative North Star: "Precision Fluidity"**

To elevate a plumbing service from a generic utility to a high-end essential service for the Gold Coast and Brisbane markets, we must move beyond the "truck-and-wrench" aesthetic. This design system treats water infrastructure with the same respect as high-end architecture. 

We avoid the "template" look by utilizing **intentional asymmetry**—offsetting images and overlapping text elements to create a sense of bespoke engineering. We reject rigid grids in favor of a "Editorial High-Flow" layout, where whitespace acts as a structural element, guiding the user’s eye through trust signals and conversion points with the same ease as water through a well-designed pipe.

---

## 2. Colors & Surface Philosophy

Our palette balances the authoritative depth of **Primary (#003f87)** with the urgent energy of **Tertiary (#663400/Orange)**. 

### The "No-Line" Rule
Explicitly prohibited: 1px solid borders for sectioning or card containment. Boundaries must be defined strictly through:
*   **Background Shifts:** Transitioning from `surface` to `surface-container-low`.
*   **Tonal Transitions:** Using subtle shifts in the surface tier to indicate a change in content.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to create depth:
*   **Base Layer:** `surface` (#f8f9fa) for the main page background.
*   **Secondary Section:** `surface-container-low` (#f3f4f5) for large content blocks (e.g., Service Overviews).
*   **Elevated Components:** `surface-container-lowest` (#ffffff) for cards or trust badges to make them "pop" against a slightly darker background.

### The "Glass & Gradient" Rule
To evoke a modern, premium feel, use **Glassmorphism** for floating navigation bars or floating "Emergency Call" buttons. 
*   **Token Use:** Semi-transparent `surface` with a 12px-20px backdrop-blur.
*   **Signature Textures:** Apply a linear gradient from `primary` (#003f87) to `primary_container` (#0056b3) on hero sections to provide a sense of professional depth and "soul."

---

## 3. Typography: Editorial Authority

We use a dual-typeface system to balance technical precision with approachable service.

*   **Display & Headline (Manrope):** Chosen for its geometric, architectural qualities. Use `display-lg` for hero headlines with tight letter-spacing (-0.02em) to create an authoritative, "high-end magazine" feel.
*   **Title & Body (Inter):** The industry standard for legibility. Use `body-lg` for service descriptions to ensure clarity and trust.

**Hierarchy Tip:** Never center-align long blocks of text. Stick to left-aligned editorial layouts with generous `20` (5rem) or `24` (6rem) spacing between major sections to allow the brand "room to breathe."

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than traditional structural lines.

### The Layering Principle
Stacking tiers creates a soft, natural lift. 
*   *Example:* A `surface-container-lowest` card placed on a `surface-container-low` background. This provides enough contrast for the eye to perceive a container without the "clutter" of a border.

### Ambient Shadows
When a floating effect is required (e.g., a "Book Now" modal), use the following:
*   **Shadow:** 0px 12px 32px rgba(25, 28, 29, 0.06). 
*   **Color:** Tinted with `on_surface` (#191c1d) at low opacity to mimic natural light.

### The "Ghost Border" Fallback
If accessibility requires a border, use the **Ghost Border**: 
*   **Token:** `outline_variant` (#c2c6d4) at 15% opacity.
*   **Rule:** 100% opaque, high-contrast borders are strictly forbidden.

---

## 5. Components

### Buttons (The Conversion Drivers)
*   **Primary CTA:** Uses `tertiary_container` (Orange). High contrast against blue backgrounds. Shape: `full` (9999px) for a modern, friendly feel.
*   **Secondary:** Uses `primary` (#003f87) with `on_primary` text. Use `lg` (1rem) roundedness.
*   **States:** On hover, shift from `tertiary_container` to a slightly deeper `tertiary`.

### Cards & Lists
*   **Forbid Dividers:** Use vertical white space `spacing.6` (1.5rem) or `surface-container` shifts to separate items.
*   **Service Cards:** Use `surface-container-lowest` with an `xl` (1.5rem) corner radius. Add a subtle `primary_fixed` (#d7e2ff) icon background for a premium touch.

### Trust Signal Badges
*   Use `surface_container_high` as a background for "5-Star" or "Master Plumber" badges.
*   Typography: Use `label-md` for secondary metadata to keep the interface clean.

### Input Fields
*   **Background:** `surface-container-highest` (#e1e3e4).
*   **Border:** None. Use a 2px bottom-stroke of `primary` only when the field is active/focused.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical image placements (e.g., a photo of a premium bathroom slightly overlapping a blue `surface-container` block).
*   **Do** use `primary_fixed_dim` for subtle background accents to highlight "Trust Badges."
*   **Do** leverage the `xl` (1.5rem) roundedness for large image containers to maintain the "friendly" brand promise.

### Don’t
*   **Don’t** use a flat #FFFFFF background for the entire site. It looks "unfinished" and "low-budget." Use the `surface` and `surface-container` tiers.
*   **Don’t** use black (#000) for text. Always use `on_surface` (#191c1d) to maintain a sophisticated, soft-contrast look.
*   **Don’t** crowd the "Call to Action." Give every orange button at least `spacing.10` (2.5rem) of clear space on all sides.

---

## 7. Spacing & Rhythm
Consistency is maintained through a strict adherence to the spacing scale. 
*   **Section Padding:** Always use `spacing.20` (5rem) or `spacing.24` (6rem) for top/bottom margins to achieve that "High-End Editorial" feel.
*   **Component Internal Padding:** Use `spacing.6` (1.5rem) for card internals to ensure the content doesn't feel cramped.```