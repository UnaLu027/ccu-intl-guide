# CCU International Student Friendly Campus Guide — Design Ideas

## 目標
建置一個以「服務導向」為核心的國立中正大學國際生友善校園導引系統，核心功能為「關鍵字搜尋服務需求」與「服務類別篩選」。

---

<response>
<text>

## Idea 1: Wayfinding Signage System (環境指標系統設計)

**Design Movement**: Inspired by airport wayfinding and transit signage systems — clear, functional, universally understood.

**Core Principles**:
1. Clarity-first: Every element serves a navigational purpose
2. Universal comprehension: Icons and color-coding transcend language barriers
3. Progressive disclosure: Show only what's needed at each step
4. Directional confidence: Users always know where they are and where to go next

**Color Philosophy**: A high-contrast system using deep navy (#1B2A4A) as the primary wayfinding color, warm amber (#E8A838) for interactive highlights and CTAs, soft cream (#FAF7F2) for backgrounds, and muted sage (#7A9E7E) for success/confirmation states. The palette evokes trust and institutional reliability while remaining warm and approachable.

**Layout Paradigm**: Vertical rail navigation on the left (like a transit map line) with content panels that slide in from the right. The rail acts as a persistent "you are here" indicator. On mobile, it collapses into a bottom tab bar with the search prominently centered.

**Signature Elements**:
1. "Service Line" — A vertical colored line connecting service categories, mimicking a metro map
2. "Arrival Cards" — Indoor guidance cards that unfold step-by-step like boarding pass instructions
3. Directional arrows and floor indicators integrated into card UI

**Interaction Philosophy**: Interactions feel like following signs — tap a category and the content slides in directionally. Search results appear as "destination boards" with clear next-action buttons.

**Animation**: Slide transitions follow the direction of navigation (left-to-right for deeper content, right-to-left for going back). Cards expand with a gentle accordion motion. Search results cascade in with staggered timing.

**Typography System**: 
- Display: DM Sans Bold (clean, geometric, highly legible)
- Body: Source Sans 3 (excellent readability, multilingual support)
- Monospace accents for floor numbers and building codes

</text>
<probability>0.08</probability>
</response>

<response>
<text>

## Idea 2: Warm Campus Companion (溫暖校園夥伴設計)

**Design Movement**: Scandinavian-inspired warmth meets Japanese information design — friendly, organized, human-centered.

**Core Principles**:
1. Empathy-driven: Design acknowledges the anxiety of being lost in a foreign campus
2. Warmth through materiality: Soft textures, rounded shapes, warm tones
3. Information layering: Most important info first, details on demand
4. Bilingual harmony: Chinese and English coexist naturally, not as afterthoughts

**Color Philosophy**: Warm terracotta (#C4704B) as the primary accent representing the earth and brick of campus buildings, paired with soft sand (#F5EDE3) backgrounds, deep forest (#2D4A3E) for text, and gentle sky blue (#89B4C8) for interactive elements. The palette feels like a warm afternoon on campus.

**Layout Paradigm**: Card-based masonry layout with a prominent search hero section at the top. Cards have varying heights based on content importance. The search bar is always accessible via a floating pill at the bottom of the screen on mobile.

**Signature Elements**:
1. "Campus Compass" — A circular category selector that radiates outward like a compass rose
2. "Step-by-step Breadcrumbs" — Indoor navigation shown as illustrated footstep paths
3. Soft paper-texture backgrounds on cards giving a handbook/guide feel

**Interaction Philosophy**: Everything feels like flipping through a friendly guidebook. Cards lift on hover with soft shadows. Category selection feels like turning to a chapter.

**Animation**: Gentle spring physics on all transitions. Cards float up on scroll with parallax depth. The search bar morphs smoothly between collapsed and expanded states.

**Typography System**:
- Display: Outfit (modern geometric with warmth)
- Body: Noto Sans TC + Noto Sans (perfect CJK + Latin harmony)
- Accent: Handwritten-style for friendly callouts

</text>
<probability>0.06</probability>
</response>

<response>
<text>

## Idea 3: Digital Campus Kiosk (數位校園資訊站設計)

**Design Movement**: Inspired by modern museum kiosks and smart city information terminals — bold, structured, data-rich.

**Core Principles**:
1. Task completion speed: Minimize taps/clicks to reach the answer
2. Bold categorization: Large, tappable category blocks dominate the interface
3. Contextual intelligence: Search understands intent, not just keywords
4. Two-phase navigation: Outdoor → Indoor guidance as a clear two-step flow

**Color Philosophy**: Deep charcoal (#2C2C2C) header/nav creating a "kiosk frame", with a bright white content area. Electric teal (#0EA5A0) for primary actions, warm coral (#E8725C) for urgent/important items, and soft lavender (#E8E0F0) for secondary backgrounds. High contrast ensures readability in any lighting.

**Layout Paradigm**: Full-width horizontal bands stacked vertically. The top band is always the search/filter zone. Below it, content is organized in a 3-column grid on desktop that collapses to full-width cards on mobile. Each "band" represents a different way to find information.

**Signature Elements**:
1. "Service Tiles" — Large, icon-rich category tiles arranged in a grid, each with a subtle gradient
2. "Navigation Timeline" — Indoor guidance presented as a vertical timeline with building cross-section illustrations
3. Persistent "Quick Actions" floating bar with the 3 most common tasks

**Interaction Philosophy**: Bold, decisive interactions — large touch targets, immediate feedback. Feels like using a well-designed information terminal.

**Animation**: Crisp, snappy transitions (200ms). Cards scale up on press. Category tiles have a subtle pulse animation to draw attention. Page transitions use a clean fade-slide.

**Typography System**:
- Display: Space Grotesk (bold, technical, modern)
- Body: Inter Variable (clean, neutral, excellent for data)
- CJK: Noto Sans TC (consistent with Latin baseline)

</text>
<probability>0.07</probability>
</response>

---

## 選擇

我選擇 **Idea 1: Wayfinding Signage System（環境指標系統設計）**。

理由：此設計最符合本專案的核心目標——幫助國際生「從需求出發找到正確單位」。機場/地鐵式的指標系統設計天然就是為了「引導陌生人到達目的地」而生，與本專案的服務導向定位完美契合。深藍與琥珀色的配色方案既專業又溫暖，左側的「服務線」導航能清楚呈現服務類別的層級關係，而「到達卡片」的設計則完美解決了「到達建築後不知道下一步」的痛點。
