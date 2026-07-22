# Disha For India - Design System

This document is the single source of truth for the public website UI of **Disha For India**, an NGO platform empowering underprivileged students and communities since 2017.

**Final Design Goal:** The final website should represent: *"Disha For India is a trusted organization creating educational opportunities and empowering the next generation of India."*

---

## 1. BRAND DESIGN PRINCIPLES

The website must communicate **Trust**, **Hope**, **Growth**, **Opportunity**, **Social Impact**, and **Human Connection**. Visitors should feel: *"This organization genuinely helps students and creates opportunities."*

### Brand Personality
- Trustworthy
- Compassionate
- Professional
- Inclusive
- Motivational

### Design Keywords
- Empowerment
- Education
- Impact
- Community
- Transformation

---

## 2. COLOR SYSTEM

Our color palette is built on strong blues (trust) and greens (growth/impact), with clear distinctions for backgrounds and typography.

| Color | Hex | Usage |
| :--- | :--- | :--- |
| **Primary Brand Blue** | `#123B8A` | Navbar, Footer, Trust sections, Important backgrounds, Brand identity |
| **Secondary Blue** | `#2563EB` | Primary buttons, Links, Active states, Interactive elements |
| **Impact Green** | `#10B981` | Success states, Growth sections, Volunteer areas, Community impact |
| **Action Yellow** | `#FBBF24` | Donate buttons, Important CTAs, Highlights |
| **Light Background** | `#F8FAFC` | Alternate sections, Cards, Content separation |
| **White** | `#FFFFFF` | Main background, Cards |
| **Heading Text** | `#111827` | Primary typography for headings |
| **Body Text** | `#4B5563` | Paragraphs, standard text |
| **Muted Text** | `#6B7280` | Subtitles, less important text |
| **Borders** | `#E5E7EB` | Dividers, card outlines, subtle boundaries |

---

## 3. TYPOGRAPHY SYSTEM

Typography should feel Professional, Accessible, and Easy to read.

- **Primary Font:** Inter
- **Fallback Fonts:** system-ui, sans-serif

### Hierarchy

- **Hero Heading:** 48px - 64px, Weight: 700
- **Section Heading:** 36px, Weight: 700
- **Card Heading:** 20px, Weight: 600
- **Body Text:** 16px, Line-height: 1.6
- **Small Text:** 14px

---

## 4. LAYOUT SYSTEM

- **Maximum Content Width:** 1200px
- **Container Padding:** 24px
- **Grid:** Clean 12-column layout

### Section Spacing
- **Desktop:** 80px
- **Tablet:** 64px
- **Mobile:** 48px

### Card Layout Rules
- Equal height across rows
- Proper spacing (consistent padding/margins)
- Rounded corners (see Border Radius System)
- Minimal shadows

---

## 5. BORDER RADIUS SYSTEM

Avoid excessive pill shapes. Images should have rounded corners based on these values:

- **Small:** 8px
- **Medium:** 12px
- **Large:** 20px

---

## 6. SHADOW SYSTEM

Shadows should be **subtle**, **soft**, **minimal**, and **professional**.
*Avoid large, floating shadows.*

---

## 7. COMPONENT: NAVBAR DESIGN

- **Height:** 72px
- **Style:** White background, Sticky on scroll
- **Elements:**
  - Logo (Left)
  - Navigation Links: Home, About Us, Our Work, Programs, Get Involved, Resources, Contact
  - CTA Button: Donate Now (Right)
- **CTA Style:** Yellow background (`#FBBF24`), Dark text, Rounded corners

---

## 8. COMPONENT: HERO SECTION

- **Structure:** Two-column layout
- **Left Column:**
  - Small eyebrow text
  - Large heading
  - Description
  - Primary CTA
  - Secondary CTA
- **Right Column:** Large student/community image
- **Image Style:** Natural, real people, education/community focused, rounded shape
- **Feeling:** Hopeful, Inspiring, Trustworthy

---

## 9. COMPONENT: IMPACT STATISTICS SECTION

- **Purpose:** Show organization credibility
- **Style:** Blue background section (`#123B8A`)
- **Structure:** Uses icons, large numbers, and short descriptions
- **Examples:**
  - *1.2M+ People Empowered*
  - *850+ Education Programs*
  - *180+ Health Initiatives*
  - *25K+ Volunteers*

---

## 10. COMPONENT: PROGRAM CARDS

- **Style:** White cards (`#FFFFFF`), Border (`#E5E7EB`), Small shadow
- **Programs Covered:** Education, Employability, Health & Wellness, Financial Literacy, Volunteering, Community Development
- **Content:**
  - Icon
  - Title
  - Description
  - "Learn More" action link/button

---

## 11. COMPONENT: CTA SECTION

- **Purpose:** Encourage community-driven action
- **Style:** Green background (`#10B981`)
- **Actions:** Donate Now, Volunteer With Us, Partner With Us
- **Feeling:** Community driven, encouraging, urgent but positive

---

## 12. COMPONENT: FOOTER DESIGN

- **Background:** Primary Blue (`#123B8A`)
- **Sections:**
  - About
  - Quick Links
  - Programs
  - Contact
- **Elements Included:** Social icons, Address, Phone, Email, Copyright

---

## 13. IMAGE GUIDELINES

- **Subjects:** Indian students, Teachers, Volunteers, Community activities, Education environments
- **Feeling:** Real, Authentic, Emotional
- **Avoid:** Corporate stock photos, Artificial AI-looking images

---

## 14. ANIMATION RULES

- **Duration:** 200ms - 300ms
- **Allowed Animations:** Fade in, Slide up, Hover transitions
- **Avoid:** Complex animations, Parallax scrolling, Distracting or excessive movement

---

## 15. RESPONSIVE DESIGN

- **Mobile:** `< 640px`
  - Mobile hamburger navigation
  - Single-column layouts
  - Touch-friendly buttons
- **Tablet:** `640px - 1024px`
- **Desktop:** `> 1024px`
- **Goal:** Maintain perfect readability and accessible touch targets across all devices.

---

## 16. DEVELOPMENT RULES

- **Technology:** React
- **Code Principles:**
  - Reusable components
  - Data-driven sections
  - Semantic HTML
  - Clean CSS architecture
- **Avoid:**
  - Inline styles scattered everywhere
  - Duplicate CSS
  - Random colors outside the palette
  - Hardcoded repeated values (use constants or variables)
