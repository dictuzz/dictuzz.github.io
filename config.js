/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION — LINK IN BIO
 * Edit this file to change your profile, links, and icons.
 * No HTML knowledge required.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CONFIG_DATA = {
    // 1. PROFILE INFO
    profile: {
        avatar: "assets/images/dictuzz.webp", // Path to your image
        name: "dictuzz",
        tagline: "Data Scientist • Content Creator • MC • Vibe Coder",
        // Use <br> for line breaks
        bio: ""
    },

    links: [
        {
            label: "Get to Know Me",
            url: "https://dictuzz.github.io/card/",
            icon: "fas fa-id-card",
            style: "primary",
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
            label: "Send Me an E-Mail",
            url: "mailto:cadrichardricardo@gmail.com",
            icon: "fas fa-envelope",
            style: "primary",
            category: "Contact"
        },
        {
            label: "Schedule our Meeting!",
            url: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ30metKuP1X9heG54IxOgznfw1jGKfjjW5xPtReYATxGnXTZ3vDTi87MmFPgUahljIQgzXndJ9p",
            icon: "fas fa-calendar-day",
            style: "secondary",
            category: "Contact"
        },
        {
            label: "Read My Blog",
            url: "https://dictuzz.github.io/blog/",
            icon: "fas fa-book",
            style: "secondary",
            category: "Content"
        },
        {
            label: "Find Me on LinkedIn",
            url: "https://www.linkedin.com/in/dictuzz",
            icon: "fab fa-linkedin",
            style: "secondary",
            category: "Socials"
        },
        {
            label: "Follow My Insta",
            url: "https://www.instagram.com/dictuzz",
            icon: "fab fa-instagram",
            style: "secondary",
            category: "Socials"
        },
        {
            label: "Contribute to My Code",
            url: "https://github.com/dictuzz",
            icon: "fab fa-github",
            style: "secondary",
            category: "Socials"
        }
    ],


    // 3. FOOTER
    footer: {
        year: "2025",
        copyright: "© 2025 <a href='https://dictuzz.github.io/resume' target='_blank'>dictuzz</a>. All rights reserved."
    }
};
