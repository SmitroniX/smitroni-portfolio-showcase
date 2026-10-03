# Implementation Plan - Portfolio Showcase Upgrade

## Architecture & Data Flow
All portfolio content is centralized in `src/data/portfolioData.ts`. UI components consume typed interfaces (`Project`, `Experience`, `PERSONAL_INFO`, `TECH_STACK`, `CERTIFICATIONS`).
By updating `portfolioData.ts` and enhancing the presentation layers (`Projects.tsx`, `Hero.tsx`, `HeroProfileReveal.tsx`, `ExperienceTimeline.tsx`, `ContactSection.tsx`, `Navbar.tsx`), we ensure consistent, type-safe data propagation across the site.

## Task Breakdown
1. **Task 1: Data Model Sync (`src/data/portfolioData.ts`)**
   - Update `PERSONAL_INFO` with Phone, CGPA 8.65, Sem 1 (8.80), Sem 2 (8.50), Class X (85.70%), Class XII (78.40%).
   - Add new projects: `ShadowLauncher`, `SmiTriX`, `BookFlow`, `Code With SmitroniX`.
   - Update `EXPERIENCES`: Add `sudo Unknown (HTB Team #331386)` as Team Lead/Captain, update Naviotech with credential ID `NTSCS2234` and 35% re-render / 28% latency reduction metrics.
   - Update `CERTIFICATIONS`: Add Naviotech ID `NTSCS2234` and Deloitte ID `C9rXmbSJytfjzhKGs`.

2. **Task 2: Projects Visual Mockups (`src/components/Projects.tsx`)**
   - Add mockups for `shadowlauncher` (FPS counter, GL4ES C++ Bridge, mobile HUD).
   - Add mockup for `smitrix` (biometric WebAuthn passkey badge, 1RM workout tracker, zero telemetry).
   - Add mockup for `bookflow` (distributed cluster replication, consensus sync, fault tolerance).
   - Add 'Systems & Engine' category filter.

3. **Task 3: Hero & Profile Reveal (`src/components/Hero.tsx`, `src/components/HeroProfileReveal.tsx`)**
   - Add "Download Resume" CTA button with PDF icon linking to `/resume.pdf`.
   - Add CGPA 8.65 & HTB Team #331386 badges to the Hero and 3D card HUD.
   - Add Phone/WhatsApp quick-connect in Hero actions.

4. **Task 4: Experience & Education Timeline (`src/components/ExperienceTimeline.tsx`)**
   - Display Semester 1 (8.80) & Semester 2 (8.50) breakdown pills.
   - Render Credential IDs with verification badges.
   - Render sudo Unknown Hack The Box Team #331386 with 7 disciplines tags.

5. **Task 5: Contact & Navigation (`src/components/ContactSection.tsx`, `src/components/Navbar.tsx`)**
   - Add WhatsApp & Call action card with `+91 7020120516`.
   - Add Resume PDF card with download and preview actions.
   - Add Resume action button in Navbar for desktop and mobile.

6. **Task 6: Verification & Build Check**
   - Run `npm run build` and ensure bundle compilation completes without errors.
