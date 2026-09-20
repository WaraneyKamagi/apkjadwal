---
name: Pixel Productivity Engine
colors:
  surface: '#eafeef'
  surface-dim: '#cbdfd1'
  surface-bright: '#eafeef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e4f9ea'
  surface-container: '#def3e4'
  surface-container-high: '#d9edde'
  surface-container-highest: '#d3e8d9'
  on-surface: '#0e1f16'
  on-surface-variant: '#3f4a3f'
  inverse-surface: '#23342a'
  inverse-on-surface: '#e1f6e7'
  outline: '#6f7a6e'
  outline-variant: '#becabc'
  surface-tint: '#006d32'
  primary: '#006b31'
  on-primary: '#ffffff'
  primary-container: '#198643'
  on-primary-container: '#f7fff3'
  inverse-primary: '#77db8e'
  secondary: '#486554'
  on-secondary: '#ffffff'
  secondary-container: '#c7e7d2'
  on-secondary-container: '#4c6958'
  tertiary: '#755700'
  on-tertiary: '#ffffff'
  tertiary-container: '#946f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#93f8a8'
  primary-fixed-dim: '#77db8e'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#005224'
  secondary-fixed: '#caead4'
  secondary-fixed-dim: '#aeceb9'
  on-secondary-fixed: '#042013'
  on-secondary-fixed-variant: '#304d3d'
  tertiary-fixed: '#ffdf9d'
  tertiary-fixed-dim: '#f0c04e'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#eafeef'
  on-background: '#0e1f16'
  surface-variant: '#d3e8d9'
typography:
  display-lg:
    fontFamily: spaceGrotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: spaceGrotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: spaceGrotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: spaceGrotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: spaceGrotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: spaceGrotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: manrope
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
  label-lg:
    fontFamily: spaceGrotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: spaceGrotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: spaceGrotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
spacing:
  space-2xs: 2px
  space-xs: 4px
  space-sm: 8px
  space-md: 16px
  space-lg: 24px
  space-xl: 32px
  space-2xl: 48px
  space-3xl: 64px
  gutter-mobile: 16px
  gutter-desktop: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system establishes an elevated 16-bit neo-brutalist productivity environment tailored for focused daily planning, task orchestration, and mindful time tracking. By merging the nostalgic tactility of retro RPG interfaces with high-performance editorial clarity, the interface transforms routine scheduling into an intentional, rewarding ritual.

The visual style is characterized by strict orthogonal geometry, 0-pixel radii, structural high-contrast dark forest line-work, and calculated hard drop shadows. It intentionally avoids soft atmospheric blurs, skeuomorphic bevels, or organic roundness. The tone is utilitarian, tactile, and gameful—delivering instant visual feedback through mechanical states, precise modular grids, and razor-sharp typographic hierarchies.

## Colors

The color system functions through purposeful contrast tiers, grounding high-energy retro greens and gameful category pigments within a crisp, architectural canvas.

### Core Foundation
- **Primary (`#3EA35C`)**: The core brand anchor. Used for primary operational triggers, active tab states, and key completion metrics. Supported by vivid mint highlight `#A6F4C5` for focused badge accents.
- **Secondary (`#1E3A2B`)**: Deep moss forest. Defines all structural card boundaries, section partitions, mechanical stroke outlines, and retro solid drop shadows.
- **Tertiary (`#FDCB58`)**: High-visibility daylight gold. Allocated to urgent calendar alerts, high-priority star states, and active milestone pins.
- **Neutral (`#112219`)**: Deepest pine black. Serves as the primary typographic pigment for headers, core reading copy, and active icon glyphs, providing uncompromising legibility against light container planes.

### Canvas & Surface Architecture
- **Surface Canvas Base**: `#F4FBF5` (Cloud Foam), offering a subtle organic warmth that avoids clinical digital glare.
- **Surface Canvas Raised / Cards**: `#FFFFFF` for absolute content contrast against the 2px `#1E3A2B` border system.
- **Surface Muted / Inactive Troughs**: `#E7F6EC`, providing distinct recessed containment for grid headers, disabled inputs, and time-block backdrops.

### Chromatic Status & Weather Identifiers
- **Sky (`#4FA8F9`)**: Deep work routines and routine focus intervals.
- **Night / Indigo (`#3B336A`)**: Retrospectives, sleep schedules, and evening reviews.
- **Frost (`#8EE3F5`)**: Breaks, hydration targets, and wellness pauses.
- **Coral Warning (`#FF6B6B`)**: Task cancellations, blocked milestones, and urgent deadlines.

## Typography

Typography bridges technological precision with readable ergonomic structure. 

- **Display & Headings (`Space Grotesk`)**: Provides an angular, monospaced-adjacent cadence with mechanical alternates that echo retro display controllers without sacrificing optical balance or density. All section headers, numerical timers, and structural card titles use uppercase or tight tracking.
- **Body & Long-form Inputs (`Manrope`)**: Delivers geometric neutrality and open counters for maximum legibility in dense lists, contextual notes, and multi-line descriptions.
- **Labels & Badges (`Space Grotesk`)**: Rendered in uppercase with generous letter-spacing to mimic vintage terminal parameter readouts.

## Layout & Spacing

