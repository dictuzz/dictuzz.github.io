/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION: LINK IN BIO
 * Edit this file to change your profile, links, and icons.
 * No HTML knowledge required.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CONFIG_DATA = {
    // 0. SITE CONFIG (NEW: Customization Pack 1)
    siteTitle: "@dictuzz | Data Scientist & Creator",
    meta: {
        description: "Personal hub of Benedictus Richard Ricardo (Dictuzz). Data Scientist, Leader, Creator.",
        keywords: "Data Scientist, Portfolio, Benedictus Richard Ricardo, dictuzz"
    },
    // NEW: Features Flags
    features: {
        blog: false, // Migrated to Medium
        resume: true
    },
    // NEW: Shared Config Merged
    analytics: {
        id: 'G-PJMTM772L5',
        enabled: true
    },
    theme: {
        storageKey: 'dictuzz-theme',
        default: 'dark',
        background: 'aurora', // 'aurora', 'network', 'static'
        fonts: {
            display: "Outfit", // Google Font Name
            body: "Inter"      // Google Font Name
        },
        colors: {
            primary: "#00F5D4", // Cyber Cyan
            secondary: "#7B61FF" // Electric Purple
        }
    },
    // NEW: Layout Config (Widget System)
    layout: [
        { type: "hero" },
        { type: "bio" },
        { type: "links" },
        { type: "socials" } // Moved to bottom
    ],
    site: {
        name: 'dictuzz',
        url: 'https://dictuzz.github.io',
        author: 'Benedictus Richard Ricardo'
    },
    favicon: "assets/images/favicon.svg",

    socialAliases: {
        "x": "fa-brands fa-x-twitter",
        "insta": "fab fa-instagram",
        "linkedin": "fab fa-linkedin",
        "github": "fab fa-github",
        "email": "fas fa-envelope",
        "whatsapp": "fab fa-whatsapp",
        "calendar": "fas fa-calendar-day"
    },

    // 1. PROFILE INFO
    profile: {
        avatar: "assets/images/dictuzz.webp", // Path to your image
        name: "dictuzz",
        tagline: "Quam Plurimi et Quam Aptissimi",
        // Use <br> for line breaks
        bio: ""
    },

    socials: [
        { icon: "linkedin", url: "https://www.linkedin.com/in/dictuzz" },
        { icon: "insta", url: "https://www.instagram.com/dictuzz" },
        { icon: "github", url: "https://github.com/dictuzz" }
    ],

    links: [
        {
            label: "Get to Know Me",
            url: "https://dictuzz.github.io/resume/",
            icon: "fas fa-id-card",
            style: "primary",
            category: "Contact"
        },
        {
            type: "widget",
            widget: "email",
            category: "Contact"
        },
        {
            label: "Send Me WhatsApp Message",
            url: "https://api.whatsapp.com/send?phone=6285186888630",
            icon: "fab fa-whatsapp",
            style: "primary",
            category: "Contact"
        },
        {
            type: "widget",
            widget: "meeting",
            category: "Contact"
        },
        {
            label: "Read My Blog",
            url: "https://medium.com/@dictuzz",
            icon: "fab fa-medium",
            style: "secondary",
            category: "Content"
        }
    ],


    // 3. FOOTER
    footer: {
        year: "2025",
        copyright: "© 2025 <a href='https://dictuzz.github.io/resume' target='_blank'>dictuzz</a>. All rights reserved."
    }
};
