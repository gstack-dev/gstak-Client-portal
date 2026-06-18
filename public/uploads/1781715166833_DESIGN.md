---
name: G-Stack Digital Agency System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system embodies a premium, high-performance SaaS aesthetic tailored for a sophisticated digital agency. It prioritizes clarity, technical precision, and a sense of "engineered quality" inspired by industry leaders like Linear and Vercel.

The visual narrative is **Modern Professionalism**. It utilizes a "Hyper-Clean" approach: expansive whitespace, razor-sharp typography, and a restrained use of color to highlight critical actions. The atmosphere is calm yet authoritative, signaling reliability and elite technical execution. Subtle glassmorphism and layered shadows add depth without cluttering the interface, creating a sense of sophisticated spatial awareness.

## Colors
The palette is architectural, using high-contrast neutrals to establish a clear hierarchy.

- **Midnight Navy (#0F172A):** Used for primary brand elements, deep backgrounds, and high-emphasis text. It provides the "anchor" for the visual weight.
- **Royal Blue (#2563EB):** The functional primary. Used for interactive states, primary buttons, and indicating progress or selection.
- **Emerald Green (#10B981):** A high-visibility accent reserved for success states, growth metrics, and secondary calls to action that require a positive emotional lift.
- **Background & Surface:** The interface sits on a Light Gray (#F8FAFC) canvas, with pure White (#FFFFFF) used for cards and elevated containers to create a distinct "layered" effect.

## Typography
The system uses a pairing of **Plus Jakarta Sans** (substituted for Poppins for a more modern, premium geometric feel) and **Inter**.

- **Headlines:** Set in Plus Jakarta Sans with tighter letter-spacing and substantial weight. This creates a "Display" quality that feels intentional and high-end.
- **Body:** Inter is used for all functional text to ensure maximum readability and a systematic, technical appearance.
- **Hierarchy:** Use `label-caps` for small metadata or overlines. Ensure `body-lg` is used sparingly for lead paragraphs to maintain the "SaaS" density common in productivity tools.

## Layout & Spacing
The layout relies on a **Fluid Grid** model with strict adherence to a 4px/8px baseline rhythm.

- **Grid:** Use a 12-column grid for desktop with 24px gutters. For mobile, shift to a 4-column grid with 16px margins.
- **Rhythm:** Generous vertical whitespace (`spacing-xl` or `2xl`) should separate major sections to give the content "room to breathe," mirroring the minimalist philosophy of Vercel and Stripe.
- **Containment:** Content should generally be capped at a max-width of 1280px for readability, centered on the viewport.

## Elevation & Depth
Depth is communicated through **Layered Shadows** and **Tonal Surfaces**, avoiding heavy borders where possible.

- **Ambient Shadows:** Surfaces use a multi-layered shadow approach. A very soft, large-radius shadow (e.g., `0px 20px 25px -5px rgba(0,0,0,0.05)`) combined with a tighter, sharper shadow for definition.
- **Glassmorphism:** Overlays, navigation bars, and dropdown menus should use a backdrop filter (`blur: 12px`) with a semi-transparent white fill (`rgba(255, 255, 255, 0.8)`).
- **Interactivity:** On hover, elements should "lift" slightly (decreasing shadow blur/increasing offset) or transition background colors subtly.

## Shapes
The shape language is "Softly Geometric."

- **Standard Radius:** 12px (`rounded-md`) is the baseline for buttons and input fields.
- **Large Radius:** 16px (`rounded-lg`) is used for cards, modals, and primary containers.
- **Pill:** Use 9999px for tags, badges, and search bars to provide visual contrast against the structured grid.
- **Consistency:** Never mix sharp corners with rounded elements within the same component hierarchy.

## Components
Consistent application of brand tokens across functional elements:

- **Buttons:** Primary buttons use Midnight Navy or Royal Blue with white text. High-padding (12px 24px). Secondary buttons use a subtle gray border or transparent background with a subtle hover state.
- **Inputs:** Use `surface_hex` with a 1px border (#E2E8F0). On focus, the border transitions to Royal Blue with a soft 3px outer glow (ring).
- **Cards:** White background, 16px radius, and "Level 1" ambient shadow. Padding should be generous (24px or 32px).
- **Chips/Badges:** Small, pill-shaped elements using low-opacity versions of the accent colors (e.g., Emerald Green at 10% opacity for the background and 100% for the text).
- **Navigation:** The top-bar should utilize the glassmorphism effect, pinned to the top with a subtle bottom border (#F1F5F9).
- **Lists:** Clean rows with 1px dividers. Use `Inter` Medium for list item titles and Regular for descriptions.