The layout model is governed by an exact 8px base rhythm, rooted in integer multiples (2px, 4px, 8px, 16px, 24px) to preserve pixel-grid integrity across displays. Sub-pixel rendering must be suppressed: dimensions and offsets must resolve strictly to whole integers.

### Grid Framework
- **Desktop (>= 1024px)**: 12-column rigid fluid grid with 24px gutters and 32px safe margins. Maximum container width is constrained to 1280px to preserve data density.
- **Tablet (768px - 1023px)**: 8-column grid with 16px gutters and 24px margins.
- **Mobile (<= 767px)**: 4-column layout with 16px gutters and 16px outer margins. Multi-column task panes reflow into vertically stacked modular blocks.

Vertical spacing strictly reinforces grouping: elements inside a modular card utilize `space-sm` (8px) and `space-md` (16px), whereas inter-card partitions mandate `space-lg` (24px) or `space-xl` (32px).

## Elevation & Depth

This system intentionally rejects ambient blur fields, diffuse gradients, and soft atmospheric lighting in favor of hard-edged, neo-brutalist pixel offsets. Visual rank is established entirely through hard directional drop shadows, line-weight hierarchy, and surface color anchoring.

### Elevation Levels
- **Level 0 (Recessed / Field Input)**: `box-shadow: none; border: 2px solid #1E3A2B; background-color: #E7F6EC;` Creates inset troughs for unchecked lists, time-slot gutters, and input fields.
- **Level 1 (Base Cards / Standard Modules)**: `box-shadow: 3px 3px 0px #1E3A2B; border: 2px solid #1E3A2B; background-color: #FFFFFF;` Applied to agenda panels, habit modules, and daily cards.
- **Level 2 (Interactive Hover / Priority Items)**: `box-shadow: 5px 5px 0px #1E3A2B; border: 2px solid #1E3A2B; transform: translate(-2px, -2px);` The active state when engaging cards or focused schedule events.
- **Level 3 (Modals / Floats / Active Drawers)**: `box-shadow: 6px 6px 0px #112219; border: 3px solid #112219; background-color: #FFFFFF;` Used for dialog boxes, command palettes, and time-pickers.

### Kinetic Feedback
Interactive elements simulate physical tactile switches. When clicked or pressed (`:active`), elements translate down and right by their shadow offset (e.g., `translate(3px, 3px)` with `box-shadow: 0px 0px 0px`), creating an instantaneous, mechanical depression.

## Shapes

The design system operates on an absolute zero-radius policy (`border-radius: 0px`). Every button, card, input field, dialog, and floating pill features pure 90-degree corners. 

To evoke authentic 16-bit retro hardware aesthetics without sacrificing production code maintainability:
- Corners remain razor-sharp.
- For accent hero tags, specialized pixel-stepped cut-outs may be applied via CSS clip paths (`polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, ...)`), producing an unmistakable digital bite.
- Borders must maintain an absolute 2px or 3px stroke with `#1E3A2B`, never fading into hairline anti-aliased edges.

## Components

### Buttons
- **Primary Button**: Background `#3EA35C`, text `#FFFFFF`, border `2px solid #1E3A2B`, shadow `3px 3px 0px #1E3A2B`. Hover elevates to `4px 4px 0px #1E3A2B` with a `-1px, -1px` translation. Active translates `+3px, +3px` with `0px 0px` shadow. Label uses `label-lg` uppercase typography.
- **Secondary / Neutral Button**: Background `#FFFFFF`, text `#112219`, border `2px solid #1E3A2B`, shadow `3px 3px 0px #1E3A2B`.
- **Destructive Button**: Background `#FF6B6B`, text `#FFFFFF`, border `2px solid #1E3A2B`, shadow `3px 3px 0px #1E3A2B`.

### Cards & Daily Modules
- Constructed with a `2px solid #1E3A2B` border and `3px 3px 0px #1E3A2B` hard shadow.
- Header bars within cards utilize a distinct recessed background (`#E7F6EC`) separated by a bottom `2px solid #1E3A2B` divider rule, holding the section title and contextual status tags.

### Form Inputs & Text Fields
- Inactive state: `#FFFFFF` fill, `2px solid #1E3A2B`, no shadow, text in `body-md` (`#112219`). Placeholder in `#1E3A2B` at 50% opacity.
- Focused state: Fill shifts to `#F4FBF5`, border increases visual authority with `3px 3px 0px #1E3A2B` hard shadow.
- Errored state: Border `#FF6B6B`, background `#FFF5F5`, shadow `3px 3px 0px #FF6B6B`.

### Checkboxes & Binary Selectors
- Custom square box (20x20px), `2px solid #1E3A2B`, `border-radius: 0px`, background `#FFFFFF`.
- Checked state: Background `#3EA35C`. The check glyph is a crisp, un-aliased pixelated check mark drawn with geometric block vectors in `#FFFFFF`.

### Status Badges & Category Chips
- Compact dimensions, 0px radius, `2px solid #1E3A2B`, uppercase `label-sm` font.
- Color variants assign category backgrounds (e.g., Sky `#4FA8F9` for Focus, Gold `#FDCB58` for Priority) while retaining crisp `#112219` text and the unified forest border stroke.

### Lists & Timeline Items
- Time-blocking rails feature a left-hand `2px solid #1E3A2B` axis. Each schedule entry snaps directly onto the rail with a 10x10px square indicator node resting flush along the gridline.